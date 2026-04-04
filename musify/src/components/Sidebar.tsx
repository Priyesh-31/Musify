import { useAppStore } from '@/store'
import Logo from './Logo'
import { SIDEBAR_PLAYLISTS } from '@/data/static'
import { searchItunes } from '@/services/itunes'
import { usePlayerStore } from '@/store'
import type { ViewId } from '@/types'
import clsx from 'clsx'

const NAV = [
  { id: 'home'   as ViewId, label: 'Home',            icon: HomeIcon    },
  { id: 'search' as ViewId, label: 'Search',          icon: SearchIcon  },
  { id: 'charts' as ViewId, label: 'Charts',          icon: TrendIcon, badge: 'Live' },
]
const LIB = [
  { id: 'liked'  as ViewId, label: 'Liked Songs',     icon: HeartIcon  },
  { id: 'recent' as ViewId, label: 'Recently Played', icon: ClockIcon  },
]

export default function Sidebar() {
  const { view, setView, likedTracks, showToast } = useAppStore()
  const { playItem } = usePlayerStore()
  const likedCount = Object.keys(likedTracks).length

  const loadAndPlay = async (query: string) => {
    showToast(`Loading ${query}…`)
    const tracks = await searchItunes(query, 15)
    if (tracks.length) {
      playItem(tracks[0], tracks)
      showToast(`Now playing: ${tracks[0].title}`)
    } else {
      showToast('Nothing found — try again')
    }
  }

  return (
    <aside className="flex flex-col h-full bg-s1 border-r border-white/[0.06] overflow-hidden">
      {/* Head */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <button
          className="flex items-center gap-[9px] mb-6 hover:opacity-80 transition-opacity"
          onClick={() => setView('home')}
        >
          <Logo />
          <span className="font-syne font-extrabold text-[18px] tracking-tight text-tx">
            Musi<span className="text-accent">fy</span>
          </span>
        </button>

        <NavSection label="Discover">
          {NAV.map(n => (
            <button key={n.id} className={clsx('nav-btn', view === n.id && 'active')}
              onClick={() => setView(n.id)}>
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
              {n.badge && (
                <span className="ml-auto bg-pink text-white text-[9px] font-bold px-[6px] py-[2px] rounded-full font-syne">
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </NavSection>

        <NavSection label="Library">
          {LIB.map(n => (
            <button key={n.id} className={clsx('nav-btn', view === n.id && 'active')}
              onClick={() => setView(n.id)}>
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
              {n.id === 'liked' && likedCount > 0 && (
                <span className="ml-auto bg-pink text-white text-[9px] font-bold px-[6px] py-[2px] rounded-full">
                  {likedCount}
                </span>
              )}
            </button>
          ))}
        </NavSection>

        <NavSection label="Playlists">
          {SIDEBAR_PLAYLISTS.map(p => (
            <button key={p.name} className="nav-btn" onClick={() => loadAndPlay(p.query)}>
              <span className="w-7 h-7 rounded-[6px] bg-s3 flex items-center justify-center text-sm flex-shrink-0">
                {p.emoji}
              </span>
              {p.name}
            </button>
          ))}
          <button className="nav-btn !text-accent" onClick={() => showToast('Create playlist — coming soon')}>
            <PlusIcon className="w-4 h-4 flex-shrink-0" />
            New Playlist
          </button>
        </NavSection>
      </div>

      <div className="flex-1 overflow-y-auto" />

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-[9px] flex-shrink-0">
        <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-purple to-pink flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-tx">Jay Doe</div>
          <div className="text-[10px] text-accent">Premium</div>
        </div>
        <button className="w-[30px] h-[30px] rounded-lg bg-s2 border border-white/10 text-tx2 flex items-center justify-center hover:bg-s3 hover:text-tx transition-all" onClick={() => showToast('Settings — coming soon')}>
          <SettingsIcon className="w-[14px] h-[14px]" />
        </button>
      </div>
    </aside>
  )
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="text-[9.5px] font-semibold tracking-[0.12em] uppercase text-tx3 px-[10px] mb-1 mt-[10px]">
        {label}
      </div>
      {children}
    </div>
  )
}

// ─── SVG Icons ───────────────────────────────────────────────
function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function SearchIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
}
function TrendIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
}
function HeartIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
}
function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
}
function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}
