import { usePlayerStore, useAppStore } from '@/store'
import { fmtTime } from '@/utils'
import type { Track } from '@/types'
import clsx from 'clsx'

interface Props {
  track: Track
  index: number
  queue: Track[]
}

export default function TrackRow({ track, index, queue }: Props) {
  const { currentTrack, playItem, isPlaying } = usePlayerStore()
  const { toggleLike, isLiked } = useAppStore()

  const playing = currentTrack?.id === track.id
  const liked   = isLiked(track.id)

  const handlePlay = () => playItem(track, queue)
  const handleLike = (e: React.MouseEvent) => { e.stopPropagation(); toggleLike(track) }

  return (
    <div
      className={clsx(
        'track-row group',
        playing && 'playing bg-accent/5'
      )}
      onClick={handlePlay}
    >
      {/* Number / bars */}
      <span className={clsx('text-xs text-center font-tabular', playing ? 'text-accent' : 'text-tx3')}>
        {playing && isPlaying ? (
          <span className="flex items-end gap-[2px] h-3 justify-center">
            <span className="w-[2.5px] rounded-sm bg-accent animate-bar1" style={{ height: 4 }} />
            <span className="w-[2.5px] rounded-sm bg-accent animate-bar2" style={{ height: 12 }} />
            <span className="w-[2.5px] rounded-sm bg-accent animate-bar3" style={{ height: 7 }} />
          </span>
        ) : (
          index + 1
        )}
      </span>

      {/* Art */}
      <div className="w-10 h-10 rounded-[6px] overflow-hidden bg-s3 flex-shrink-0">
        {track.art ? (
          <img
            src={track.art}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className={clsx('text-[13px] font-medium truncate', playing ? 'text-accent' : 'text-tx')}>
          {track.title}
        </div>
        <div className="text-[11px] text-tx3 truncate">{track.artist}</div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-[10px] flex-shrink-0">
        <button
          onClick={handleLike}
          className={clsx(
            'p-[3px] flex items-center justify-center transition-all duration-150',
            'opacity-0 group-hover:opacity-100',
            liked && '!opacity-100 text-pink',
            !liked && 'text-tx3 hover:text-pink hover:scale-110'
          )}
          title="Like (L)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <span className="text-[11px] text-tx3 tabular-nums min-w-[30px] text-right">
          {fmtTime(track.duration)}
        </span>
      </div>
    </div>
  )
}
