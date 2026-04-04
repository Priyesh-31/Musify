# 🎵 Musify — React + TypeScript + Tailwind CSS

A production-grade music streaming web app with real song playback via the iTunes API.

---

## ⚡ Quick Start (5 minutes)

### 1. Install dependencies
```bash
cd musify
npm install
```

### 2. Start dev server
```bash
npm run dev
```

Open http://localhost:5173 — real songs will load immediately, no API key needed.

---

## 📁 Project Structure

```
musify/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Logo.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PlayerBar.tsx
│   │   ├── TrackRow.tsx
│   │   ├── TrackCard.tsx
│   │   ├── TrackList.tsx
│   │   ├── CardGrid.tsx
│   │   └── Toast.tsx
│   ├── views/             # Page-level views
│   │   ├── HomeView.tsx
│   │   ├── SearchView.tsx
│   │   ├── ChartsView.tsx
│   │   └── LibraryViews.tsx
│   ├── store/
│   │   └── index.ts       # Zustand state (player + app)
│   ├── services/
│   │   ├── itunes.ts      # iTunes API (no key needed)
│   │   ├── jamendo.ts     # Jamendo API (free key, full tracks)
│   │   └── localSongs.ts  # Your own MP3 files
│   ├── hooks/
│   │   └── index.ts       # useKeyboard, useSearch, useProgressDrag
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   ├── data/
│   │   └── static.ts      # Moods, artists, playlists
│   ├── utils/
│   │   └── index.ts       # fmtTime, truncate, clamp
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css          # Tailwind + custom CSS
├── public/
│   └── songs/             # ← PUT YOUR OWN MP3s HERE
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🎧 Song Sources — How to Add Your Own

### Option A: iTunes API (already working, no key needed)
- Returns **30-second previews** of any song
- Free, legal, zero setup
- Powers all search, charts, moods, trending sections

### Option B: Your Own MP3 Files (full tracks, no limits)

1. Create the folder: `public/songs/` and `public/songs/covers/`
2. Drop your MP3s in: `public/songs/yourtrack.mp3`
3. Open `src/services/localSongs.ts`
4. Add entries:

```typescript
export const LOCAL_SONGS: Track[] = [
  {
    id: 'local-1',
    title: 'Your Song Title',
    artist: 'Artist Name',
    album: 'Album Name',
    art: '/songs/covers/cover1.jpg',   // put JPG in public/songs/covers/
    preview: '/songs/yourtrack.mp3',   // put MP3 in public/songs/
    duration: 213,                      // seconds
    source: 'local',
  },
]
```

5. Import and use in any view:
```typescript
import { getLocalSongs } from '@/services/localSongs'
const myTracks = getLocalSongs()
```

### Option C: Jamendo API (free key, 600K+ full tracks)

1. Register free at https://developer.jamendo.com
2. Get your Client ID
3. Open `src/services/jamendo.ts`
4. Replace: `const JAMENDO_CLIENT_ID = 'YOUR_JAMENDO_CLIENT_ID'`
5. Use in any view:
```typescript
import { searchJamendo } from '@/services/jamendo'
const tracks = await searchJamendo('electronic chill', 20)
```

### Option D: Spotify API (OAuth, metadata + 30s previews)

```typescript
// src/services/spotify.ts
const CLIENT_ID = 'your_spotify_client_id'    // developer.spotify.com
const REDIRECT  = 'http://localhost:5173/callback'

// 1. Redirect user to Spotify login
export function loginSpotify() {
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT)}&scope=streaming`
  window.location.href = url
}

// 2. After redirect, extract token from URL hash
export function getToken(): string | null {
  const hash = window.location.hash
  const match = hash.match(/access_token=([^&]+)/)
  return match ? match[1] : null
}

// 3. Search
export async function searchSpotify(query: string, token: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.tracks.items.map((t: any) => ({
    id:       t.id,
    title:    t.name,
    artist:   t.artists[0].name,
    album:    t.album.name,
    art:      t.album.images[0]?.url || '',
    preview:  t.preview_url || '',   // 30s or null
    duration: Math.round(t.duration_ms / 1000),
    source:   'custom' as const,
  }))
}
```

---

## ⌨️ Keyboard Shortcuts

| Key        | Action           |
|------------|------------------|
| `Space`    | Play / Pause     |
| `→`        | Next track       |
| `←`        | Previous track   |
| `L`        | Like/unlike      |
| `S`        | Toggle shuffle   |
| `R`        | Toggle repeat    |
| `M`        | Toggle mute      |

---

## 🏗️ Build for Production

```bash
npm run build
# Output → dist/
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 🔧 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Framework | React 18 + TypeScript    |
| Styling   | Tailwind CSS v3          |
| State     | Zustand                  |
| Build     | Vite                     |
| Audio     | HTML5 Audio API          |
| Music     | iTunes Search API (free) |

---

## 📦 Adding More Features

### Real-time lyrics
```bash
npm install lrclib   # free lyrics API, no key
```

### Audio visualizer (waveform)
```bash
npm install wavesurfer.js
```

### PWA (offline support)
```bash
npm install vite-plugin-pwa
```
Then add to `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa'
plugins: [react(), VitePWA({ registerType: 'autoUpdate' })]
```
