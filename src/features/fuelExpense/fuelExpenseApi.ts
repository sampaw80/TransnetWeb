import { httpClient } from '../../api/httpClient'

// --- Woqood Import ---
export interface WoqoodImportStatus {
  batchId: string
  status: string
  totalRows: number
  processedRows: number
  errorCount: number
  errors: { row: number; error: string }[]
}

export interface FuelTransaction {
  id: string
  batchId: string
  date: string
  cardNumber: string
  vehiclePlate: string
  fuelType: string
  quantity: number
  amount: number
  station: string
  isAllocated: boolean
}

export async function importWoqoodExcel(file: File): Promise<{ batchId: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await httpClient.post<{ batchId: string }>('/fuel/woqood/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function getWoqoodImportStatus(batchId: string): Promise<WoqoodImportStatus> {
  const response = await httpClient.get<WoqoodImportStatus>(`/fuel/woqood/import/${batchId}`)
  return response.data
}

export async function getWoqoodTransactions(batchId: string): Promise<FuelTransaction[]> {
  const response = await httpClient.get<FuelTransaction[]>(`/fuel/woqood/import/${batchId}/transactions`)
  return response.data
}

export async function allocateWoqoodTransaction(id: string, vehicleId?: string, tripId?: string): Promise<void> {
  await httpClient.put(`/fuel/woqood/transactions/${id}/allocate`, { vehicleId, tripId })
}

// --- Woqood Card Mappings ---
export interface CardMapping {
  id: string
  cardNumber: string
  vehicleId: string | null
  vehiclePlate: string | null
  driverId: string | null
  driverName: string | null
  isActive: boolean
}

export async function getCardMappings(): Promise<CardMapping[]> {
  const response = await httpClient.get<CardMapping[]>('/fuel/woqood/card-mappings')
  return response.data
}

export async function saveCardMapping(mapping: Partial<CardMapping>): Promise<CardMapping> {
  const response = await httpClient.post<CardMapping>('/fuel/woqood/card-mappings', mapping)
  return response.data
}

export async function deactivateCardMapping(id: string): Promise<void> {
  await httpClient.delete(`/fuel/woqood/card-mappings/${id}`)
}

// --- Fuel Allocations ---
export interface FuelAllocation {
  id: string
  vehicleId: string
  vehiclePlate: string
  tripId: string | null
  date: string
  amount: number
  liters: number
  costPerLiter: number
  fuelType: string
  remarks: string | null
}

export async function getFuelAllocations(filters?: any): Promise<FuelAllocation[]> {
  const response = await httpClient.get<FuelAllocation[]>('/fuel/allocations', { params: filters })
  return response.data
}

export async function createFuelAllocation(allocation: Partial<FuelAllocation>): Promise<FuelAllocation> {
  const response = await httpClient.post<FuelAllocation>('/fuel/allocations', allocation)
  return response.data
}

export async function getVehicleAllocations(vehicleId: string): Promise<FuelAllocation[]> {
  const response = await httpClient.get<FuelAllocation[]>(`/fuel/allocations/vehicle/${vehicleId}`)
  return response.data
}

export async function getTripAllocations(tripId: string): Promise<FuelAllocation[]> {
  const response = await httpClient.get<FuelAllocation[]>(`/fuel/allocations/trip/${tripId}`)
  return response.data
}

// --- Fuel Summaries ---
export interface FuelSummary {
  vehicleId: string
  vehiclePlate: string
  month: string
  totalLiters: number
  totalAmount: number
  averageConsumption: number
  distanceCovered: number
}

export async function getFuelVehicleSummary(vehicleId?: string): Promise<FuelSummary[]> {
  const url = vehicleId ? `/fuel/vehicle-summary/${vehicleId}` : '/fuel/vehicle-summary'
  const response = await httpClient.get<FuelSummary[]>(url)
  return response.data
}

export async function recalculateFuelSummaries(): Promise<void> {
  await httpClient.post('/fuel/vehicle-summary/recalculate')
}

// --- Payroll ---
export interface SalaryRecord {
  id: string
  driverId: string
  driverName: string
  period: string
  baseSalary: number
  commissionAmount: number
  expenseAmount: number
  deductions: number
  totalPayable: number
  status: 'Draft' | 'Submitted' | 'Approved'
  items: SalaryItem[]
}

export interface SalaryItem {
  id: string
  type: 'Commission' | 'Expense' | 'Deduction'
  amount: number
  description: string
  date: string
}

export async function getSalaryRecords(filters?: any): Promise<SalaryRecord[]> {
  const response = await httpClient.get<SalaryRecord[]>('/payroll/salary-records', { params: filters })
  return response.data
}

export async function createSalaryRecord(record: Partial<SalaryRecord>): Promise<SalaryRecord> {
  const response = await httpClient.post<SalaryRecord>('/payroll/salary-records', record)
  return response.data
}

export async function getSalaryRecord(id: string): Promise<SalaryRecord> {
  const response = await httpClient.get<SalaryRecord>(`/payroll/salary-records/${id}`)
  return response.data
}

export async function updateSalaryRecord(id: string, record: Partial<SalaryRecord>): Promise<void> {
  await httpClient.put(`/payroll/salary-records/${id}`, record)
}

export async function submitSalaryRecord(id: string): Promise<void> {
  await httpClient.put(`/payroll/salary-records/${id}/submit`)
}

export async function approveSalaryRecord(id: string): Promise<void> {
  await httpClient.put(`/payroll/salary-records/${id}/approve`)
}

export async function exportSalaryRecord(id: string): Promise<void> {
  // Handle as file download
  const response = await httpClient.get(`/payroll/salary-records/${id}/export`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `SalaryRecord_${id}.xlsx`)
  document.body.appendChild(link)
  link.click()
}

export interface CommissionItem {
  id: string
  driverId: string
  date: string
  amount: number
  remark: string
}

export async function getCommissionItems(filters?: any): Promise<CommissionItem[]> {
  const response = await httpClient.get<CommissionItem[]>('/payroll/commission-items', { params: filters })
  return response.data
}

export async function addCommissionItem(item: Partial<CommissionItem>): Promise<void> {
  await httpClient.post('/payroll/commission-items', item)
}

// --- Monthly Expense Reports ---
export interface MonthlyExpenseReport {
  id: string
  period: string
  totalAmount: number
  generatedAt: string
  lineItems: ExpenseLineItem[]
}

export interface ExpenseLineItem {
  category: string
  amount: number
  description: string
}

export async function getMonthlyExpenseReports(): Promise<MonthlyExpenseReport[]> {
  const response = await httpClient.get<MonthlyExpenseReport[]>('/reports/monthly-expenses')
  return response.data
}

export async function generateMonthlyExpenseReport(period: string): Promise<void> {
  await httpClient.post('/reports/monthly-expenses/generate', { period })
}

export async function getMonthlyExpenseReport(id: string): Promise<MonthlyExpenseReport> {
  const response = await httpClient.get<MonthlyExpenseReport>(`/reports/monthly-expenses/${id}`)
  return response.data
}

export async function exportExpenseReport(id: string): Promise<void> {
  const response = await httpClient.get(`/reports/monthly-expenses/${id}/export`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `ExpenseReport_${id}.xlsx`)
  document.body.appendChild(link)
  link.click()
}
