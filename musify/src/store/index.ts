import { create } from 'zustand'
import type { Track, ViewId, CollectionMeta } from '@/types'
import {
  addRecent,
  fetchLibraryState,
  persistLike,
  removeLike,
} from '@/services/libraryApi'

// ─── Audio singleton ─────────────────────────────────────────
export const audioEl = new Audio()
audioEl.preload = 'metadata'

// ─── Player Store ────────────────────────────────────────────
interface PlayerStore {
  currentTrack:  Track | null
  queue:         Track[]
  queueIndex:    number
  isPlaying:     boolean
  isShuffle:     boolean
  isRepeat:      boolean
  isMuted:       boolean
  volume:        number      // 0-1
  progress:      number      // seconds
  duration:      number      // seconds

  // Actions
  setQueue:         (tracks: Track[], startIndex?: number) => void
  playItem:         (track: Track, newQueue?: Track[]) => void
  togglePlay:       () => void
  nextTrack:        () => void
  prevTrack:        () => void
  seekTo:           (seconds: number) => void
  setVolume:        (v: number) => void
  toggleMute:       () => void
  toggleShuffle:    () => void
  toggleRepeat:     () => void
  setProgress:      (s: number) => void
  setDuration:      (s: number) => void
  setIsPlaying:     (v: boolean) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue:        [],
  queueIndex:   -1,
  isPlaying:    false,
  isShuffle:    false,
  isRepeat:     false,
  isMuted:      false,
  volume:       0.75,
  progress:     0,
  duration:     0,

  setProgress:  (s) => set({ progress: s }),
  setDuration:  (s) => set({ duration: s }),
  setIsPlaying: (v) => set({ isPlaying: v }),

  setQueue: (tracks, startIndex = 0) => {
    set({ queue: tracks, queueIndex: startIndex })
  },

  playItem: (track, newQueue) => {
    if (!track.preview) {
      useAppStore.getState().showToast('No preview available for this track')
      return
    }
    const q = newQueue ?? get().queue
    const idx = q.findIndex(t => t.id === track.id)
    set({ currentTrack: track, queue: q, queueIndex: idx >= 0 ? idx : 0 })
    audioEl.src = track.preview
    audioEl.volume = get().isMuted ? 0 : get().volume
    audioEl.play().catch(() =>
      useAppStore.getState().showToast('Tap Play to start audio')
    )
    useAppStore.getState().addToRecent(track)
  },

  togglePlay: () => {
    const { currentTrack } = get()
    if (!currentTrack) { useAppStore.getState().showToast('Pick a track first'); return }
    if (audioEl.paused) audioEl.play().catch(() => {})
    else audioEl.pause()
  },

  nextTrack: () => {
    const { queue, queueIndex, isShuffle } = get()
    if (!queue.length) return
    const next = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (queueIndex + 1) % queue.length
    get().playItem(queue[next])
    set({ queueIndex: next })
  },

  prevTrack: () => {
    const { queue, queueIndex } = get()
    if (audioEl.currentTime > 3) { audioEl.currentTime = 0; return }
    if (!queue.length) return
    const prev = (queueIndex - 1 + queue.length) % queue.length
    get().playItem(queue[prev])
    set({ queueIndex: prev })
  },

  seekTo: (seconds) => {
    audioEl.currentTime = seconds
    set({ progress: seconds })
  },

  setVolume: (v) => {
    audioEl.volume = v
    set({ volume: v, isMuted: v === 0 })
  },

  toggleMute: () => {
    const { isMuted, volume } = get()
    const next = !isMuted
    audioEl.volume = next ? 0 : volume
    set({ isMuted: next })
  },

  toggleShuffle: () => {
    const next = !get().isShuffle
    set({ isShuffle: next })
    useAppStore.getState().showToast(next ? 'Shuffle on' : 'Shuffle off')
  },

  toggleRepeat: () => {
    const next = !get().isRepeat
    set({ isRepeat: next })
    useAppStore.getState().showToast(next ? 'Repeat on' : 'Repeat off')
  },
}))

// ─── App Store ───────────────────────────────────────────────
interface AppStore {
  view:              ViewId
  likedTracks:       Record<string | number, Track>
  recentTracks:      Track[]
  collectionTracks:  Track[]
  collectionMeta:    CollectionMeta | null
  collectionLoading: boolean
  toast:             string | null
  toastTimer:        ReturnType<typeof setTimeout> | null

  setView:           (v: ViewId) => void
  setCollection:     (tracks: Track[], meta: CollectionMeta) => void
  setCollectionLoading: (loading: boolean) => void
  toggleLike:        (track: Track) => void
  isLiked:           (id: string | number) => boolean
  addToRecent:       (track: Track) => void
  hydrateLibrary:    () => Promise<void>
  showToast:         (msg: string) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  view:              'home',
  likedTracks:       {},
  recentTracks:      [],
  collectionTracks:  [],
  collectionMeta:    null,
  collectionLoading: false,
  toast:             null,
  toastTimer:        null,

  setView: (v) => set({ view: v }),

  setCollection: (tracks, meta) => {
    set({ collectionTracks: tracks, collectionMeta: meta, view: 'collection' })
  },

  setCollectionLoading: (loading) => {
    set({ collectionLoading: loading })
  },

  toggleLike: (track) => {
    const { likedTracks, showToast } = get()
    if (likedTracks[track.id]) {
      const next = { ...likedTracks }
      delete next[track.id]
      set({ likedTracks: next })
      showToast('Removed from Liked Songs')
      removeLike(track.id).catch(() => {
        // Backend might be offline; local UX still works.
      })
    } else {
      set({ likedTracks: { ...likedTracks, [track.id]: track } })
      showToast('Added to Liked Songs ♥')
      persistLike(track).catch(() => {
        // Backend might be offline; local UX still works.
      })
    }
  },

  isLiked: (id) => !!get().likedTracks[id],

  addToRecent: (track) => {
    const prev = get().recentTracks.filter(t => t.id !== track.id)
    set({ recentTracks: [track, ...prev].slice(0, 50) })
    addRecent(track).catch(() => {
      // Backend might be offline; local UX still works.
    })
  },

  hydrateLibrary: async () => {
    try {
      const data = await fetchLibraryState()
      const liked = data.likes.reduce<Record<string | number, Track>>((acc, t) => {
        acc[t.id] = t
        return acc
      }, {})

      set({
        likedTracks: liked,
        recentTracks: data.recents,
      })
    } catch {
      // Keep local state when backend is unavailable.
    }
  },

  showToast: (msg) => {
    const { toastTimer } = get()
    if (toastTimer) clearTimeout(toastTimer)
    const t = setTimeout(() => set({ toast: null }), 2500)
    set({ toast: msg, toastTimer: t })
  },
}))

// ─── Audio event bridge (runs once at module load) ───────────
audioEl.addEventListener('timeupdate', () => {
  usePlayerStore.getState().setProgress(audioEl.currentTime)
})
audioEl.addEventListener('loadedmetadata', () => {
  usePlayerStore.getState().setDuration(audioEl.duration)
})
audioEl.addEventListener('play',  () => usePlayerStore.getState().setIsPlaying(true))
audioEl.addEventListener('pause', () => usePlayerStore.getState().setIsPlaying(false))
audioEl.addEventListener('ended', () => {
  const { isRepeat, nextTrack } = usePlayerStore.getState()
  if (isRepeat) { audioEl.currentTime = 0; audioEl.play() }
  else nextTrack()
})
