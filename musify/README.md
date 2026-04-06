# 🎵 Musify - Full Stack Music Streaming App

A modern, responsive music streaming application built with React, Express, TypeScript, and PostgreSQL. Featuring persistent user libraries, queue management, and music discovery with both Hollywood and Indian music content.

---

## ✨ Features

### 🎯 Music Discovery
- **Browse by Mood** - 10 curated moods (Energized, Chill, Focus, Happy, Romantic, Melancholy, Bollywood Party, Desi Vibes, Romantic Hindi, Devotional)
- **Featured Artists** - Mix of international and Indian artists (The Weeknd, Arijit Singh, Badshah, Shreya Ghoshal, etc.)
- **Live Charts** - Real-time trending tracks across 12+ genres (Hollywood, Bollywood, Punjabi, Tamil, Sufi/Ghazal, etc.)
- **Made for You** - Personalized collections (Daily Mix, Discover Weekly, Release Radar, Bollywood Hits, Hindi Indie, etc.)
- **Search** - Full-text search with genre filtering

### 🎧 Playback Controls
- ▶️ Play / Pause
- ⏭️ Next / Previous track
- 🔀 Shuffle mode
- 🔁 Repeat mode
- 🔊 Volume control with mute
- ⏱️ Timeline scrubbing with real-time progress

### 💾 Persistent Library
- ❤️ **Liked Songs** - Save favorite tracks (synced to PostgreSQL)
- 🕐 **Recently Played** - Auto-tracked play history
- 📱 **Device-based Sessions** - Persistence across browser refreshes via localStorage + PostgreSQL
- 🎜 **Queue Management** - Play full collections or individual tracks

### 🎬 Content Collections
- **Playlists** - Sidebar playlists (Late Night Drives, Workout Bangers, Sunday Morning, Road Trip, Bollywood Classics, Hindi Gym Mix, Desi Love Songs, Party Bangers)
- **Collections** - View full track lists for any mood, artist, or playlist
- **New Releases** - Fresh drops with album artwork

### 🌍 Multi-Region Support
- **Hollywood** - Pop, Rock, Electronic, Hip-Hop, R&B, Jazz, Indie
- **Bollywood** - Hindi, Punjabi, Tamil, Sufi/Ghazal, Devotional
- **Global** - Mixed playlists combining both regions

---

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe code
- **Zustand** - State management (player + app state)
- **Tailwind CSS** - Styling
- **Vite** - Build tool (fast dev server)

### Backend
- **Express.js** - REST API server
- **TypeScript** - Type-safe backend
- **Prisma ORM** - Database abstraction + migrations
- **Zod** - Schema validation

### Database
- **PostgreSQL** (Neon hosted) - Persistent storage
- **Tables:** User, TrackCache, UserLike, UserRecent, Playlist, PlaylistTrack

### Data Sources
- **iTunes API** - Song metadata, preview URLs, artwork
- **Local storage** - Device ID, UI preferences

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon cloud PostgreSQL)
- npm or yarn

### 1. Clone & Install

```bash
# Frontend
cd musify
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment

**Frontend** - Create `.env`:
```bash
VITE_API_BASE_URL="http://localhost:4000"
```

**Backend** - Create `backend/.env`:
```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
```

### 3. Setup Database

```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

This creates all tables: User, TrackCache, UserLike, UserRecent, Playlist, PlaylistTrack

### 4. Run Both Servers

**Terminal 1 - Frontend:**
```bash
cd musify
npm run dev
# http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# http://localhost:4000
```

### 5. Open Browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
musify/
├── src/
│   ├── components/          # React components
│   │   ├── PlayerBar.tsx    # Playback controls + timeline
│   │   ├── Sidebar.tsx      # Navigation + playlists
│   │   ├── TrackList.tsx    # Track listing
│   │   ├── CardGrid.tsx     # Album grid layout
│   │   └── ...
│   ├── views/               # Page views
│   │   ├── HomeView.tsx     # Main discovery page
│   │   ├── SearchView.tsx   # Search interface
│   │   ├── ChartsView.tsx   # Trending charts
│   │   ├── CollectionView.tsx # Collection player
│   │   └── LibraryViews.tsx   # Liked + Recently Played
│   ├── store/               # Zustand state management
│   ├── services/            # API clients
│   │   ├── itunes.ts        # iTunes API wrapper
│   │   ├── libraryApi.ts    # Backend API calls
│   │   └── ...
│   ├── data/
│   │   └── static.ts        # Moods, artists, playlists
│   ├── types/               # TypeScript types
│   ├── utils/               # Utilities
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── backend/
│   ├── src/
│   │   ├── server.ts        # Express app + CORS
│   │   ├── db.ts            # Prisma singleton
│   │   ├── config.ts        # Environment config
│   │   ├── routes/          # API endpoints
│   │   │   ├── library.ts   # /api/library (likes, recents)
│   │   │   ├── search.ts    # /api/search (iTunes proxy)
│   │   │   ├── playlists.ts # /api/playlists (CRUD)
│   │   │   └── recommendations.ts # Recommendations
│   │   └── lib/
│   │       ├── users.ts     # User CRUD
│   │       └── tracks.ts    # Track caching
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env.example
│   └── package.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🔌 API Endpoints

### Library Management
- `POST /api/library/init` - Create/init user session
- `GET /api/library?deviceId=...` - Get all likes + recents
- `POST /api/library/likes` - Add liked track
- `DELETE /api/library/likes/:trackId?deviceId=...` - Remove like
- `POST /api/library/recents` - Log recently played

### Search & Discovery
- `GET /api/search?q=...&limit=...` - Search iTunes
- `GET /api/search/charts?genre=...&limit=...` - Genre charts

### Playlists (Future)
- `GET /api/playlists?deviceId=...` - List user playlists
- `POST /api/playlists` - Create playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove from playlist

### Recommendations
- `GET /api/recommendations?deviceId=...` - Genre-based recommendations

---

## 🎮 Usage

### Playing Music
1. Click any mood, artist, or playlist to open collection
2. Click **"Play All"** to queue entire collection
3. Click individual track to play with full collection as queue
4. Use PlayerBar controls to navigate

### Saving Tracks
- Click ❤️ icon to like (saves to Liked Songs)
- Liked tracks persist across sessions
- Recently played auto-tracked on any play

### Navigation
- **Home** - Discovery hub (moods, artists, trending)
- **Search** - Full-text search by song, artist, genre
- **Charts** - Live trending by genre
- **Liked Songs** - Your saved favorites
- **Recently Played** - Play history
- **Playlists** (Sidebar) - Quick access to curated collections

---

## 🔐 Security & Best Practices

### Environment Variables
- `.env` files are **NOT** committed to git (in `.gitignore`)
- Use `.env.example` as template
- Never share secret database URLs

### CORS
- Backend accepts requests from localhost:* and 127.0.0.1:*
- Configure `FRONTEND_ORIGIN` for production

### Data Persistence
- Device ID stored in browser `localStorage`
- User preferences synced to PostgreSQL
- Offline mode works with local state fallback

---

## 📦 Build & Deploy

### Production Build
```bash
# Frontend
npm run build      # Creates dist/
npm run preview    # Test production build locally

# Backend
npm run build      # Compiles TypeScript to dist/
```

### Deploy Frontend
- Vercel, Netlify, GitHub Pages, or AWS S3
- Environment: `VITE_API_BASE_URL=https://your-backend.com`

### Deploy Backend
- Railway, Render, Heroku, AWS EC2
- Set `DATABASE_URL`, `PORT`, `FRONTEND_ORIGIN`
- Run `npm run prisma:push` on first deployment

---

## 🐛 Troubleshooting

### Liked songs disappear after refresh
- ✅ Ensure backend is running (`npm run dev` in backend/)
- ✅ Check `.env` has correct `VITE_API_BASE_URL`
- ✅ Verify PostgreSQL connection in `backend/.env`

### PlayerBar not showing
- ✅ Both servers running and connected
- ✅ Browser console has no errors (F12)
- ✅ Try hard refresh (Ctrl+F5)

### Search results empty
- ✅ iTunes API available (check network tab)
- ✅ Try different search term
- ✅ Check if backend CORS is blocking requests

### Database errors
- ✅ Run `npm run prisma:push` to create tables
- ✅ Verify `DATABASE_URL` connection string
- ✅ Test with `npm run prisma:studio` to browse DB

---

## 📝 Development Workflow

### Adding a New Mood
1. Edit `src/data/static.ts` - Add to `MOODS` array
2. Provide `name`, `emoji`, `query`, `color`
3. Save and hot-reload works automatically

### Adding Playlist
1. Add to `SIDEBAR_PLAYLISTS` in `src/data/static.ts`
2. Provide `name`, `emoji`, `query` (search term)
3. Click in sidebar to load

### Adding API Endpoint
1. Create route in `backend/src/routes/`
2. Export from route file
3. Import in `backend/src/server.ts`
4. Add to `app.use('/api/...', routerName)`
5. Call via `fetch()` in frontend service

---

## 🎯 Roadmap

- [ ] User authentication (JWT/OAuth)
- [ ] Playlist creation UI
- [ ] Advanced recommendations (ML-based)
- [ ] Offline mode with service workers
- [ ] Dark/Light theme toggle
- [ ] Lyrics display
- [ ] Social sharing (Spotify-like)
- [ ] Mobile app (React Native)

---

## 📄 License

MIT - Free to use for personal and commercial projects

---

## 👨‍💻 Tech Notes

### Device-Based Sessions
Currently uses device ID (stored in localStorage + DB) instead of user accounts. Perfect for MVP. To upgrade to full authentication:
1. Add `Auth0` or `Supabase Auth`
2. Replace `deviceId` with `userId` 
3. Update schema to link tracks to users via `userId`

### iTunes API Rate Limit
No authentication required, but has rate limits. For production:
1. Cache more aggressively
2. Switch to Spotify API (requires auth)
3. Use MusicBrainz or custom music database

### Performance
- Zustand for UI state (instant updates)
- Optimistic updates (like button feedback immediate)
- Background sync (data persists even if backend fails temporarily)

---

## 🙋 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Check backend logs
3. Verify both servers are running
4. Review `.env` configuration
5. Check database connection with `npm run prisma:studio`

---

**Built with ❤️ for music lovers worldwide 🌍🎵**

Terminal 2:
```bash
cd ..
npm run dev
```

Open `http://localhost:5173`.

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

## What The Backend Adds

- Persistent liked songs per device/user
- Persistent recently played history
- Playlist CRUD APIs
- Recommendation endpoint seeded from user likes
- Search/charts proxied through backend

## Frontend-Backend Connection

- Frontend calls backend through `VITE_API_BASE_URL`
- Device session is initialized by `src/services/libraryApi.ts`
- `src/store/index.ts` hydrates likes and recents from `/api/library`
- Likes are synced to `/api/library/likes`
- Recent plays are synced to `/api/library/recents`

## Backend API Summary

- `GET /health`
- `GET /api/search?q=...&limit=...`
- `GET /api/search/charts?genre=...&limit=...`
- `POST /api/library/init`
- `GET /api/library?deviceId=...`
- `POST /api/library/likes`
- `DELETE /api/library/likes/:trackId?deviceId=...`
- `POST /api/library/recents`
- `GET /api/playlists?deviceId=...`
- `POST /api/playlists`
- `POST /api/playlists/:playlistId/tracks`
- `DELETE /api/playlists/:playlistId/tracks/:trackId?deviceId=...`
- `GET /api/recommendations?deviceId=...`

## Optional Song Sources

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
