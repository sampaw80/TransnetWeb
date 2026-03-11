import { httpClient } from '../../api/httpClient'

export type ExpenseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected'

export type ExpenseResponse = {
  id: string
  driverId: string
  expenseType: string
  amount: number
  currency: string
  description: string | null
  status: ExpenseStatus
  receiptUrl: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export type CreateExpenseForm = {
  expenseType: string
  amount: number
  currency: string
  description: string | null
}

export type ReviewExpenseForm = {
  action: 'Approve' | 'Reject'
  reviewNote: string | null
}

export async function getExpenses(driverId: string): Promise<ExpenseResponse[]> {
  const response = await httpClient.get<ExpenseResponse[]>(`/drivers/${driverId}/expenses`)
  return response.data
}

export async function createExpense(driverId: string, input: CreateExpenseForm): Promise<string> {
  const response = await httpClient.post<string>(`/drivers/${driverId}/expenses`, input)
  return response.data
}

export async function updateExpense(driverId: string, expId: string, input: CreateExpenseForm): Promise<void> {
  await httpClient.put(`/drivers/${driverId}/expenses/${expId}`, input)
}

export async function reviewExpense(driverId: string, expId: string, input: ReviewExpenseForm): Promise<void> {
  await httpClient.put(`/drivers/${driverId}/expenses/${expId}/review`, input)
}
