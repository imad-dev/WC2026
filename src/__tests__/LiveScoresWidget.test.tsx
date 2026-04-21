import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LiveScoresWidget } from '@/app/components/LiveScoresWidget'

const mockUseLiveMatches = vi.fn()

vi.mock('@/hooks/useLiveMatches', () => ({
  useLiveMatches: () => mockUseLiveMatches(),
}))

describe('LiveScoresWidget', () => {
  it('shows LIVE badge when matches are available', () => {
    mockUseLiveMatches.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          id: '1',
          homeTeam: { code: 'MAR' },
          awayTeam: { code: 'FRA' },
          homeScore: 2,
          awayScore: 1,
          minute: 67,
          status: 'LIVE',
        },
      ],
    })

    render(<LiveScoresWidget />)

    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('shows no live matches state when list is empty', () => {
    mockUseLiveMatches.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    })

    render(<LiveScoresWidget />)

    expect(screen.getByText('No live matches')).toBeInTheDocument()
  })

  it('shows refresh indicator', () => {
    mockUseLiveMatches.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    })

    render(<LiveScoresWidget />)

    expect(screen.getByText('Refresh in 30s')).toBeInTheDocument()
  })
})
