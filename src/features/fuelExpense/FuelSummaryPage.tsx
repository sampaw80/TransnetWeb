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
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { 
  Summarize as SummaryIcon,
  Refresh as RefreshIcon,
  DirectionsCar as CarIcon,
  Timeline as TimelineIcon,
  EvStation as FuelIcon
} from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useEffect } from 'react'
import { 
  getFuelVehicleSummary, 
  recalculateFuelSummaries,
  type FuelSummary
} from './fuelExpenseApi'

export function FuelSummaryPage() {
  const theme = useTheme()
  const [summaries, setSummaries] = useState<FuelSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadSummaries = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFuelVehicleSummary()
      setSummaries(data)
    } catch (e: any) {
      setError('Failed to load fuel summaries.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummaries()
  }, [loadSummaries])

  const handleRecalculate = async () => {
    setRecalculating(true)
    setError(null)
    setSuccess(null)
    try {
      await recalculateFuelSummaries()
      setSuccess('Recalculation started. Please refresh in a few moments.')
      await loadSummaries()
    } catch (e: any) {
      setError('Failed to trigger recalculation.')
    } finally {
      setRecalculating(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'vehiclePlate', headerName: 'Vehicle', flex: 1, renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <CarIcon fontSize="small" color="action" />
        <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.value}</Typography>
      </Stack>
    )},
    { field: 'month', headerName: 'Month', width: 120 },
    { field: 'totalLiters', headerName: 'Total Liters', width: 130, type: 'number', renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value.toFixed(2)}</Typography>
    )},
    { field: 'totalAmount', headerName: 'Total Amount (QAR)', width: 180, type: 'number', renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
        {params.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Typography>
    )},
    { field: 'averageConsumption', headerName: 'Avg L/100km', width: 150, type: 'number', renderCell: (params) => (
      <Typography variant="body2">{params.value.toFixed(2)}</Typography>
    )},
    { field: 'distanceCovered', headerName: 'Distance (km)', width: 150, type: 'number' },
    { field: 'actions', headerName: 'History', width: 100, sortable: false, renderCell: () => (
      <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
        <TimelineIcon fontSize="small" />
      </IconButton>
    )}
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
                <SummaryIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                  Fuel Vehicle Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Consolidated monthly fuel consumption and cost reports across the fleet
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={recalculating ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />} 
              disabled={recalculating}
              onClick={handleRecalculate}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700, height: 48 }}
            >
              Recalculate Materialized Summaries
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Total Fleet Liters</Typography>
                      <FuelIcon color="primary" />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900 }}>
                      {summaries.reduce((acc, s) => acc + s.totalLiters, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total liters consumed this month</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Total Fleet Cost</Typography>
                      <SummaryIcon color="success" />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'success.main' }}>
                      QAR {summaries.reduce((acc, s) => acc + s.totalAmount, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total fuel expenditure across all vehicles</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
             <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>Avg Efficiency</Typography>
                      <TimelineIcon color="primary" />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      {(summaries.reduce((acc, s) => acc + s.averageConsumption, 0) / (summaries.length || 1)).toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Average Liters per 100km fleet-wide</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Monthly Breakdown</Typography>
              <Chip label={`${summaries.length} Vehicles`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={summaries}
                getRowId={(row) => `${row.vehicleId}-${row.month}`}
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
    </Container>
  )
}
