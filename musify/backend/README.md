# Musify Backend

Express + Prisma backend for the Musify frontend.

## Features

- Search and charts API (proxied from iTunes)
- Persistent liked tracks and recently played tracks
- Playlist CRUD + add/remove tracks
- Basic recommendation endpoint seeded from liked history

## 1) Setup

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` with your PostgreSQL credentials
3. Install dependencies
4. Generate Prisma client
5. Create tables

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
```

## 2) Run

```bash
npm run dev
```

Server runs at `http://localhost:4000`

## 3) Core endpoints

- `GET /health`
- `GET /api/search?q=arijit&limit=20`
- `GET /api/search/charts?genre=pop&limit=25`
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
