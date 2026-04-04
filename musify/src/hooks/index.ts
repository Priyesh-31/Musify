import { useEffect, useRef, useState, useCallback } from 'react'
import { usePlayerStore, useAppStore } from '@/store'
import { searchItunes } from '@/services/itunes'
import type { Track } from '@/types'

// ─── Keyboard shortcuts ──────────────────────────────────────
export function useKeyboard() {
  const { togglePlay, nextTrack, prevTrack, toggleShuffle, toggleRepeat, toggleMute } = usePlayerStore()
  const { toggleLike, isLiked, currentTrack } = { ...usePlayerStore(), ...useAppStore() }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.code) {
        case 'Space':       e.preventDefault(); togglePlay(); break
        case 'ArrowRight':  nextTrack(); break
        case 'ArrowLeft':   prevTrack(); break
      }
      switch (e.key.toLowerCase()) {
        case 's': toggleShuffle(); break
        case 'r': toggleRepeat(); break
        case 'm': toggleMute(); break
        case 'l':
          if (currentTrack) useAppStore.getState().toggleLike(currentTrack)
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePlay, nextTrack, prevTrack, toggleShuffle, toggleRepeat, toggleMute])
}

// ─── Debounced search ────────────────────────────────────────
export function useSearch(debounceMs = 400) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const search = useCallback((q: string) => {
    setQuery(q)
    clearTimeout(timerRef.current)
    if (!q.trim()) { setResults([]); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const tracks = await searchItunes(q, 20)
      setResults(tracks)
      setLoading(false)
    }, debounceMs)
  }, [debounceMs])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { query, results, loading, search }
}

// ─── Fetch tracks with loading/error state ───────────────────
export function useTracks(queryFn: (() => Promise<Track[]>) | null) {
  const [tracks, setTracks]   = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async (fn: () => Promise<Track[]>) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fn()
      setTracks(data)
    } catch {
      setError('Failed to load tracks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (queryFn) load(queryFn)
  }, []) // eslint-disable-line

  return { tracks, loading, error, reload: load }
}

// ─── Progress bar drag ───────────────────────────────────────
export function useProgressDrag(onSeek: (ratio: number) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const seek = (clientX: number) => {
    if (!ref.current) return
    const { left, width } = ref.current.getBoundingClientRect()
    onSeek(Math.max(0, Math.min(1, (clientX - left) / width)))
  }

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; seek(e.clientX) }

  useEffect(() => {
    const move = (e: MouseEvent) => { if (dragging.current) seek(e.clientX) }
    const up   = () => { dragging.current = false }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [onSeek])

  return { ref, onMouseDown }
}
