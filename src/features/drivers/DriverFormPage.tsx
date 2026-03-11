import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  BadgeOutlined as BadgeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createDriver, getDriver, updateDriver } from './driverApi'
import type { CreateDriverForm } from './driverApi'
import { alpha, useTheme } from '@mui/material/styles'

const INITIAL_FORM: CreateDriverForm = {
  firstName: '',
  lastName: '',
  email: null,
  phone: null,
  dateOfBirth: null,
  licenceNumber: '',
  licenceExpiry: null,
  licenceClass: null,
  address: null,
  status: 'Active',
}

export function DriverFormPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<CreateDriverForm>(INITIAL_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || !id) return
    setLoading(true)
    getDriver(id)
      .then((d) => {
        setForm({
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          phone: d.phone,
          dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split('T')[0] : null,
          licenceNumber: d.licenceNumber,
          licenceExpiry: d.licenceExpiry ? d.licenceExpiry.split('T')[0] : null,
          licenceClass: d.licenceClass,
          address: d.address,
          status: d.status,
        })
      })
      .catch(() => setError('Failed to load driver details.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (field: keyof CreateDriverForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value || null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.licenceNumber.trim()) {
      setError('First name, last name, and licence number are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      if (isEdit && id) {
        await updateDriver(id, form)
        setSuccess('Driver updated successfully.')
        setTimeout(() => navigate(`/drivers/${id}`), 1200)
      } else {
        const newId = await createDriver(form)
        setSuccess('Driver created successfully.')
        setTimeout(() => navigate(`/drivers/${newId}`), 1200)
      }
    } catch {
      setError('Failed to save driver. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
              <BadgeIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>
                {isEdit ? 'Edit Driver' : 'Create Driver'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {isEdit ? 'Update driver information' : 'Register a new driver to the fleet'}
              </Typography>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Personal Details */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>Personal Details</Typography>
                <Stack spacing={2.5}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="First Name" fullWidth required value={form.firstName} onChange={set('firstName')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    <TextField label="Last Name" fullWidth required value={form.lastName} onChange={set('lastName')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Email" fullWidth type="email" value={form.email ?? ''} onChange={set('email')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    <TextField label="Phone" fullWidth value={form.phone ?? ''} onChange={set('phone')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Date of Birth" fullWidth type="date" InputLabelProps={{ shrink: true }} value={form.dateOfBirth ?? ''} onChange={set('dateOfBirth')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                      <InputLabel>Status</InputLabel>
                      <Select label="Status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <TextField label="Address" fullWidth multiline rows={2} value={form.address ?? ''} onChange={set('address')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                </Stack>
              </Paper>

              {/* Licence Information */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>Licence Information</Typography>
                <Stack spacing={2.5}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="Licence Number" fullWidth required value={form.licenceNumber} onChange={set('licenceNumber')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                    <TextField label="Licence Class" fullWidth value={form.licenceClass ?? ''} onChange={set('licenceClass')} placeholder="e.g. Class 5, Class 1" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  </Stack>
                  <TextField label="Licence Expiry Date" type="date" InputLabelProps={{ shrink: true }} value={form.licenceExpiry ?? ''} onChange={set('licenceExpiry')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, maxWidth: 300 }} />
                </Stack>
              </Paper>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : (isEdit ? <EditIcon /> : <SaveIcon />)}
                  sx={{ borderRadius: 3, px: 4, height: 48, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}
                >
                  {isEdit ? 'Update Driver' : 'Save Driver'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Fade>
    </Container>
  )
}
