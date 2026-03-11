import { httpClient } from '../../api/httpClient'

export type VehicleCategoryResponse = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

export type CreateVehicleCategoryForm = {
  name: string
  description: string | null
}

export type UpdateVehicleCategoryForm = {
  name: string
  description: string | null
}

export async function getVehicleCategories(): Promise<VehicleCategoryResponse[]> {
  const response = await httpClient.get<VehicleCategoryResponse[]>('/vehicle-categories')
  return response.data
}

export async function createVehicleCategory(input: CreateVehicleCategoryForm): Promise<string> {
  const response = await httpClient.post<string>('/vehicle-categories', input)
  return response.data
}

export async function updateVehicleCategory(id: string, input: UpdateVehicleCategoryForm): Promise<void> {
  await httpClient.put(`/vehicle-categories/${id}`, input)
}

export async function deleteVehicleCategory(id: string): Promise<void> {
  await httpClient.delete(`/vehicle-categories/${id}`)
}
