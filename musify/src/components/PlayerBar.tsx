import { usePlayerStore, useAppStore, audioEl } from '@/store'
import { fmtTime } from '@/utils'
import { useProgressDrag } from '@/hooks'
import clsx from 'clsx'

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, isShuffle, isRepeat, isMuted,
    volume, progress, duration,
    togglePlay, nextTrack, prevTrack,
    toggleShuffle, toggleRepeat, toggleMute,
    setVolume, seekTo,
  } = usePlayerStore()
  const { toggleLike, isLiked, showToast } = useAppStore()

  const liked = currentTrack ? isLiked(currentTrack.id) : false
  const pct   = duration > 0 ? (progress / duration) * 100 : 0

  // Progress drag
  const { ref: progRef, onMouseDown: onProgMouseDown } = useProgressDrag((ratio) => {
    seekTo(ratio * duration)
  })

  // Volume drag
  const { ref: volRef, onMouseDown: onVolMouseDown } = useProgressDrag((ratio) => {
    setVolume(ratio)
  })

  return (
    <div className="flex items-center px-6 gap-4 h-full bg-s1 border-t border-white/[0.06] z-50">

      {/* ── LEFT: Now playing ─────────────────────── */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-[9px] bg-s3 overflow-hidden flex-shrink-0 flex items-center justify-center text-xl">
          {currentTrack?.art ? (
            <img src={currentTrack.art} alt={currentTrack.title}
              className="w-full h-full object-cover block"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : <span>🎵</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-tx truncate">
            {currentTrack?.title ?? 'Select a track'}
          </div>
          <div className="text-[11px] text-tx3 truncate">
            {currentTrack?.artist ?? '—'}
          </div>
        </div>
        <button
          onClick={() => currentTrack && toggleLike(currentTrack)}
          className={clsx(
            'p-1 transition-all duration-150 flex-shrink-0',
            liked ? 'text-pink' : 'text-tx3 hover:text-pink hover:scale-110'
          )}
          title="Like (L)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* ── CENTER: Controls + progress ───────────── */}
      <div className="flex-[1.4] flex flex-col items-center gap-[7px] min-w-0">
        {/* Controls */}
        <div className="flex items-center gap-1">
          <Ctrl onClick={toggleShuffle} active={isShuffle} title="Shuffle (S)">
            <ShuffleIcon />
          </Ctrl>
          <Ctrl onClick={prevTrack} title="Previous (←)">
            <PrevIcon />
          </Ctrl>
          <button
            onClick={togglePlay}
            className="w-[38px] h-[38px] rounded-full bg-accent text-black flex items-center justify-center hover:bg-accent2 hover:scale-105 transition-all duration-150 flex-shrink-0"
            title="Play/Pause (Space)"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <Ctrl onClick={nextTrack} title="Next (→)">
            <NextIcon />
          </Ctrl>
          <Ctrl onClick={toggleRepeat} active={isRepeat} title="Repeat (R)">
            <RepeatIcon />
          </Ctrl>
        </div>

        {/* Progress */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-tx3 tabular-nums min-w-[28px]">
            {fmtTime(progress)}
          </span>
          <div
            ref={progRef}
            className="progress-bar flex-1"
            onMouseDown={onProgMouseDown}
          >
            <div className="progress-fill" style={{ width: `${pct}%` }}>
              <div className="progress-thumb" />
            </div>
          </div>
          <span className="text-[10px] text-tx3 tabular-nums min-w-[28px] text-right">
            {fmtTime(duration)}
          </span>
        </div>
      </div>

      {/* ── RIGHT: Volume + EQ ───────────────────── */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <Ctrl onClick={() => showToast(`Queue: ${usePlayerStore.getState().queue.length} tracks`)} title="Queue">
          <QueueIcon />
        </Ctrl>

        <div className="flex items-center gap-2 min-w-[90px]">
          <Ctrl onClick={toggleMute} title="Mute (M)">
            {isMuted ? <MuteIcon /> : <VolumeIcon />}
          </Ctrl>
          <div
            ref={volRef}
            className="flex-1 h-[3px] bg-s3 rounded-full cursor-pointer relative group"
            onMouseDown={onVolMouseDown}
          >
            <div
              className="h-full bg-tx2 rounded-full transition-all duration-100"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
        </div>

        {/* EQ visualizer */}
        <EQBars active={isPlaying} />
      </div>
    </div>
  )
}

// ─── EQ bars ─────────────────────────────────────────────────
function EQBars({ active }: { active: boolean }) {
  const heights = [5, 13, 8, 17, 10, 15]
  return (
    <div className="flex items-end gap-[2px] h-[18px] flex-shrink-0">
      {heights.map((h, i) => (
        <div
          key={i}
          className={clsx('w-[3px] rounded-[1.5px] bg-accent transition-all duration-200')}
          style={{
            height: active ? undefined : h,
            animation: active ? `barAnim ${0.8}s ease-in-out infinite ${i * 0.12}s` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ─── Control button ───────────────────────────────────────────
function Ctrl({ children, onClick, active, title }: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx('ctrl-btn', active && 'active')}
    >
      {children}
    </button>
  )
}

// ─── Icons ───────────────────────────────────────────────────
function PlayIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="ml-[1px]"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function PauseIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> }
function PrevIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg> }
function NextIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg> }
function ShuffleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> }
function RepeatIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> }
function VolumeIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> }
function MuteIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> }
function QueueIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
