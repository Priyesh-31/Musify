// ─── Core track type ───────────────────────────────────────
export interface Track {
  id: number | string
  title: string
  artist: string
  album: string
  art: string          // album artwork URL
  preview: string      // audio preview URL (30s or full)
  duration: number     // seconds
  genre?: string
  source?: 'itunes' | 'local' | 'jamendo' | 'custom'
}

// ─── iTunes API raw response ────────────────────────────────
export interface ItunesResult {
  trackId: number
  trackName: string
  artistName: string
  collectionName?: string
  artworkUrl100?: string
  previewUrl?: string
  trackTimeMillis?: number
  primaryGenreName?: string
}

export interface ItunesResponse {
  resultCount: number
  results: ItunesResult[]
}

// ─── Jamendo API raw response ───────────────────────────────
// Only used if you add a Jamendo key (see services/jamendo.ts)
export interface JamendoTrack {
  id: string
  name: string
  artist_name: string
  album_name: string
  album_image: string
  audio: string       // full MP3
  duration: number
}

// ─── Player / App state ─────────────────────────────────────
export type ViewId = 'home' | 'search' | 'charts' | 'liked' | 'recent'

export interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  isShuffle: boolean
  isRepeat: boolean
  isMuted: boolean
  volume: number
  progress: number    // 0-100
  duration: number
}

export interface AppState {
  view: ViewId
  likedTracks: Record<string | number, Track>
  recentTracks: Track[]
  toast: string | null
}

// ─── Mood / Static data ─────────────────────────────────────
export interface Mood {
  name: string
  emoji: string
  query: string
  color: string
}

export interface ArtistCard {
  name: string
  genre: string
  emoji: string
  query: string
}

export interface Playlist {
  name: string
  emoji: string
  query: string
}
