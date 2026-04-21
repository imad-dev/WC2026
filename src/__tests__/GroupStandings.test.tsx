import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GroupStandings } from '@/app/components/GroupStandings'
import { useUIStore } from '@/store/uiStore'

const mockUseGroupStandings = vi.fn()

vi.mock('@/hooks/useGroupStandings', () => ({
  useGroupStandings: (group: string) => mockUseGroupStandings(group),
}))

describe('GroupStandings', () => {
  beforeEach(() => {
    useUIStore.setState({ activeGroup: 'F' })
  })

  it('shows skeleton while loading', () => {
    mockUseGroupStandings.mockReturnValue({ isLoading: true })

    render(<GroupStandings />)

    expect(screen.getByText('Group Stage Standings')).toBeInTheDocument()
  })

  it('shows data when loaded', () => {
    mockUseGroupStandings.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        name: 'F',
        standings: [
          {
            position: 1,
            team: { id: 'mar', name: 'Morocco', code: 'MAR', flagUrl: '', group: 'F', country: 'Morocco' },
            played: 6,
            won: 4,
            drawn: 1,
            lost: 1,
            goalsFor: 9,
            goalsAgainst: 4,
            goalDifference: 5,
            points: 13,
            form: ['W', 'W', 'D', 'W', 'L'],
          },
        ],
      },
    })

    render(<GroupStandings />)

    expect(screen.getByText('Morocco')).toBeInTheDocument()
    expect(screen.getByText('13')).toBeInTheDocument()
  })

  it('shows error state with retry button', () => {
    const refetch = vi.fn()
    mockUseGroupStandings.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('boom'),
      refetch,
    })

    render(<GroupStandings />)

    const retry = screen.getByRole('button', { name: 'Retry' })
    fireEvent.click(retry)

    expect(refetch).toHaveBeenCalled()
  })
})
