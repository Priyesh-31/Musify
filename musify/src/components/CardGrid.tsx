import TrackCard from './TrackCard'
import type { Track } from '@/types'

function CardSkeleton() {
  return (
    <div className="bg-s2 rounded-2xl p-3">
      <div className="aspect-square rounded-xl skeleton mb-[10px]" />
      <div className="h-3 skeleton rounded w-3/4 mb-2" />
      <div className="h-2 skeleton rounded w-1/2" />
    </div>
  )
}

interface Props {
  tracks: Track[]
  loading?: boolean
  cols?: string   // tailwind grid-cols class
}

/** Responsive grid of cards */
export function CardGrid({ tracks, loading, cols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' }: Props) {
  if (loading) {
    return (
      <div className={`grid ${cols} gap-3`}>
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }
  return (
    <div className={`grid ${cols} gap-3`}>
      {tracks.map(t => <TrackCard key={t.id} track={t} queue={tracks} />)}
    </div>
  )
}

/** Horizontal scrollable row of cards */
export function CardRow({ tracks, loading }: Props) {
  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[152px]"><CardSkeleton /></div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {tracks.map(t => (
        <TrackCard key={t.id} track={t} queue={tracks} className="flex-shrink-0 w-[152px]" />
      ))}
    </div>
  )
}
