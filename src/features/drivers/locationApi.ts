import { httpClient } from '../../api/httpClient'

export type LocationRecord = {
  driverId: string
  latitude: number
  longitude: number
  accuracy: number | null
  speed: number | null
  heading: number | null
  recordedAt: string
}

export async function updateLocation(driverId: string, lat: number, lng: number): Promise<void> {
  await httpClient.post(`/drivers/${driverId}/location`, { latitude: lat, longitude: lng })
}

export async function getLatestLocation(driverId: string): Promise<LocationRecord | null> {
  const response = await httpClient.get<LocationRecord | null>(`/drivers/${driverId}/location/latest`)
  return response.data
}
