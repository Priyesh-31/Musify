import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { useKeyboard } from '@/hooks'
import Sidebar from '@/components/Sidebar'
import PlayerBar from '@/components/PlayerBar'
import Toast from '@/components/Toast'
import HomeView from '@/views/HomeView'
import SearchView from '@/views/SearchView'
import ChartsView from '@/views/ChartsView'
import CollectionView from '@/views/CollectionView'
import { LikedView, RecentView } from '@/views/LibraryViews'

export default function App() {
  const view = useAppStore(s => s.view)
  const hydrateLibrary = useAppStore(s => s.hydrateLibrary)
  useKeyboard()

  useEffect(() => {
    hydrateLibrary()
  }, [hydrateLibrary])

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-[240px] flex-shrink-0 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main scrollable content */}
        <main
          id="main-scroll"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-bg"
        >
          {view === 'home'       && <HomeView />}
          {view === 'search'     && <SearchView />}
          {view === 'charts'     && <ChartsView />}
          {view === 'liked'      && <LikedView />}
          {view === 'recent'     && <RecentView />}
          {view === 'collection' && <CollectionView />}
        </main>
      </div>

      {/* Player - fixed at bottom */}
      <div className="h-[86px] flex-shrink-0 border-t border-white/[0.06]">
        <PlayerBar />
      </div>

      {/* Toast - positioned absolutely */}
      <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 9999 }}>
        <Toast />
      </div>
    </div>
  )
}
