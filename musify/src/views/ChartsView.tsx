import { useState, useEffect } from 'react'
import { searchItunes } from '@/services/itunes'
import { usePlayerStore } from '@/store'
import TrackList from '@/components/TrackList'
import { CHART_GENRES } from '@/data/static'
import type { Track } from '@/types'
import clsx from 'clsx'

export default function ChartsView() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tracks, setTracks]       = useState<Track[]>([])
  const [loading, setLoading]     = useState(false)
  const [cache, setCache]         = useState<Record<string, Track[]>>({})
  const { setQueue } = usePlayerStore()

  const loadChart = async (query: string) => {
    if (cache[query]) { setTracks(cache[query]); return }
    setLoading(true)
    const data = await searchItunes(query, 25)
    setCache(c => ({ ...c, [query]: data }))
    setTracks(data)
    setLoading(false)
  }

  useEffect(() => { loadChart(CHART_GENRES[0].query) }, [])

  const handleGenre = (idx: number) => {
    setActiveIdx(idx)
    loadChart(CHART_GENRES[idx].query)
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-5">
        <h1 className="font-syne font-bold text-[22px] tracking-tight text-tx">Live Charts</h1>
        <p className="text-xs text-tx3 mt-1">Top tracks worldwide — powered by iTunes</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {CHART_GENRES.map((g, i) => (
          <button key={g.label}
            className={clsx('chip', activeIdx === i && 'active')}
            onClick={() => handleGenre(i)}>
            {g.label}
          </button>
        ))}
      </div>

      <TrackList tracks={tracks} loading={loading} />
    </div>
  )
}
