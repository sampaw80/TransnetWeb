import { 
  Alert, 
  Box, 
  Button, 
  Paper, 
  Stack, 
  TextField, 
  Typography, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  Container,
  Fade
} from '@mui/material'
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Add as AddIcon,
  DirectionsCar as CarIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { 
  getVehicleCategories, 
  createVehicleCategory, 
  updateVehicleCategory, 
  deleteVehicleCategory,
} from './vehicleCategoryApi'
import type { 
  VehicleCategoryResponse, 
} from './vehicleCategoryApi'
import { alpha, useTheme } from '@mui/material/styles'

export function VehicleCategoryPage() {
  const theme = useTheme()
  const [categories, setCategories] = useState<VehicleCategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // Action states
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<VehicleCategoryResponse | null>(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getVehicleCategories()
      setCategories(data)
    } catch (e: any) {
      setError('Failed to load vehicle categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingId) {
        await updateVehicleCategory(editingId, { name, description })
        setSuccess('Vehicle category updated successfully.')
      } else {
        await createVehicleCategory({ name, description })
        setSuccess('Vehicle category created successfully.')
      }

      setName('')
      setDescription('')
      setEditingId(null)
      await loadCategories()
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'Failed to save vehicle category')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category: VehicleCategoryResponse) => {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setName('')
    setDescription('')
  }

  const handleView = (category: VehicleCategoryResponse) => {
    setViewItem(category)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    
    setSubmitting(true)
    try {
      await deleteVehicleCategory(deleteId)
      setSuccess('Vehicle category deleted successfully.')
      await loadCategories()
    } catch (e: any) {
      setError('Failed to delete vehicle category.')
    } finally {
      setSubmitting(false)
      setDeleteId(null)
    }
  }

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Category Name', 
      flex: 1,
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      )
    },
    { field: 'description', headerName: 'Description', flex: 2 },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: any) => (
        <Chip 
          label={params.value ? "Active" : "Inactive"} 
          color={params.value ? "success" : "default"} 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 1 }}
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      width: 180,
      renderCell: (params: any) => (
        <Typography variant="caption" color="text.secondary">
           {new Date(params.value).toLocaleDateString()} {new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleView(params.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <VisibilityIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Category">
            <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
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
              <CarIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                Vehicle Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Define and manage categories for your company's fleet
              </Typography>
            </Box>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AddIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {editingId ? 'Edit Category' : 'Create New Category'}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <TextField
                      label="Category Name"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Passenger Car, Heavy Truck"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional details about this category"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {editingId && (
                      <Button 
                        onClick={handleCancelEdit} 
                        variant="outlined" 
                        color="inherit"
                        startIcon={<CloseIcon />}
                        sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : (editingId ? <EditIcon /> : <SaveIcon />)}
                      sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        height: 48,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                      }}
                    >
                      {editingId ? 'Update Category' : 'Save Category'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Stack>
          </Paper>

          {(error || success) && (
            <Fade in={true}>
              <Box>
                {error && <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600, border: '1px solid', borderColor: 'error.light' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 600, border: '1px solid', borderColor: 'success.light' }}>{success}</Alert>}
              </Box>
            </Fade>
          )}

          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider', 
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              minHeight: 400,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Existing Categories
              </Typography>
              <Chip label={`${categories.length} Total`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={categories}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  },
                  '& .MuiDataGrid-cell': {
                    borderColor: 'divider',
                    py: 1
                  },
                  '& .MuiDataGrid-row:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    cursor: 'pointer'
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>

      {/* Dialogs */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            Are you sure you want to delete this vehicle category? This action is permanent and cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', pb: 1 }}>Category Details</DialogTitle>
        <DialogContent>
          {viewItem && (
            <List disablePadding>
              <ListItem sx={{ py: 2, px: 0 }}>
                <ListItemText 
                  primary="ID Reference" 
                  secondary={viewItem.id} 
                  primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                  secondaryTypographyProps={{ sx: { mt: 0.5, fontWeight: 600, color: 'text.primary' } }}
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ py: 2, px: 0 }}>
                <ListItemText 
                  primary="Category Name" 
                  secondary={viewItem.name} 
                  primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                  secondaryTypographyProps={{ sx: { mt: 0.5, fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' } }}
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ py: 2, px: 0 }}>
                <ListItemText 
                  primary="Description" 
                  secondary={viewItem.description || 'No detailed description available.'} 
                  primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                  secondaryTypographyProps={{ sx: { mt: 0.5, fontWeight: 500, color: 'text.primary' } }}
                />
              </ListItem>
              <Divider />
              <ListItem sx={{ py: 2, px: 0 }}>
                <Stack direction="row" spacing={4} sx={{ width: '100%' }}>
                  <ListItemText 
                    primary="Registration Date" 
                    secondary={new Date(viewItem.createdAt).toLocaleString()} 
                    primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                    secondaryTypographyProps={{ sx: { mt: 0.5, fontWeight: 600, color: 'text.primary' } }}
                  />
                  <ListItemText 
                    primary="Current Status" 
                    secondary={
                      <Chip 
                        label={viewItem.isActive ? 'Active Status' : 'Inactive Status'} 
                        color={viewItem.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 0.5, fontWeight: 800, borderRadius: 1 }}
                      />
                    } 
                    primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                  />
                </Stack>
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewItem(null)} variant="contained" fullWidth sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: 'none' }}>
            Close Details
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
