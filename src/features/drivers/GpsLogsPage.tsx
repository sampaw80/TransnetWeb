import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Paper,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { GpsFixed as GpsIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getGpsSessions, getGpsSession } from './gpsLogApi'
import type { GpsSession, GpsLog } from './gpsLogApi'
import { alpha, useTheme } from '@mui/material/styles'

export function GpsLogsPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [sessions, setSessions] = useState<GpsSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<GpsSession | null>(null)
  const [sessionLogs, setSessionLogs] = useState<GpsLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    try {
      setSessions(await getGpsSessions(driverId))
    } catch {
      setError('Failed to load GPS sessions.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  const viewSession = async (session: GpsSession) => {
    setSelectedSession(session)
    setLogsLoading(true)
    try {
      const logs = await getGpsSession(driverId!, session.id)
      setSessionLogs(logs)
    } catch {
      setSessionLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  const mapSrc = sessionLogs.length > 0
    ? `https://maps.google.com/maps?q=${sessionLogs[0].latitude},${sessionLogs[0].longitude}&z=13&output=embed`
    : null

  const columns: GridColDef[] = [
    { field: 'sessionStart', headerName: 'Session Start', flex: 1, renderCell: (p: any) => <Typography variant="body2">{new Date(p.value).toLocaleString()}</Typography> },
    { field: 'sessionEnd', headerName: 'Session End', flex: 1, renderCell: (p: any) => p.value ? <Typography variant="body2">{new Date(p.value).toLocaleString()}</Typography> : <Chip label="Active" size="small" color="success" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1 }} /> },
    { field: 'distanceKm', headerName: 'Distance (km)', flex: 0.8, renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value?.toFixed(2) ?? '—'}</Typography> },
    { field: 'logCount', headerName: 'Log Points', flex: 0.8, renderCell: (p: any) => <Chip label={p.value} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} /> },
    {
      field: 'actions', headerName: 'Actions', width: 80, sortable: false, align: 'center', headerAlign: 'center',
      renderCell: (p: any) => (
        <Tooltip title="View Session">
          <IconButton size="small" onClick={() => viewSession(p.row)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ViewIcon fontSize="small" color="action" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
              <GpsIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>GPS Sessions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Historical GPS tracking sessions</Typography>
            </Box>
          </Box>
          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>GPS Sessions</Typography>
              <Chip label={`${sessions.length} Sessions`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={sessions}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{ border: 'none', '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' }, '& .MuiDataGrid-cell': { borderColor: 'divider', py: 1 }, '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), cursor: 'pointer' }, '& .MuiDataGrid-footerContainer': { borderTop: '1px solid', borderColor: 'divider' } }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>GPS Session Detail</DialogTitle>
        <DialogContent>
          {logsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <Stack spacing={2}>
              {selectedSession && (
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Session Start" secondary={new Date(selectedSession.sessionStart).toLocaleString()} primaryTypographyProps={{ variant: 'caption', fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }} secondaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }} />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Log Points" secondary={`${sessionLogs.length} recorded`} primaryTypographyProps={{ variant: 'caption', fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }} secondaryTypographyProps={{ sx: { fontWeight: 600, color: 'text.primary' } }} />
                  </ListItem>
                </List>
              )}
              {mapSrc && (
                <Box sx={{ borderRadius: 3, overflow: 'hidden', height: 300, border: '1px solid', borderColor: 'divider' }}>
                  <iframe title="Route Map" src={mapSrc} width="100%" height="100%" style={{ border: 'none' }} allowFullScreen loading="lazy" />
                </Box>
              )}
              {sessionLogs.length === 0 && !logsLoading && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No log points found for this session.</Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedSession(null)} variant="contained" fullWidth sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, textTransform: 'none' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
