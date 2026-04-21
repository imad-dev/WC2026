import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { Hero } from './components/Hero'
import { GroupNavigator } from './components/GroupNavigator'
import { TournamentKPIs } from './components/TournamentKPIs'
import { GroupStandings } from './components/GroupStandings'
import { MatchResultsGrid } from './components/MatchResultsGrid'
import { TopScorersLeaderboard } from './components/TopScorersLeaderboard'
import { LiveScoresWidget } from './components/LiveScoresWidget'
import { UpcomingFixtures } from './components/UpcomingFixtures'
import { MoroccoFocusCard } from './components/MoroccoFocusCard'
import { useUIStore } from '@/store/uiStore'

const tabs = ['overview', 'fixtures', 'groups', 'teams', 'scorers', 'stats', 'map'] as const

function normalizeHash(hash: string) {
  const clean = hash.replace('#', '').toLowerCase()
  return tabs.includes(clean as (typeof tabs)[number]) ? clean : 'overview'
}

export default function App() {
  const activeTab = useUIStore((state) => state.activeTab)
  const setActiveTab = useUIStore((state) => state.setActiveTab)
  const activeGroup = useUIStore((state) => state.activeGroup)
  const setActiveGroup = useUIStore((state) => state.setActiveGroup)

  useEffect(() => {
    const initial = normalizeHash(window.location.hash)
    setActiveTab(initial)
    if (!window.location.hash) {
      window.location.hash = `#${initial}`
    }

    const onHashChange = () => {
      setActiveTab(normalizeHash(window.location.hash))
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [setActiveTab])

  const showTab = (tab: (typeof tabs)[number]) => activeTab === tab

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="h-14 px-4 md:px-8 lg:px-20 flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2 md:gap-3 md:w-60">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="md:w-7 md:h-7">
              <path d="M14 2L24 8.5L24 19.5L14 26L4 19.5L4 8.5L14 2Z" stroke="var(--green-live)" strokeWidth="2" fill="none" />
              <path d="M14 2L14 26M4 8.5L24 19.5M24 8.5L4 19.5" stroke="var(--green-live)" strokeWidth="1.5" />
            </svg>
            <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              <span className="text-lg md:text-xl font-extrabold text-white">WC</span>
              <span className="text-lg md:text-xl font-extrabold" style={{ color: 'var(--green-live)' }}>
                2026
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  window.location.hash = `#${tab}`
                }}
                className="text-sm font-medium transition-all duration-200 pb-1 relative uppercase"
                style={{
                  color: activeTab === tab ? 'var(--white-primary)' : 'var(--white-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: 'var(--green-live)',
                      boxShadow: '0 2px 12px rgba(0, 230, 118, 0.3)',
                    }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 md:w-60 justify-end">
            <button className="p-2 hover:bg-muted rounded transition-colors">
              <Search className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--white-muted)' }} />
            </button>
            <div className="px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-semibold" style={{ background: 'var(--green-live)', color: 'var(--void)', letterSpacing: '0.02em' }}>
              LIVE
            </div>
          </div>
        </div>
      </header>

      <section id="overview" style={{ display: showTab('overview') ? 'block' : 'none' }}>
        <Hero />
      </section>

      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <GroupNavigator activeGroup={activeGroup} onGroupChange={setActiveGroup} />
        </div>

        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-10">
          <section id="stats" style={{ display: showTab('stats') || showTab('overview') ? 'block' : 'none' }}>
            <TournamentKPIs />
          </section>

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <section id="groups" style={{ display: showTab('groups') || showTab('overview') ? 'block' : 'none' }}>
            <GroupStandings />
          </section>

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <section id="fixtures" style={{ display: showTab('fixtures') || showTab('overview') ? 'block' : 'none' }}>
            <MatchResultsGrid />
          </section>

          <div className="h-px" style={{ background: 'var(--border)' }} />

          <section id="scorers" style={{ display: showTab('scorers') || showTab('overview') ? 'block' : 'none' }}>
            <TopScorersLeaderboard />
          </section>

          <section id="teams" style={{ display: showTab('teams') ? 'block' : 'none' }}>
            <MoroccoFocusCard />
          </section>

          <section id="map" style={{ display: showTab('map') ? 'block' : 'none' }}>
            <div className="rounded border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h2 className="text-xl uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
                Venues Map
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--white-muted)' }}>
                Map layer placeholder, ready for geospatial integration.
              </p>
            </div>
          </section>
        </main>

        <aside className="w-full lg:w-[300px] px-4 md:px-6 py-6 md:py-8 space-y-4">
          <LiveScoresWidget />
          <UpcomingFixtures />
          <MoroccoFocusCard />
        </aside>
      </div>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="grid grid-cols-5 h-16">
          {[
            { name: 'overview', label: 'Home' },
            { name: 'fixtures', label: 'Fixtures' },
            { name: 'groups', label: 'Groups' },
            { name: 'scorers', label: 'Scorers' },
            { name: 'stats', label: 'Stats' },
          ].map((item) => (
            <button
              key={item.name}
              className="flex flex-col items-center justify-center gap-1"
              onClick={() => {
                setActiveTab(item.name)
                window.location.hash = `#${item.name}`
              }}
              style={{
                color: activeTab === item.name ? 'var(--green-live)' : 'var(--white-ghost)',
              }}
            >
              <div className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="lg:hidden h-16" />
    </div>
  )
}
