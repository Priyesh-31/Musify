import type { Mood, ArtistCard, Playlist } from '@/types'

export const MOODS: Mood[] = [
  // Hollywood & International
  { name: 'Energized', emoji: '⚡', query: 'energetic workout', color: '#1a1500' },
  { name: 'Chill',     emoji: '🌊', query: 'chill lofi relaxing', color: '#001518' },
  { name: 'Focus',     emoji: '🎯', query: 'focus study instrumental', color: '#0e0020' },
  { name: 'Happy',     emoji: '☀️', query: 'happy upbeat fun', color: '#1a0e00' },
  { name: 'Romantic',  emoji: '💫', query: 'romantic love ballad', color: '#1a0010' },
  { name: 'Melancholy',emoji: '🌧️', query: 'sad indie melancholy', color: '#000d18' },
  // Indian
  { name: 'Bollywood Party', emoji: '🎬', query: 'bollywood party songs dance', color: '#1a0a30' },
  { name: 'Desi Vibes',      emoji: '🎶', query: 'hindi indie acoustic chill', color: '#1a001a' },
  { name: 'Romantic Hindi',  emoji: '❤️', query: 'hindi romantic love songs', color: '#2a0010' },
  { name: 'Devotional',      emoji: '🙏', query: 'bhajan devotional spiritual', color: '#0a0a1a' },
]

export const FEATURED_ARTISTS: ArtistCard[] = [
  // Hollywood & International
  { name: 'The Weeknd',       genre: 'R&B',       emoji: '🎤', query: 'The Weeknd' },
  { name: 'Dua Lipa',         genre: 'Pop',        emoji: '💃', query: 'Dua Lipa' },
  { name: 'Kendrick Lamar',   genre: 'Hip-Hop',    emoji: '🎧', query: 'Kendrick Lamar' },
  { name: 'Billie Eilish',    genre: 'Alt Pop',    emoji: '🖤', query: 'Billie Eilish' },
  { name: 'M83',              genre: 'Electronic', emoji: '🌌', query: 'M83 band' },
  { name: 'SZA',              genre: 'R&B',        emoji: '🌸', query: 'SZA music' },
  { name: 'Jungle',           genre: 'Soul',       emoji: '🌿', query: 'Jungle band music' },
  { name: 'Tyler the Creator',genre: 'Hip-Hop',    emoji: '🎨', query: 'Tyler the Creator' },
  // Indian Artists
  { name: 'Arijit Singh',     genre: 'Bollywood',  emoji: '💫', query: 'Arijit Singh' },
  { name: 'Shreya Ghoshal',   genre: 'Playback',   emoji: '🎤', query: 'Shreya Ghoshal' },
  { name: 'Badshah',          genre: 'Hip-Hop',    emoji: '🎧', query: 'Badshah rapper' },
  { name: 'Neha Kakkar',      genre: 'Pop',        emoji: '💃', query: 'Neha Kakkar' },
  { name: 'Yo Yo Honey Singh', genre: 'Rap',      emoji: '🔥', query: 'Yo Yo Honey Singh' },
  { name: 'Priyanka Chopra',  genre: 'Bollywood', emoji: '⭐', query: 'Priyanka Chopra songs' },
]

export const MADE_FOR_YOU = [
  // Hollywood & International Mix
  { name: 'Daily Mix 1',     desc: 'Electronic & Chill', emoji: '🎛️', query: 'electronic chill ambient' },
  { name: 'Time Capsule',    desc: 'Songs from 2018',    emoji: '⏰', query: 'top hits 2018' },
  { name: 'Discover Weekly', desc: 'New picks for you',  emoji: '🔭', query: 'indie alternative discovery' },
  { name: 'Release Radar',   desc: 'Fresh drops',        emoji: '📡', query: 'new pop releases 2024' },
  { name: 'On Repeat',       desc: 'Your favourites',    emoji: '🔁', query: 'pop hits classic' },
  { name: 'Chill Mix',       desc: 'Low energy vibes',   emoji: '🌙', query: 'ambient slow chill' },
  // Indian Mix
  { name: 'Bollywood Hits',  desc: 'Top Bollywood songs', emoji: '🎬', query: 'bollywood top hits songs' },
  { name: 'Hindi Indie',     desc: 'Indie Hindi music',   emoji: '🎸', query: 'hindi indie original songs' },
  { name: 'Love Songs Hindi', desc: 'Romantic Hindi songs', emoji: '💕', query: 'hindi romantic songs collection' },
  { name: 'Party Nights',    desc: 'Bollywood party mix',  emoji: '🎉', query: 'bollywood party dance songs' },
]

export const SIDEBAR_PLAYLISTS: Playlist[] = [
  // Hollywood & International
  { name: 'Late Night Drives', emoji: '🌙', query: 'lo-fi night drive' },
  { name: 'Workout Bangers',   emoji: '💪', query: 'workout gym motivation' },
  { name: 'Sunday Morning',    emoji: '☕', query: 'acoustic sunday morning' },
  { name: 'Road Trip',         emoji: '🚗', query: 'road trip classic rock' },
  // Indian
  { name: 'Bollywood Classics', emoji: '🎬', query: 'bollywood classic songs' },
  { name: 'Hindi Gym Mix',      emoji: '🏋️', query: 'hindi motivational workout' },
  { name: 'Desi Love Songs',    emoji: '💑', query: 'hindi duet romantic songs' },
  { name: 'Party Bangers',      emoji: '🎉', query: 'bollywood dance party songs' },
]

export const CHART_GENRES = [
  // Hollywood & International
  { label: 'Top 100',    query: 'top hits 2024' },
  { label: 'Pop',        query: 'pop hits' },
  { label: 'Electronic', query: 'electronic dance' },
  { label: 'Hip-Hop',    query: 'hip hop hits' },
  { label: 'Rock',       query: 'rock hits' },
  { label: 'Jazz',       query: 'jazz' },
  { label: 'R&B',        query: 'rnb soul' },
  // Indian
  { label: 'Bollywood',  query: 'bollywood hits top songs' },
  { label: 'Hindi Pop',  query: 'hindi pop indie songs' },
  { label: 'Punjabi',    query: 'punjabi songs hits' },
  { label: 'Tamil',      query: 'tamil songs hits' },
  { label: 'Sufi / Ghazal', query: 'sufi ghazal qawwali' },
]

export const SEARCH_GENRES = [
  'Pop', 'Rock', 'Electronic', 'Hip-Hop', 'R&B', 'Jazz', 'Indie', 'Classical',
  'Bollywood', 'Hindi', 'Punjabi', 'Tamil', 'Sufi', 'Ghazal',
]
