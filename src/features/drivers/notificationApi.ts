import { httpClient } from '../../api/httpClient'

export type DriverNotification = {
  id: string
  driverId: string
  title: string
  message: string
  isRead: boolean
  sentAt: string
}

export type SendNotificationForm = {
  driverId: string
  title: string
  message: string
}

export async function getNotifications(driverId: string): Promise<DriverNotification[]> {
  const response = await httpClient.get<DriverNotification[]>(`/api/drivers/${driverId}/notifications`)
  return response.data
}

export async function markNotificationRead(driverId: string, nId: string): Promise<void> {
  await httpClient.put(`/api/drivers/${driverId}/notifications/${nId}/read`, {})
}

export async function sendNotification(input: SendNotificationForm): Promise<void> {
  await httpClient.post('/api/notifications/send', input)
}
