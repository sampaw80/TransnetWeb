import { httpClient } from '../../api/httpClient'

export type AttendanceRecord = {
  id: string
  driverId: string
  checkInTime: string
  checkOutTime: string | null
  checkInLat: number | null
  checkInLng: number | null
  checkOutLat: number | null
  checkOutLng: number | null
  date: string
}

export async function getAttendance(driverId: string): Promise<AttendanceRecord[]> {
  const response = await httpClient.get<AttendanceRecord[]>(`/drivers/${driverId}/attendance`)
  return response.data
}

export async function checkIn(driverId: string, lat?: number, lng?: number): Promise<void> {
  await httpClient.post(`/drivers/${driverId}/attendance/checkin`, { lat, lng })
}

export async function checkOut(driverId: string, lat?: number, lng?: number): Promise<void> {
  await httpClient.put(`/drivers/${driverId}/attendance/checkout`, { lat, lng })
}
