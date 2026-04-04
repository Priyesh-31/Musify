import TrackRow from './TrackRow'
import type { Track } from '@/types'

interface Props {
  tracks: Track[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: string
}

function Skeleton() {
  return (
    <div className="flex items-center gap-[10px] px-2 py-[7px]">
      <div className="w-5 h-4 skeleton rounded" />
      <div className="w-10 h-10 skeleton rounded-[6px]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 skeleton rounded w-3/4" />
        <div className="h-2 skeleton rounded w-1/2" />
      </div>
      <div className="h-3 skeleton rounded w-8" />
    </div>
  )
}

export default function TrackList({ tracks, loading, emptyMessage = 'No tracks found', emptyIcon = '🔇' }: Props) {
  if (loading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (!tracks.length) {
    return (
      <div className="text-center py-12 text-tx3">
        <div className="text-4xl mb-3 opacity-50">{emptyIcon}</div>
        <div className="text-sm font-medium text-tx2 mb-1">{emptyMessage}</div>
        <div className="text-xs">Try a different search or genre</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[1px]">
      {tracks.map((track, i) => (
        <TrackRow key={track.id} track={track} index={i} queue={tracks} />
      ))}
    </div>
  )
}
