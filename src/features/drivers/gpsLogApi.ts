import { httpClient } from '../../api/httpClient'

export type GpsSession = {
  id: string
  driverId: string
  sessionStart: string
  sessionEnd: string | null
  distanceKm: number | null
  logCount: number
}

export type GpsLog = {
  id: string
  sessionId: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  recordedAt: string
}

export async function getGpsSessions(driverId: string): Promise<GpsSession[]> {
  const response = await httpClient.get<GpsSession[]>(`/api/drivers/${driverId}/gps-logs`)
  return response.data
}

export async function getGpsSession(driverId: string, logId: string): Promise<GpsLog[]> {
  const response = await httpClient.get<GpsLog[]>(`/api/drivers/${driverId}/gps-logs/${logId}`)
  return response.data
}
