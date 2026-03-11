import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  ReceiptLongOutlined as ReceiptIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getExpenses, createExpense, updateExpense, reviewExpense } from './expenseApi'
import type { ExpenseResponse, CreateExpenseForm, ExpenseStatus } from './expenseApi'
import { alpha, useTheme } from '@mui/material/styles'

const statusColor = (s: ExpenseStatus) => {
  if (s === 'Approved') return 'success'
  if (s === 'Rejected') return 'error'
  if (s === 'Submitted') return 'info'
  return 'default'
}

const EXPENSE_TYPES = ['Fuel', 'Toll', 'Parking', 'Maintenance', 'Meals', 'Accommodation', 'Other']

export function ExpenseListPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [filtered, setFiltered] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Create/Edit dialog
  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseResponse | null>(null)
  const [form, setForm] = useState<CreateExpenseForm>({ expenseType: '', amount: 0, currency: 'AUD', description: null })
  const [submitting, setSubmitting] = useState(false)

  // Review dialog
  const [reviewExpenseItem, setReviewExpenseItem] = useState<ExpenseResponse | null>(null)
  const [reviewNote, setReviewNote] = useState('')

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    try {
      setExpenses(await getExpenses(driverId))
    } catch {
      setError('Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    let r = expenses
    if (typeFilter !== 'All') r = r.filter((e) => e.expenseType === typeFilter)
    if (statusFilter !== 'All') r = r.filter((e) => e.status === statusFilter)
    setFiltered(r)
  }, [expenses, typeFilter, statusFilter])

  const openCreate = () => {
    setEditingExpense(null)
    setForm({ expenseType: '', amount: 0, currency: 'AUD', description: null })
    setFormOpen(true)
  }

  const openEdit = (exp: ExpenseResponse) => {
    setEditingExpense(exp)
    setForm({ expenseType: exp.expenseType, amount: exp.amount, currency: exp.currency, description: exp.description })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    if (!driverId) return
    setSubmitting(true)
    try {
      if (editingExpense) {
        await updateExpense(driverId, editingExpense.id, form)
        setSuccess('Expense updated.')
      } else {
        await createExpense(driverId, form)
        setSuccess('Expense created.')
      }
      setFormOpen(false)
      await load()
    } catch {
      setError('Failed to save expense.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReview = async (action: 'Approve' | 'Reject') => {
    if (!driverId || !reviewExpenseItem) return
    setSubmitting(true)
    try {
      await reviewExpense(driverId, reviewExpenseItem.id, { action, reviewNote: reviewNote || null })
      setSuccess(`Expense ${action === 'Approve' ? 'approved' : 'rejected'}.`)
      setReviewExpenseItem(null)
      setReviewNote('')
      await load()
    } catch {
      setError('Failed to review expense.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'expenseType', headerName: 'Type', flex: 1, renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.value}</Typography> },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.row.currency} {p.value?.toFixed(2)}</Typography>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (p: any) => <Chip label={p.value} color={statusColor(p.value) as any} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />,
    },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (p: any) => <Typography variant="caption" color="text.secondary">{new Date(p.value).toLocaleDateString()}</Typography>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (p: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {p.row.status === 'Draft' && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEdit(p.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <EditIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {p.row.status === 'Submitted' && (
            <>
              <Tooltip title="Approve">
                <IconButton size="small" onClick={() => setReviewExpenseItem(p.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <ApproveIcon fontSize="small" color="success" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton size="small" onClick={() => { setReviewExpenseItem(p.row); }} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <RejectIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <ReceiptIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Driver Expenses</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Track and review expense claims</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}>
              Add Expense
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          {/* Filters */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl size="small" sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                <InputLabel>Expense Type</InputLabel>
                <Select label="Expense Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="All">All Types</MenuItem>
                  {EXPENSE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  {['All', 'Draft', 'Submitted', 'Approved', 'Rejected'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Grid */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Expenses</Typography>
              <Chip label={`${filtered.length} Records`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={filtered}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' }, '& .MuiDataGrid-cell': { borderColor: 'divider', py: 1 }, '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }, '& .MuiDataGrid-footerContainer': { borderTop: '1px solid', borderColor: 'divider' } }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
              <InputLabel>Expense Type</InputLabel>
              <Select label="Expense Type" value={form.expenseType} onChange={(e) => setForm((p) => ({ ...p, expenseType: e.target.value }))}>
                {EXPENSE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <TextField label="Amount" type="number" fullWidth value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField label="Currency" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            </Stack>
            <TextField label="Description" fullWidth multiline rows={2} value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value || null }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setFormOpen(false)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined} sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}>
            {editingExpense ? 'Update' : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!reviewExpenseItem} onClose={() => setReviewExpenseItem(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Review Expense</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {reviewExpenseItem?.expenseType} — {reviewExpenseItem?.currency} {reviewExpenseItem?.amount?.toFixed(2)}
          </Typography>
          <TextField label="Review Note (optional)" fullWidth multiline rows={2} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setReviewExpenseItem(null)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={() => handleReview('Reject')} color="error" variant="outlined" startIcon={<RejectIcon />} disabled={submitting} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Reject</Button>
          <Button onClick={() => handleReview('Approve')} color="success" variant="contained" startIcon={<ApproveIcon />} disabled={submitting} sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
