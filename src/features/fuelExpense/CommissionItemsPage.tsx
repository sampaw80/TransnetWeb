import { 
  Box, 
  Button, 
  Paper, 
  Stack, 
  Typography, 
  Alert,
  Fade,
  Container,
  alpha,
  useTheme,
  CircularProgress,
  TextField,
  Chip,
  Grid
} from '@mui/material'
import { 
  Add as AddIcon,
  ReceiptLong as ReceiptIcon,
  Person as DriverIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useEffect } from 'react'
import { 
  getCommissionItems, 
  addCommissionItem,
  type CommissionItem 
} from './fuelExpenseApi'

export function CommissionItemsPage() {
  const theme = useTheme()
  const [items, setItems] = useState<CommissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<CommissionItem>>({
    driverId: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    remark: ''
  })

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCommissionItems()
      setItems(data)
    } catch (e: any) {
      setError('Failed to load commission items.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await addCommissionItem(formData)
      setSuccess('Commission item added successfully.')
      setFormData({
        driverId: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        remark: ''
      })
      await loadItems()
    } catch (e: any) {
      setError('Failed to add commission item.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120, valueFormatter: (params) => new Date(params).toLocaleDateString() },
    { field: 'driverName', headerName: 'Driver', flex: 1, renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <DriverIcon fontSize="small" color="action" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value || params.row.driverId}</Typography>
      </Stack>
    )},
    { field: 'amount', headerName: 'Amount (QAR)', width: 150, type: 'number', renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
        +{params.value.toFixed(2)}
      </Typography>
    )},
    { field: 'remark', headerName: 'Remark', flex: 1.5 }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 4, 
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`
            }}>
              <ReceiptIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                Commission Items
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Additional earnings and per-trip commissions for drivers
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Add Commission Item</Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Driver"
                      fullWidth
                      required
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      placeholder="Select Driver"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Amount (QAR)"
                      type="number"
                      fullWidth
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={submitting} 
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{ borderRadius: 3, px: 4, height: 48, minWidth: 200, fontWeight: 700 }}
                    >
                      Add Item
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  label="Remark / Description"
                  fullWidth
                  sx={{ mt: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                />
              </form>
            </Stack>
          </Paper>

          {(error || success) && (
            <Fade in>
              <Box>
                {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}
              </Box>
            </Fade>
          )}

          <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', minHeight: 400 }}>
             <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Recent Commissions</Typography>
              <Chip label={`${items.length} Entries`} size="small" color="primary" sx={{ fontWeight: 700 }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={items}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                sx={{ border: 'none' }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>
    </Container>
  )
}
