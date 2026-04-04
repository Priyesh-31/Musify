import { usePlayerStore } from '@/store'
import type { Track } from '@/types'
import clsx from 'clsx'

interface Props {
  track: Track
  queue: Track[]
  className?: string
}

export default function TrackCard({ track, queue, className }: Props) {
  const { currentTrack, playItem } = usePlayerStore()
  const playing = currentTrack?.id === track.id

  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    playItem(track, queue)
  }

  return (
    <div
      className={clsx(
        'card group',
        playing && 'border-accent/30 bg-accent/5',
        className
      )}
      onClick={() => handlePlay()}
    >
      {/* Artwork */}
      <div className="w-full aspect-square rounded-xl mb-[10px] bg-s3 overflow-hidden relative">
        {track.art ? (
          <img
            src={track.art}
            alt={track.title}
            className="w-full h-full object-cover block"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
        )}
        {/* Play button overlay */}
        <button
          className="card-play"
          onClick={handlePlay}
          aria-label={`Play ${track.title}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-[1px]">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>

      {/* Text */}
      <div className="text-xs font-semibold text-tx truncate mb-[3px]">{track.title}</div>
      <div className="text-[10px] text-tx3 truncate">{track.artist}</div>
    </div>
  )
}
