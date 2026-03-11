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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material'
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  CreditCard as CardIcon,
  DirectionsCar as CarIcon,
  Person as DriverIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useEffect } from 'react'
import { 
  getCardMappings, 
  saveCardMapping, 
  deactivateCardMapping,
  type CardMapping
} from './fuelExpenseApi'

export function WoqoodCardMappingsPage() {
  const theme = useTheme()
  const [mappings, setMappings] = useState<CardMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CardMapping>>({
    cardNumber: '',
    vehicleId: '',
    driverId: '',
    isActive: true
  })

  // Action states
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadMappings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCardMappings()
      setMappings(data)
    } catch (e: any) {
      setError('Failed to load card mappings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMappings()
  }, [loadMappings])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await saveCardMapping({ ...formData, id: editingId || undefined })
      setSuccess(`Card mapping ${editingId ? 'updated' : 'created'} successfully.`)
      setEditingId(null)
      setFormData({ cardNumber: '', vehicleId: '', driverId: '', isActive: true })
      await loadMappings()
    } catch (e: any) {
      setError('Failed to save card mapping.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (mapping: CardMapping) => {
    setEditingId(mapping.id)
    setFormData({
      cardNumber: mapping.cardNumber,
      vehicleId: mapping.vehicleId || '',
      driverId: mapping.driverId || '',
      isActive: mapping.isActive
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      await deactivateCardMapping(deleteId)
      setSuccess('Card mapping deactivated successfully.')
      await loadMappings()
    } catch (e: any) {
      setError('Failed to deactivate card mapping.')
    } finally {
      setSubmitting(false)
      setDeleteId(null)
    }
  }

  const columns: GridColDef[] = [
    { field: 'cardNumber', headerName: 'Card Number', flex: 1.5, renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'primary.main' }}>
        {params.value}
      </Typography>
    )},
    { field: 'vehiclePlate', headerName: 'Vehicle', flex: 1, renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <CarIcon fontSize="small" color="action" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value || 'N/A'}</Typography>
      </Stack>
    )},
    { field: 'driverName', headerName: 'Driver', flex: 1.5, renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <DriverIcon fontSize="small" color="action" />
        <Typography variant="body2">{params.value || 'N/A'}</Typography>
      </Stack>
    )},
    { field: 'isActive', headerName: 'Status', width: 120, renderCell: (params) => (
      <Chip 
        label={params.value ? "Active" : "Inactive"} 
        color={params.value ? "success" : "default"} 
        size="small" 
        variant="outlined"
        sx={{ fontWeight: 700, borderRadius: 1 }}
      />
    )},
    { field: 'actions', headerName: 'Actions', width: 120, sortable: false, renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deactivate">
          <IconButton size="small" onClick={() => setDeleteId(params.row.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      </Box>
    )}
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
              <CardIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                Woqood Card Mappings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Link fuel cards to specific vehicles or drivers for automatic allocation
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {editingId ? 'Edit Mapping' : 'Add New Mapping'}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Card Number"
                      fullWidth
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      required
                      placeholder="Enter 16-digit card number"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Vehicle Plate"
                      fullWidth
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      placeholder="Select Vehicle"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Driver"
                      fullWidth
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      placeholder="Select Driver"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <FormControlLabel
                      control={<Switch checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />}
                      label="Active Mapping"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {editingId && (
                        <Button variant="outlined" color="inherit" onClick={() => { setEditingId(null); setFormData({ cardNumber: '', vehicleId: '', driverId: '', isActive: true }); }} startIcon={<CloseIcon />} sx={{ borderRadius: 3 }}>
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} sx={{ borderRadius: 3, px: 4, fontWeight: 700, height: 48 }}>
                        {editingId ? 'Update Mapping' : 'Save Mapping'}
                      </Button>
                    </Box>
                  </Box>
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
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Existing Mappings</Typography>
              <Chip label={`${mappings.length} Total`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={mappings}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                sx={{ border: 'none' }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to deactivate this card mapping? It will no longer be used for automatic allocations.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={submitting} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Deactivate Mapping
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
