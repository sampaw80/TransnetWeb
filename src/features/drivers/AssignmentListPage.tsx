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
  Fade,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  RouteOutlined as RouteIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getAssignments, acceptAssignment, rejectAssignment } from './assignmentApi'
import type { AssignmentResponse, AssignmentStatus } from './assignmentApi'
import { alpha, useTheme } from '@mui/material/styles'

const statusColor = (s: AssignmentStatus) => {
  if (s === 'Accepted' || s === 'Completed') return 'success'
  if (s === 'Rejected' || s === 'Cancelled') return 'error'
  if (s === 'Pending') return 'warning'
  return 'default'
}

export function AssignmentListPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [actionItem, setActionItem] = useState<{ assignment: AssignmentResponse; action: 'accept' | 'reject' } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    try {
      setAssignments(await getAssignments(driverId))
    } catch {
      setError('Failed to load assignments.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  const handleAction = async () => {
    if (!driverId || !actionItem) return
    setSubmitting(true)
    try {
      if (actionItem.action === 'accept') {
        await acceptAssignment(driverId, actionItem.assignment.id)
        setSuccess('Assignment accepted.')
      } else {
        await rejectAssignment(driverId, actionItem.assignment.id)
        setSuccess('Assignment rejected.')
      }
      setActionItem(null)
      await load()
    } catch {
      setError('Failed to process assignment action.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'tripReference',
      headerName: 'Trip Ref',
      flex: 1,
      renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{p.value || p.row.tripId}</Typography>,
    },
    { field: 'origin', headerName: 'From', flex: 1, renderCell: (p: any) => <Typography variant="body2">{p.value || '—'}</Typography> },
    { field: 'destination', headerName: 'To', flex: 1, renderCell: (p: any) => <Typography variant="body2">{p.value || '—'}</Typography> },
    {
      field: 'scheduledAt',
      headerName: 'Scheduled',
      flex: 1,
      renderCell: (p: any) => p.value ? <Typography variant="caption" color="text.secondary">{new Date(p.value).toLocaleString()}</Typography> : <Typography variant="caption" color="text.disabled">—</Typography>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (p: any) => <Chip label={p.value} color={statusColor(p.value) as any} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (p: any) => p.row.status === 'Pending' ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Accept">
            <IconButton size="small" onClick={() => setActionItem({ assignment: p.row, action: 'accept' })} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <AcceptIcon fontSize="small" color="success" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton size="small" onClick={() => setActionItem({ assignment: p.row, action: 'reject' })} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <RejectIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
              <RouteIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Driver Assignments</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Trip assignments and their statuses</Typography>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Assigned Trips</Typography>
              <Chip label={`${assignments.length} Total`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={assignments}
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

      {/* Confirm Dialog */}
      <Dialog open={!!actionItem} onClose={() => setActionItem(null)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {actionItem?.action === 'accept' ? 'Accept Assignment' : 'Reject Assignment'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            Are you sure you want to {actionItem?.action} the assignment for trip <strong>{actionItem?.assignment.tripReference || actionItem?.assignment.tripId}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setActionItem(null)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={actionItem?.action === 'accept' ? 'success' : 'error'}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : (actionItem?.action === 'accept' ? <AcceptIcon /> : <RejectIcon />)}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}
          >
            {actionItem?.action === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
