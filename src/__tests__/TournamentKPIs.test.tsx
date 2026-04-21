import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TournamentKPIs } from '@/app/components/TournamentKPIs'

const mockUseDashboard = vi.fn()

vi.mock('@/hooks/useDashboard', () => ({
  useDashboard: () => mockUseDashboard(),
}))

describe('TournamentKPIs', () => {
  it('renders 4 KPI chips', () => {
    mockUseDashboard.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        kpis: {
          totalGoals: 147,
          goalsPerMatch: 3.1,
          cleanSheets: 18,
          yellowCards: 89,
          redCards: 9,
          totalMatches: 104,
          matchesPlayed: 47,
        },
      },
    })

    render(<TournamentKPIs />)

    expect(screen.getByText('Goals Scored')).toBeInTheDocument()
    expect(screen.getByText('Matches Played')).toBeInTheDocument()
    expect(screen.getByText('Clean Sheets')).toBeInTheDocument()
    expect(screen.getByText('Red Cards')).toBeInTheDocument()
  })

  it('uses mocked KPI values', () => {
    mockUseDashboard.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        kpis: {
          totalGoals: 147,
          goalsPerMatch: 3.1,
          cleanSheets: 18,
          yellowCards: 89,
          redCards: 9,
          totalMatches: 104,
          matchesPlayed: 47,
        },
      },
    })

    render(<TournamentKPIs />)

    expect(screen.getByText('Goals Scored')).toBeInTheDocument()
    expect(screen.getByText('3.1 per match avg')).toBeInTheDocument()
  })
})
