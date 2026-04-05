import 'dotenv/config'

const must = (value: string | undefined, key: string) => {
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  databaseUrl: must(process.env.DATABASE_URL, 'DATABASE_URL'),
}
