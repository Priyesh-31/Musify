import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { searchRouter } from './routes/search.js'
import { libraryRouter } from './routes/library.js'
import { playlistsRouter } from './routes/playlists.js'
import { recommendationsRouter } from './routes/recommendations.js'

const DEV_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (origin === config.frontendOrigin || DEV_ORIGIN_RE.test(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked for origin: ${origin}`))
  },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'musify-backend' })
})

app.use('/api/search', searchRouter)
app.use('/api/library', libraryRouter)
app.use('/api/playlists', playlistsRouter)
app.use('/api/recommendations', recommendationsRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(config.port, () => {
  console.log(`Musify backend running on http://localhost:${config.port}`)
})
