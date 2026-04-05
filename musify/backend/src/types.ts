export interface Track {
  id: string | number
  title: string
  artist: string
  album: string
  art: string
  preview: string
  duration: number
  genre?: string
  source?: 'itunes' | 'local' | 'jamendo' | 'custom' | string
}
