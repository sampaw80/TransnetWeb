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
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  BadgeOutlined as BadgeIcon,
  Edit as EditIcon,
  EventNote as EventNoteIcon,
  Folder as FolderIcon,
  GpsFixed as GpsIcon,
  LockReset as LockResetIcon,
  Notifications as NotifIcon,
  Receipt as ReceiptIcon,
  Route as RouteIcon,
} from '@mui/icons-material'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDriver, resetDriverCredentials } from './driverApi'
import type { DriverResponse } from './driverApi'
import { alpha, useTheme } from '@mui/material/styles'

const statusColor = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Suspended') return 'warning'
  return 'default'
}

const quickLinks = [
  { label: 'Attendance', icon: <EventNoteIcon fontSize="small" />, path: 'attendance' },
  { label: 'Expenses', icon: <ReceiptIcon fontSize="small" />, path: 'expenses' },
  { label: 'Assignments', icon: <RouteIcon fontSize="small" />, path: 'assignments' },
  { label: 'GPS Tracking', icon: <GpsIcon fontSize="small" />, path: 'gps-tracking' },
  { label: 'GPS Logs', icon: <GpsIcon fontSize="small" />, path: 'gps-logs' },
  { label: 'Documents', icon: <FolderIcon fontSize="small" />, path: 'documents' },
  { label: 'Notifications', icon: <NotifIcon fontSize="small" />, path: 'notifications' },
]

export function DriverProfilePage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [driver, setDriver] = useState<DriverResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [tab, setTab] = useState(0)

  const loadDriver = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const d = await getDriver(id)
      setDriver(d)
    } catch {
      setError('Failed to load driver profile.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadDriver() }, [loadDriver])

  const handleResetCredentials = async () => {
    if (!id) return
    setResetting(true)
    try {
      await resetDriverCredentials(id)
      setSuccess('Mobile login credentials reset successfully.')
      setResetDialogOpen(false)
    } catch {
      setError('Failed to reset credentials. Please try again.')
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!driver) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error || 'Driver not found.'}</Alert>
        <Button onClick={() => navigate('/drivers')} sx={{ mt: 2 }} startIcon={<ArrowBackIcon />}>Back to Drivers</Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <BadgeIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>
                  {driver.firstName} {driver.lastName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={driver.status} color={statusColor(driver.status) as any} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">Licence: {driver.licenceNumber}</Typography>
                </Stack>
              </Box>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" startIcon={<LockResetIcon />} onClick={() => setResetDialogOpen(true)} sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none' }}>
                Reset Credentials
              </Button>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/drivers/${id}/edit`)} sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}>
                Edit Driver
              </Button>
            </Stack>
          </Box>

          <Button onClick={() => navigate('/drivers')} startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start', fontWeight: 600, textTransform: 'none' }}>
            Back to Drivers
          </Button>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          {/* Quick Navigation Tabs */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: '1px solid', borderColor: 'divider', '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 52 } }}>
              <Tab label="Profile Details" />
              {quickLinks.map((l) => (
                <Tab key={l.label} label={l.label} icon={l.icon} iconPosition="start" onClick={() => navigate(`/drivers/${id}/${l.path}`)} />
              ))}
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Stack spacing={0}>
                  <List disablePadding>
                    {[
                      { label: 'Full Name', value: `${driver.firstName} ${driver.lastName}` },
                      { label: 'Email', value: driver.email || '—' },
                      { label: 'Phone', value: driver.phone || '—' },
                      { label: 'Date of Birth', value: driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString() : '—' },
                      { label: 'Address', value: driver.address || '—' },
                      { label: 'Licence Number', value: driver.licenceNumber },
                      { label: 'Licence Class', value: driver.licenceClass || '—' },
                      { label: 'Licence Expiry', value: driver.licenceExpiry ? new Date(driver.licenceExpiry).toLocaleDateString() : '—' },
                      { label: 'Registered', value: new Date(driver.createdAt).toLocaleString() },
                    ].map((item, idx, arr) => (
                      <Box key={item.label}>
                        <ListItem sx={{ py: 2, px: 0 }}>
                          <ListItemText
                            primary={item.label}
                            secondary={item.value}
                            primaryTypographyProps={{ fontWeight: 800, variant: 'caption', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                            secondaryTypographyProps={{ sx: { mt: 0.5, fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' } }}
                          />
                        </ListItem>
                        {idx < arr.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </Stack>
              )}
              {tab > 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Click the tab above to navigate to {quickLinks[tab - 1]?.label} for this driver.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
                    onClick={() => navigate(`/drivers/${id}/${quickLinks[tab - 1]?.path}`)}
                  >
                    Go to {quickLinks[tab - 1]?.label}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Stack>
      </Fade>

      {/* Reset Credentials Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reset Mobile Login Credentials</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            Are you sure you want to reset mobile login credentials for <strong>{driver.firstName} {driver.lastName}</strong>? A new temporary password will be generated.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setResetDialogOpen(false)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleResetCredentials} variant="contained" color="warning" disabled={resetting} startIcon={resetting ? <CircularProgress size={18} color="inherit" /> : <LockResetIcon />} sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}>
            {resetting ? 'Resetting...' : 'Reset Credentials'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
