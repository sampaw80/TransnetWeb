import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  BadgeOutlined as BadgeIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDrivers } from './driverApi'
import type { DriverResponse } from './driverApi'
import { alpha, useTheme } from '@mui/material/styles'

const statusColor = (status: string) => {
  if (status === 'Active') return 'success'
  if (status === 'Suspended') return 'warning'
  return 'default'
}

export function DriverListPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState<DriverResponse[]>([])
  const [filtered, setFiltered] = useState<DriverResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const loadDrivers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDrivers()
      setDrivers(data)
      setFiltered(data)
    } catch {
      setError('Failed to load drivers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDrivers() }, [loadDrivers])

  useEffect(() => {
    let result = drivers
    if (statusFilter !== 'All') result = result.filter((d) => d.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.licenceNumber.toLowerCase().includes(q),
      )
    }
    setFiltered(result)
  }, [drivers, search, statusFilter])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Driver Name',
      flex: 1.5,
      valueGetter: (_: any, row: DriverResponse) => `${row.firstName} ${row.lastName}`,
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    { field: 'licenceNumber', headerName: 'Licence No.', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.2 },
    {
      field: 'licenceExpiry',
      headerName: 'Licence Expiry',
      flex: 1,
      renderCell: (params: any) =>
        params.value ? (
          <Typography variant="caption" color="text.secondary">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled">—</Typography>
        ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={statusColor(params.value) as any}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 1 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Profile">
            <IconButton size="small" onClick={() => navigate(`/drivers/${params.row.id}`)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <VisibilityIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Driver">
            <IconButton size="small" onClick={() => navigate(`/drivers/${params.row.id}/edit`)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <BadgeIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                  Drivers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Manage and monitor all registered drivers
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/drivers/create')}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}
            >
              Create Driver
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          {/* Filters */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search by name or licence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1}>
                {['All', 'Active', 'Inactive', 'Suspended'].map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onClick={() => setStatusFilter(s)}
                    variant={statusFilter === s ? 'filled' : 'outlined'}
                    color={statusFilter === s ? 'primary' : 'default'}
                    sx={{ fontWeight: 700, cursor: 'pointer' }}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Grid */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Driver Registry</Typography>
              <Chip label={`${filtered.length} Drivers`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={filtered}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' },
                  '& .MuiDataGrid-cell': { borderColor: 'divider', py: 1 },
                  '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), cursor: 'pointer' },
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
