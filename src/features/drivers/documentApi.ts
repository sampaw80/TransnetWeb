import { httpClient } from '../../api/httpClient'

export type DriverDocument = {
  id: string
  driverId: string
  documentType: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  expiryDate: string | null
}

export async function getDocuments(driverId: string): Promise<DriverDocument[]> {
  const response = await httpClient.get<DriverDocument[]>(`/drivers/${driverId}/documents`)
  return response.data
}

export async function uploadDocument(driverId: string, formData: FormData): Promise<string> {
  const response = await httpClient.post<string>(`/drivers/${driverId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
