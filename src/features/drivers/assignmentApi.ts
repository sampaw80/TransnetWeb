import { httpClient } from '../../api/httpClient'

export type AssignmentStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled'

export type AssignmentResponse = {
  id: string
  driverId: string
  tripId: string
  tripReference: string | null
  origin: string | null
  destination: string | null
  scheduledAt: string | null
  status: AssignmentStatus
  assignedAt: string
}

export async function getAssignments(driverId: string): Promise<AssignmentResponse[]> {
  const response = await httpClient.get<AssignmentResponse[]>(`/drivers/${driverId}/assignments`)
  return response.data
}

export async function acceptAssignment(driverId: string, assignId: string): Promise<void> {
  await httpClient.post(`/drivers/${driverId}/assignments/${assignId}/accept`, {})
}

export async function rejectAssignment(driverId: string, assignId: string): Promise<void> {
  await httpClient.post(`/drivers/${driverId}/assignments/${assignId}/reject`, {})
}
