import {
  Alert,
  Box,
  Chip,
  Container,
  Fade,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { EventNoteOutlined as EventNoteIcon } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getAttendance } from './attendanceApi'
import type { AttendanceRecord } from './attendanceApi'
import { alpha, useTheme } from '@mui/material/styles'

export function AttendancePage() {
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await getAttendance(id)
      setRecords(data)
    } catch {
      setError('Failed to load attendance records.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'checkInTime',
      headerName: 'Check In',
      flex: 1,
      renderCell: (params: any) => (
        <Typography variant="body2">{new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
      ),
    },
    {
      field: 'checkOutTime',
      headerName: 'Check Out',
      flex: 1,
      renderCell: (params: any) =>
        params.value ? (
          <Typography variant="body2">{new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
        ) : (
          <Chip label="Not checked out" size="small" color="warning" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1 }} />
        ),
    },
    {
      field: 'checkInLat',
      headerName: 'GPS Location',
      flex: 1.5,
      renderCell: (params: any) =>
        params.row.checkInLat != null ? (
          <Typography variant="caption" color="text.secondary">
            {params.row.checkInLat.toFixed(5)}, {params.row.checkInLng?.toFixed(5)}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled">No GPS data</Typography>
        ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
              <EventNoteIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Attendance Logs</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Check-in and check-out records</Typography>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Attendance Records</Typography>
              <Chip label={`${records.length} Records`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={records}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' },
                  '& .MuiDataGrid-cell': { borderColor: 'divider', py: 1 },
                  '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                  '& .MuiDataGrid-footerContainer': { borderTop: '1px solid', borderColor: 'divider' },
                }}
              />
            </Box>
          </Paper>
        </Stack>
      </Fade>
    </Container>
  )
}
