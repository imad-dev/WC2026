import { AxiosError } from 'axios'
import { axiosInstance } from '@/lib/axiosInstance'
import type { ApiError, Player, Team } from '@/types'

const BALL_DONT_LIE_BASE_URL = 'https://api.balldontlie.io/fifa/worldcup/v1'

function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{ message?: string }>
  const status = axiosError.response?.status
  const message = axiosError.response?.data?.message || axiosError.message || 'BallDontLie request failed'

  return {
    message,
    status,
    retryable: status ? status >= 500 || status === 429 : true,
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function toString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function headers() {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_BALLDONTLIE_KEY ?? ''}`,
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    const response = await axiosInstance.get(`${BALL_DONT_LIE_BASE_URL}/teams`, {
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return rows.map((row) => {
      const record = asRecord(row)

      return {
        id: String(record.id ?? ''),
        name: toString(record.name, 'Unknown Team'),
        code: toString(record.abbreviation, 'UNK'),
        flagUrl: '',
        group: '',
        country: toString(record.country_code, toString(record.name, 'Unknown')),
      }
    })
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getPlayers(): Promise<Player[]> {
  try {
    const response = await axiosInstance.get(`${BALL_DONT_LIE_BASE_URL}/players`, {
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return rows.map((row) => {
      const record = asRecord(row)

      return {
        id: String(record.id ?? ''),
        name: toString(record.name, 'Unknown Player'),
        firstName: toString(record.first_name, 'Unknown'),
        lastName: toString(record.last_name, 'Player'),
        nationality: toString(record.nationality, 'Unknown'),
        teamId: String(record.team_id ?? ''),
        position: 'FWD',
        photoUrl: undefined,
        jerseyNumber: toNumber(record.jersey_number, undefined),
      }
    })
  } catch {
    return []
  }
}

export async function getStadiums(): Promise<Array<{ name: string; city: string; capacity: number }>> {
  try {
    const response = await axiosInstance.get(`${BALL_DONT_LIE_BASE_URL}/stadiums`, {
      headers: headers(),
    })

    const payload = asRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return rows.map((row) => {
      const record = asRecord(row)

      return {
        name: toString(record.name, 'Unknown Stadium'),
        city: toString(record.city, 'Unknown City'),
        capacity: toNumber(record.capacity, 0),
      }
    })
  } catch (error) {
    throw toApiError(error)
  }
}
