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
    <div className="h-screen overflow-hidden"
      style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gridTemplateRows: '1fr 86px' }}>

      {/* Sidebar */}
      <div style={{ gridArea: '1/1/2/2' }}>
        <Sidebar />
      </div>

      {/* Main scrollable content */}
      <main
        id="main-scroll"
        className="overflow-y-auto overflow-x-hidden bg-bg"
        style={{ gridArea: '1/2/2/3' }}
      >
        {view === 'home'       && <HomeView />}
        {view === 'search'     && <SearchView />}
        {view === 'charts'     && <ChartsView />}
        {view === 'liked'      && <LikedView />}
        {view === 'recent'     && <RecentView />}
        {view === 'collection' && <CollectionView />}
      </main>

      {/* Player */}
      <div style={{ gridArea: '2/1/3/3' }}>
        <PlayerBar />
      </div>

      {/* Toast */}
      <Toast />
    </div>
  )
}
