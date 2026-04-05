import { usePlayerStore, useAppStore } from '@/store'
import TrackList from '@/components/TrackList'

export default function CollectionView() {
  const collectionTracks = useAppStore(s => s.collectionTracks)
  const collectionMeta = useAppStore(s => s.collectionMeta)
  const collectionLoading = useAppStore(s => s.collectionLoading)
  const { playItem } = usePlayerStore()
  const { showToast } = useAppStore()

  const playAll = () => {
    if (!collectionTracks.length) { showToast('No tracks available'); return }
    playItem(collectionTracks[0], collectionTracks)
  }

  if (!collectionMeta) {
    return <div className="px-6 py-6">Collection not found</div>
  }

  const subtitle = collectionMeta.subtitle || `${collectionTracks.length} track${collectionTracks.length !== 1 ? 's' : ''}`
  const bgGradient = 'from-purple/20 via-pink/15 to-transparent'

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className={`flex items-end gap-4 mb-6 rounded-xl p-6 bg-gradient-to-br ${bgGradient}`}>
        <div className="w-[80px] h-[80px] rounded-lg bg-gradient-to-br from-pink to-purple flex items-center justify-center flex-shrink-0 text-[40px]">
          {collectionMeta.emoji || collectionMeta.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-tx3 uppercase tracking-[.1em] font-semibold">Collection</p>
          <h1 className="font-syne font-bold text-[24px] text-tx leading-tight">{collectionMeta.title}</h1>
          <p className="text-sm text-tx2 mt-1">{subtitle}</p>
        </div>
        {collectionTracks.length > 0 && (
          <button
            className="inline-flex items-center gap-[7px] bg-accent text-black font-medium text-[13px] px-4 py-[9px] rounded-lg hover:bg-accent2 transition-all flex-shrink-0"
            onClick={playAll}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play All
          </button>
        )}
      </div>

      <TrackList
        tracks={collectionTracks}
        loading={collectionLoading}
        emptyMessage="No tracks found"
        emptyIcon="🎵"
      />
    </div>
  )
}
