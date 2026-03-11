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
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  CheckCircle as ReadIcon,
  NotificationsOutlined as NotifIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getNotifications, markNotificationRead, sendNotification } from './notificationApi'
import type { DriverNotification } from './notificationApi'
import { alpha, useTheme } from '@mui/material/styles'

export function DriverNotificationsPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [notifications, setNotifications] = useState<DriverNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [sendOpen, setSendOpen] = useState(false)
  const [sendForm, setSendForm] = useState({ title: '', message: '' })
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    try {
      setNotifications(await getNotifications(driverId))
    } catch {
      setError('Failed to load notifications.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  const handleMarkRead = async (nId: string) => {
    if (!driverId) return
    try {
      await markNotificationRead(driverId, nId)
      setSuccess('Notification marked as read.')
      await load()
    } catch {
      setError('Failed to mark notification as read.')
    }
  }

  const handleSend = async () => {
    if (!driverId || !sendForm.title.trim() || !sendForm.message.trim()) return
    setSending(true)
    try {
      await sendNotification({ driverId, title: sendForm.title, message: sendForm.message })
      setSuccess('Notification sent successfully.')
      setSendOpen(false)
      setSendForm({ title: '', message: '' })
      await load()
    } catch {
      setError('Failed to send notification.')
    } finally {
      setSending(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      renderCell: (p: any) => (
        <Typography variant="body2" sx={{ fontWeight: p.row.isRead ? 500 : 800, color: p.row.isRead ? 'text.secondary' : 'text.primary' }}>
          {p.value}
        </Typography>
      ),
    },
    { field: 'message', headerName: 'Message', flex: 2.5, renderCell: (p: any) => <Typography variant="body2" color="text.secondary" noWrap>{p.value}</Typography> },
    {
      field: 'isRead',
      headerName: 'Status',
      width: 120,
      renderCell: (p: any) => <Chip label={p.value ? 'Read' : 'Unread'} color={p.value ? 'default' : 'primary'} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />,
    },
    {
      field: 'sentAt',
      headerName: 'Sent',
      flex: 1,
      renderCell: (p: any) => <Typography variant="caption" color="text.secondary">{new Date(p.value).toLocaleString()}</Typography>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (p: any) => !p.row.isRead ? (
        <Tooltip title="Mark as Read">
          <IconButton size="small" onClick={() => handleMarkRead(p.row.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ReadIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      ) : null,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <NotifIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Notifications</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All notifications read'}
                </Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setSendOpen(true)} sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}>
              Send Notification
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Notification History</Typography>
              <Stack direction="row" spacing={1}>
                {unreadCount > 0 && <Chip label={`${unreadCount} Unread`} size="small" color="primary" sx={{ fontWeight: 700 }} />}
                <Chip label={`${notifications.length} Total`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
              </Stack>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={notifications}
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

      {/* Send Dialog */}
      <Dialog open={sendOpen} onClose={() => setSendOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Send Notification</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={sendForm.title}
              onChange={(e) => setSendForm((p) => ({ ...p, title: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              label="Message"
              fullWidth
              required
              multiline
              rows={3}
              value={sendForm.message}
              onChange={(e) => setSendForm((p) => ({ ...p, message: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setSendOpen(false)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={sending || !sendForm.title.trim() || !sendForm.message.trim()}
            startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
