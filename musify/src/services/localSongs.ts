/**
 * Local Songs Service
 * ───────────────────
 * HOW TO ADD YOUR OWN SONGS:
 *
 *   1. Put your MP3 files in:   src/assets/songs/
 *   2. Put cover art (JPG/PNG): src/assets/covers/
 *   3. Add an entry to LOCAL_SONGS below
 *   4. Done — they'll appear in the app immediately
 *
 * Example entry:
 *   {
 *     id: 'local-1',
 *     title: 'My Song',
 *     artist: 'My Artist',
 *     album: 'My Album',
 *     art: '/src/assets/covers/my-cover.jpg',
 *     preview: '/src/assets/songs/my-song.mp3',
 *     duration: 213,   // seconds
 *     source: 'local',
 *   }
 *
 * Files in src/assets/ are bundled by Vite automatically.
 * For large libraries, serve files from a folder outside src/
 * and reference them as '/songs/filename.mp3' (put in /public/songs/).
 */

import type { Track } from '@/types'

// ─── ADD YOUR SONGS HERE ─────────────────────────────────────
export const LOCAL_SONGS: Track[] = [
  // Uncomment and fill these once you add files:
  //
  // {
  //   id: 'local-1',
  //   title: 'Song Name',
  //   artist: 'Artist Name',
  //   album: 'Album Name',
  //   art: '/songs/covers/cover1.jpg',    // put in /public/songs/covers/
  //   preview: '/songs/track1.mp3',       // put in /public/songs/
  //   duration: 240,
  //   source: 'local',
  // },
]
// ─────────────────────────────────────────────────────────────

/**
 * Public folder alternative (recommended for many songs):
 *
 *   /public/
 *     songs/
 *       track1.mp3
 *       track2.mp3
 *     covers/
 *       cover1.jpg
 *
 * Then reference as: preview: '/songs/track1.mp3'
 * Vite serves /public/ files at the root URL — no import needed.
 */

export function getLocalSongs(): Track[] {
  return LOCAL_SONGS
}
