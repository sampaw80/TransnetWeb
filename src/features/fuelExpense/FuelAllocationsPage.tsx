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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid
} from '@mui/material'
import { 
  Add as AddIcon,
  AccountBalanceWallet as AllocationIcon,
  DirectionsCar as CarIcon,
  Assignment as TripIcon,
  Save as SaveIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useEffect } from 'react'
import { 
  getFuelAllocations, 
  createFuelAllocation,
  type FuelAllocation
} from './fuelExpenseApi'

export function FuelAllocationsPage() {
  const theme = useTheme()
  const [allocations, setAllocations] = useState<FuelAllocation[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<FuelAllocation>>({
    vehicleId: '',
    tripId: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    liters: 0,
    fuelType: 'Diesel',
    remarks: ''
  })

  const loadAllocations = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFuelAllocations()
      setAllocations(data)
    } catch (e: any) {
      setError('Failed to load fuel allocations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllocations()
  }, [loadAllocations])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await createFuelAllocation(formData)
      setSuccess('Fuel allocation created successfully.')
      setShowForm(false)
      setFormData({
        vehicleId: '',
        tripId: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        liters: 0,
        fuelType: 'Diesel',
        remarks: ''
      })
      await loadAllocations()
    } catch (e: any) {
      setError('Failed to create fuel allocation.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120, valueFormatter: (params) => new Date(params).toLocaleDateString() },
    { field: 'vehiclePlate', headerName: 'Vehicle', flex: 1, renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <CarIcon fontSize="small" color="action" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value}</Typography>
      </Stack>
    )},
    { field: 'tripId', headerName: 'Trip', flex: 1, renderCell: (params) => (
      params.value ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <TripIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ) : <Typography variant="caption" color="text.disabled">Manual</Typography>
    )},
    { field: 'fuelType', headerName: 'Type', width: 100 },
    { field: 'liters', headerName: 'Liters', width: 100, type: 'number' },
    { field: 'amount', headerName: 'Amount (QAR)', width: 150, type: 'number', renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
        {params.value.toFixed(2)}
      </Typography>
    )},
    { field: 'remarks', headerName: 'Remarks', flex: 1.5 }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <AllocationIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                  Fuel Allocations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Manage manual and automated fuel cost allocations to vehicles and trips
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => setShowForm(true)}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700, height: 48 }}
            >
              Add Manual Allocation
            </Button>
          </Box>

          <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', minHeight: 400 }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Allocation History</Typography>
              <Stack direction="row" spacing={2}>
                <Button size="small" startIcon={<FilterIcon />} variant="outlined" sx={{ borderRadius: 2 }}>Filter</Button>
                <Chip label={`${allocations.length} Totals`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              </Stack>
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={allocations}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                sx={{ border: 'none' }}
              />
            </Box>
          </Paper>

          {(error || success) && (
            <Fade in>
              <Box>
                {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}
              </Box>
            </Fade>
          )}
        </Stack>
      </Fade>

      {/* Manual Allocation Dialog */}
      <Dialog 
        open={showForm} 
        onClose={() => setShowForm(false)} 
        fullWidth 
        maxWidth="md" 
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Create Manual Fuel Allocation</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Vehicle"
                  fullWidth
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  placeholder="Select Vehicle"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Trip Reference"
                  fullWidth
                  value={formData.tripId}
                  onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                  placeholder="Optional: Link to Trip"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Fuel Type"
                  fullWidth
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  placeholder="e.g. Diesel, Petrol"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Liters"
                  type="number"
                  fullWidth
                  required
                  value={formData.liters}
                  onChange={(e) => setFormData({ ...formData, liters: parseFloat(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Total Amount (QAR)"
                  type="number"
                  fullWidth
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setShowForm(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ borderRadius: 3, px: 4, height: 48, fontWeight: 700 }}
            >
              Save Allocation
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
