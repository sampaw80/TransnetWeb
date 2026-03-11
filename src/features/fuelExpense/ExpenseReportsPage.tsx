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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { 
  Refresh as GenerateIcon,
  Download as ExportIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useState, useCallback, useEffect } from 'react'
import { 
  getMonthlyExpenseReports, 
  generateMonthlyExpenseReport, 
  getMonthlyExpenseReport,
  exportExpenseReport,
  type MonthlyExpenseReport 
} from './fuelExpenseApi'

export function ExpenseReportsPage() {
  const theme = useTheme()
  const [reports, setReports] = useState<MonthlyExpenseReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Detail view state
  const [selectedReport, setSelectedReport] = useState<MonthlyExpenseReport | null>(null)

  const loadReports = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMonthlyExpenseReports()
      setReports(data)
    } catch (e: any) {
      setError('Failed to load expense reports.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const handleGenerate = async () => {
    const period = new Date().toISOString().substring(0, 7) // current month YYYY-MM
    setGenerating(true)
    setError(null)
    setSuccess(null)
    try {
      await generateMonthlyExpenseReport(period)
      setSuccess(`Report generation triggered for ${period}.`)
      await loadReports()
    } catch (e: any) {
      setError('Failed to generate report.')
    } finally {
      setGenerating(false)
    }
  }

  const handleView = async (id: string) => {
    try {
      const data = await getMonthlyExpenseReport(id)
      setSelectedReport(data)
    } catch (e: any) {
      setError('Failed to load report details.')
    }
  }

  const handleExport = async (id: string) => {
    try {
      await exportExpenseReport(id)
      setSuccess('Export started.')
    } catch (e: any) {
      setError('Export failed.')
    }
  }

  const columns: GridColDef[] = [
    { field: 'period', headerName: 'Period', flex: 1, renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.value}</Typography>
    )},
    { field: 'totalAmount', headerName: 'Total Expenses (QAR)', flex: 1.5, type: 'number', renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
        {params.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Typography>
    )},
    { field: 'generatedAt', headerName: 'Generated At', flex: 1, valueFormatter: (params) => new Date(params).toLocaleString() },
    { field: 'actions', headerName: 'Actions', width: 150, sortable: false, renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="View Report">
          <IconButton size="small" onClick={() => handleView(params.row.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ViewIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export PDF/Excel">
          <IconButton size="small" onClick={() => handleExport(params.row.id)} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ExportIcon fontSize="small" color="action" />
          </IconButton>
        </Tooltip>
      </Stack>
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
                <AnalyticsIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                  Monthly Expense Reports
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  High-level financial summaries and operational expense breakdowns
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <GenerateIcon />} 
              disabled={generating}
              onClick={handleGenerate}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700, height: 48 }}
            >
              Generate Current Month
            </Button>
          </Box>

          <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', minHeight: 400 }}>
             <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Archived Reports</Typography>
              <Chip label={`${reports.length} Reports`} size="small" color="primary" sx={{ fontWeight: 700 }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={reports}
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onClose={() => setSelectedReport(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Expense Breakdown: {selectedReport?.period}</DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: alpha(theme.palette.primary.main, 0.05), p: 2, borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Total Period Expenses</Typography>
                <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>QAR {selectedReport.totalAmount.toLocaleString()}</Typography>
              </Box>
              <List disablePadding>
                {selectedReport.lineItems?.map((item, idx) => (
                  <Box key={idx}>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText 
                        primary={item.category} 
                        secondary={item.description} 
                        primaryTypographyProps={{ fontWeight: 700 }}
                      />
                      <Typography sx={{ fontWeight: 700 }}>QAR {item.amount.toLocaleString()}</Typography>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedReport(null)} sx={{ fontWeight: 700 }}>Close</Button>
          <Button variant="contained" startIcon={<ExportIcon />} sx={{ px: 3, borderRadius: 2 }}>Export PDF</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
