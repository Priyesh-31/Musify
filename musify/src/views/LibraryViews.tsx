import { useAppStore, usePlayerStore } from '@/store'
import TrackList from '@/components/TrackList'

export function LikedView() {
  const { likedTracks, showToast } = useAppStore()
  const { playItem } = usePlayerStore()
  const tracks = Object.values(likedTracks)

  const playAll = () => {
    if (!tracks.length) { showToast('No liked songs yet'); return }
    playItem(tracks[0], tracks)
  }

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-pink to-purple flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="font-syne font-bold text-[20px] text-tx">Liked Songs</h1>
          <p className="text-xs text-tx3">{tracks.length} song{tracks.length !== 1 ? 's' : ''}</p>
        </div>
        {tracks.length > 0 && (
          <button
            className="inline-flex items-center gap-[7px] bg-accent text-black font-medium text-[13px] px-4 py-[9px] rounded-lg hover:bg-accent2 transition-all"
            onClick={playAll}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play All
          </button>
        )}
      </div>

      <TrackList
        tracks={tracks}
        emptyMessage="No liked songs yet"
        emptyIcon="💔"
      />
    </div>
  )
}

export function RecentView() {
  const recentTracks = useAppStore(s => s.recentTracks)

  return (
    <div className="px-6 py-6">
      <h1 className="font-syne font-bold text-[20px] text-tx mb-6">Recently Played</h1>
      <TrackList
        tracks={recentTracks}
        emptyMessage="Nothing played yet"
        emptyIcon="🕓"
      />
    </div>
  )
}
