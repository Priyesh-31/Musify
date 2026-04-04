import { useState, useEffect, useCallback } from 'react'
import { usePlayerStore, useAppStore } from '@/store'
import { searchItunes } from '@/services/itunes'
import TrackList from '@/components/TrackList'
import { CardRow, CardGrid } from '@/components/CardGrid'
import { MOODS, FEATURED_ARTISTS, MADE_FOR_YOU } from '@/data/static'
import type { Track } from '@/types'
import clsx from 'clsx'

const TREND_GENRES = [
  { label: 'Pop',        query: 'pop hits' },
  { label: 'Electronic', query: 'electronic dance' },
  { label: 'Hip-Hop',    query: 'hip hop hits' },
  { label: 'Rock',       query: 'rock hits' },
  { label: 'R&B',        query: 'rnb soul' },
]

export default function HomeView() {
  const { playItem, setQueue } = usePlayerStore()
  const { showToast, setView } = useAppStore()

  const [trendGenre, setTrendGenre] = useState(TREND_GENRES[0])
  const [trendTracks, setTrendTracks]   = useState<Track[]>([])
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendCache, setTrendCache]     = useState<Record<string, Track[]>>({})

  const [newTracks, setNewTracks]   = useState<Track[]>([])
  const [newLoading, setNewLoading] = useState(false)

  const [searchVal, setSearchVal] = useState('')
  const [liveTimer, setLiveTimer] = useState<ReturnType<typeof setTimeout>>()

  // Load trending on mount and genre change
  const loadTrending = useCallback(async (query: string) => {
    if (trendCache[query]) { setTrendTracks(trendCache[query]); return }
    setTrendLoading(true)
    const tracks = await searchItunes(query, 15)
    setTrendCache(c => ({ ...c, [query]: tracks }))
    setTrendTracks(tracks)
    setTrendLoading(false)
  }, [trendCache])

  useEffect(() => { loadTrending(trendGenre.query) }, [trendGenre])

  // Load new releases on mount
  useEffect(() => {
    setNewLoading(true)
    searchItunes('new music 2024', 10).then(t => { setNewTracks(t); setNewLoading(false) })
  }, [])

  // Live search redirect
  const handleLiveSearch = (val: string) => {
    setSearchVal(val)
    clearTimeout(liveTimer)
    if (val.trim().length < 2) return
    const t = setTimeout(() => setView('search'), 600)
    setLiveTimer(t)
  }

  const loadPlay = async (query: string) => {
    showToast(`Loading ${query}…`)
    const tracks = await searchItunes(query, 15)
    if (!tracks.length) { showToast('Nothing found'); return }
    playItem(tracks[0], tracks)
  }

  return (
    <div>
      {/* Top bar */}
      <div className="px-6 pt-6 pb-0 flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-[420px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-tx3 w-[14px] h-[14px] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="w-full bg-s2 border border-white/10 rounded-full py-[9px] pl-[34px] pr-4 text-[13px] text-tx placeholder-tx3 outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,255,71,0.07)]"
            placeholder="Search songs, artists…"
            value={searchVal}
            onChange={e => handleLiveSearch(e.target.value)}
            onFocus={() => setView('search')}
          />
        </div>
        <button className="w-[34px] h-[34px] rounded-lg bg-s2 border border-white/10 text-tx2 flex items-center justify-center hover:bg-s3 hover:text-tx transition-all" onClick={() => showToast('3 new notifications')}>
          <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <button className="w-[34px] h-[34px] rounded-lg bg-s2 border border-white/10 text-tx2 flex items-center justify-center hover:bg-s3 hover:text-tx transition-all" onClick={() => showToast('Jay Doe · Premium Member')}>
          <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
        </button>
      </div>

      {/* HERO */}
      <div
        className="mx-6 mb-6 rounded-[20px] overflow-hidden relative p-8 min-h-[190px] flex flex-col justify-end cursor-pointer group"
        onClick={() => loadPlay('electronic dance hits')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e0320] via-[#071630] to-[#001508]" />
        <div className="absolute top-[-50px] right-[-30px] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(232,255,71,0.15)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[80px] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(155,93,229,0.18)_0%,transparent_65%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-[5px] bg-accent/13 border border-accent/28 text-accent text-[10px] font-semibold tracking-[.1em] uppercase px-[10px] py-1 rounded-full mb-3">
            <span className="w-[5px] h-[5px] rounded-full bg-accent animate-blink" />
            Trending Now
          </div>
          <h1 className="font-syne font-extrabold text-[30px] leading-[1.08] tracking-[-1px] mb-2 text-tx">
            Midnight<br />Frequencies
          </h1>
          <p className="text-[12px] text-tx2">Electronic beats for late-night sessions and deep focus.</p>
          <div className="flex gap-[9px] mt-4">
            <button
              className="inline-flex items-center gap-[7px] bg-accent text-black font-medium text-[13px] px-4 py-[9px] rounded-lg hover:bg-accent2 hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(232,255,71,0.25)] transition-all"
              onClick={e => { e.stopPropagation(); loadPlay('electronic dance hits') }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Play Mix
            </button>
            <button
              className="inline-flex items-center gap-[7px] bg-white/7 text-tx font-medium text-[13px] px-4 py-[9px] rounded-lg border border-white/10 hover:bg-white/12 transition-all"
              onClick={e => { e.stopPropagation(); showToast('Saved to library ✓') }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-8">
        {/* MOODS */}
        <Section title="Browse by Mood">
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map(m => (
              <div key={m.name} className="mood-card" style={{ background: m.color }}
                onClick={() => loadPlay(m.query)}>
                <span className="text-[22px] block mb-[6px]">{m.emoji}</span>
                <div className="text-[12px] font-semibold text-tx">{m.name}</div>
                <div className="text-[10px] text-white/35 mt-[1px]">Tap to play</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ARTISTS */}
        <Section title="Featured Artists" onMore={() => loadPlay('pop top hits')}>
          <div className="flex gap-[14px] overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {FEATURED_ARTISTS.map(a => (
              <div key={a.name} className="flex-shrink-0 text-center cursor-pointer group/art"
                onClick={() => loadPlay(a.query)}>
                <div className="w-[64px] h-[64px] rounded-full mx-auto mb-[6px] bg-s3 border-2 border-transparent group-hover/art:border-accent transition-all duration-200 flex items-center justify-center text-[24px]">
                  {a.emoji}
                </div>
                <div className="text-[11px] font-semibold text-tx">{a.name}</div>
                <div className="text-[10px] text-tx3">{a.genre}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* TRENDING */}
        <Section title="Trending Now">
          <div className="flex gap-[6px] flex-wrap mb-4">
            {TREND_GENRES.map(g => (
              <button key={g.label}
                className={clsx('chip', trendGenre.label === g.label && 'active')}
                onClick={() => setTrendGenre(g)}>
                {g.label}
              </button>
            ))}
          </div>
          <TrackList tracks={trendTracks} loading={trendLoading} />
        </Section>

        {/* NEW RELEASES */}
        <Section title="New Releases" onMore={() => searchItunes('new music 2024', 10)}>
          <CardRow tracks={newTracks} loading={newLoading} />
        </Section>

        {/* MADE FOR YOU */}
        <Section title="Made for You">
          <CardGrid
            tracks={MADE_FOR_YOU.map((m, i) => ({
              id: `mfy-${i}`, title: m.name, artist: m.desc,
              album: '', art: '', preview: '', duration: 0, source: 'local' as const,
            }))}
            cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          />
          {/* Overlay MFY tiles with click handlers */}
          <div className="sr-only">
            {MADE_FOR_YOU.map(m => (
              <button key={m.name} onClick={() => loadPlay(m.query)}>{m.name}</button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children, onMore }: {
  title: string
  children: React.ReactNode
  onMore?: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-syne font-bold text-[16px] tracking-[-0.3px] text-tx">{title}</h2>
        {onMore && (
          <button className="text-xs text-tx2 hover:text-accent transition-colors" onClick={onMore}>
            See all
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
