import { httpClient } from '../../api/httpClient'

export type DriverResponse = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  licenceNumber: string
  licenceExpiry: string | null
  licenceClass: string | null
  address: string | null
  status: 'Active' | 'Inactive' | 'Suspended'
  createdAt: string
}

export type CreateDriverForm = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  licenceNumber: string
  licenceExpiry: string | null
  licenceClass: string | null
  address: string | null
  status: string
}

export type UpdateDriverForm = CreateDriverForm

export async function getDrivers(): Promise<DriverResponse[]> {
  const response = await httpClient.get<DriverResponse[]>('/drivers')
  return response.data
}

export async function getDriver(id: string): Promise<DriverResponse> {
  const response = await httpClient.get<DriverResponse>(`/drivers/${id}`)
  return response.data
}

export async function createDriver(input: CreateDriverForm): Promise<string> {
  const response = await httpClient.post<string>('/drivers', input)
  return response.data
}

export async function updateDriver(id: string, input: UpdateDriverForm): Promise<void> {
  await httpClient.put(`/drivers/${id}`, input)
}

export async function resetDriverCredentials(id: string): Promise<void> {
  await httpClient.post(`/drivers/${id}/credentials`, {})
}
