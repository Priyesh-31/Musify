import { useState, useRef } from 'react'
import { useSearch } from '@/hooks'
import { usePlayerStore } from '@/store'
import TrackList from '@/components/TrackList'
import { SEARCH_GENRES } from '@/data/static'
import clsx from 'clsx'

export default function SearchView() {
  const { query, results, loading, search } = useSearch()
  const { setQueue } = usePlayerStore()
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleGenre = async (genre: string) => {
    setActiveGenre(genre)
    search(genre + ' hits')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleInput = (val: string) => {
    setActiveGenre(null)
    search(val)
  }

  const showEmpty = !loading && !results.length && !query

  return (
    <div className="px-6 py-6">
      {/* Search input */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-tx3 w-[14px] h-[14px] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          ref={inputRef}
          className="w-full bg-s2 border border-white/10 rounded-full py-[10px] pl-[34px] pr-4 text-[13px] text-tx placeholder-tx3 outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,255,71,0.07)]"
          placeholder="Artists, songs, albums…"
          autoFocus
          onChange={e => handleInput(e.target.value)}
        />
      </div>

      {/* Genre chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        {SEARCH_GENRES.map(g => (
          <button key={g}
            className={clsx('chip', activeGenre === g && 'active')}
            onClick={() => handleGenre(g)}>
            {g}
          </button>
        ))}
      </div>

      {/* Results */}
      {showEmpty ? (
        <div className="text-center py-16 text-tx3">
          <div className="text-4xl mb-3 opacity-50">🎵</div>
          <div className="text-sm font-medium text-tx2 mb-1">Search for music</div>
          <div className="text-xs">Type anything or pick a genre above</div>
        </div>
      ) : (
        <TrackList
          tracks={results}
          loading={loading}
          emptyMessage="No results found"
          emptyIcon="🔇"
        />
      )}
    </div>
  )
}
