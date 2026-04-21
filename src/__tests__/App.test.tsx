import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import App from '@/app/App'

vi.mock('@/app/components/Hero', () => ({ Hero: () => <div>Hero</div> }))
vi.mock('@/app/components/TournamentKPIs', () => ({ TournamentKPIs: () => <div>KPIs</div> }))
vi.mock('@/app/components/GroupStandings', () => ({ GroupStandings: () => <div>Standings</div> }))
vi.mock('@/app/components/MatchResultsGrid', () => ({ MatchResultsGrid: () => <div>Results</div> }))
vi.mock('@/app/components/TopScorersLeaderboard', () => ({ TopScorersLeaderboard: () => <div>Scorers</div> }))
vi.mock('@/app/components/LiveScoresWidget', () => ({ LiveScoresWidget: () => <div>Live</div> }))
vi.mock('@/app/components/UpcomingFixtures', () => ({ UpcomingFixtures: () => <div>Upcoming</div> }))
vi.mock('@/app/components/MoroccoFocusCard', () => ({ MoroccoFocusCard: () => <div>Morocco</div> }))

describe('App', () => {
  it('renders without crashing', () => {
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: 0 } } })

    render(
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    )

    expect(screen.getByText('WC')).toBeInTheDocument()
  })

  it('shows header and expected tabs', () => {
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: 0 } } })

    render(
      <QueryClientProvider client={client}>
        <App />
      </QueryClientProvider>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'overview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'fixtures' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'groups' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'teams' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'scorers' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'map' })).toBeInTheDocument()
  })
})
