import type { Mood, ArtistCard, Playlist } from '@/types'

export const MOODS: Mood[] = [
  { name: 'Energized', emoji: '⚡', query: 'energetic workout', color: '#1a1500' },
  { name: 'Chill',     emoji: '🌊', query: 'chill lofi relaxing', color: '#001518' },
  { name: 'Focus',     emoji: '🎯', query: 'focus study instrumental', color: '#0e0020' },
  { name: 'Happy',     emoji: '☀️', query: 'happy upbeat fun', color: '#1a0e00' },
  { name: 'Romantic',  emoji: '💫', query: 'romantic love ballad', color: '#1a0010' },
  { name: 'Melancholy',emoji: '🌧️', query: 'sad indie melancholy', color: '#000d18' },
]

export const FEATURED_ARTISTS: ArtistCard[] = [
  { name: 'The Weeknd',       genre: 'R&B',       emoji: '🎤', query: 'The Weeknd' },
  { name: 'Dua Lipa',         genre: 'Pop',        emoji: '💃', query: 'Dua Lipa' },
  { name: 'Kendrick Lamar',   genre: 'Hip-Hop',    emoji: '🎧', query: 'Kendrick Lamar' },
  { name: 'Billie Eilish',    genre: 'Alt Pop',    emoji: '🖤', query: 'Billie Eilish' },
  { name: 'M83',              genre: 'Electronic', emoji: '🌌', query: 'M83 band' },
  { name: 'SZA',              genre: 'R&B',        emoji: '🌸', query: 'SZA music' },
  { name: 'Jungle',           genre: 'Soul',       emoji: '🌿', query: 'Jungle band music' },
  { name: 'Tyler the Creator',genre: 'Hip-Hop',    emoji: '🎨', query: 'Tyler the Creator' },
]

export const MADE_FOR_YOU = [
  { name: 'Daily Mix 1',     desc: 'Electronic & Chill', emoji: '🎛️', query: 'electronic chill ambient' },
  { name: 'Time Capsule',    desc: 'Songs from 2018',    emoji: '⏰', query: 'top hits 2018' },
  { name: 'Discover Weekly', desc: 'New picks for you',  emoji: '🔭', query: 'indie alternative discovery' },
  { name: 'Release Radar',   desc: 'Fresh drops',        emoji: '📡', query: 'new pop releases 2024' },
  { name: 'On Repeat',       desc: 'Your favourites',    emoji: '🔁', query: 'pop hits classic' },
  { name: 'Chill Mix',       desc: 'Low energy vibes',   emoji: '🌙', query: 'ambient slow chill' },
]

export const SIDEBAR_PLAYLISTS: Playlist[] = [
  { name: 'Late Night Drives', emoji: '🌙', query: 'lo-fi night drive' },
  { name: 'Workout Bangers',   emoji: '💪', query: 'workout gym motivation' },
  { name: 'Sunday Morning',    emoji: '☕', query: 'acoustic sunday morning' },
  { name: 'Road Trip',         emoji: '🚗', query: 'road trip classic rock' },
]

export const CHART_GENRES = [
  { label: 'Top 100',    query: 'top hits 2024' },
  { label: 'Pop',        query: 'pop hits' },
  { label: 'Electronic', query: 'electronic dance' },
  { label: 'Hip-Hop',    query: 'hip hop hits' },
  { label: 'Rock',       query: 'rock hits' },
  { label: 'Jazz',       query: 'jazz' },
  { label: 'R&B',        query: 'rnb soul' },
]

export const SEARCH_GENRES = [
  'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'R&B', 'Jazz', 'Indie', 'Classical',
]
