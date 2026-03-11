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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material'
import { 
  Add as AddIcon,
  Payments as PayrollIcon,
  Person as DriverIcon,
  Download as ExportIcon,
  CheckCircle as ApproveIcon,
  Send as SubmitIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { useState, useCallback, useEffect } from 'react'
import { 
  getSalaryRecords, 
  submitSalaryRecord, 
  approveSalaryRecord, 
  exportSalaryRecord,
  type SalaryRecord 
} from './fuelExpenseApi'

export function SalaryRecordsPage() {
  const theme = useTheme()
  const [records, setRecords] = useState<SalaryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Detail view state
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null)

  const loadRecords = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSalaryRecords()
      setRecords(data)
    } catch (e: any) {
      setError('Failed to load salary records.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const handleAction = async (id: string, action: 'submit' | 'approve' | 'export') => {
    setError(null)
    setSuccess(null)
    try {
      if (action === 'submit') {
        await submitSalaryRecord(id)
        setSuccess('Salary record submitted for approval.')
      } else if (action === 'approve') {
        await approveSalaryRecord(id)
        setSuccess('Salary record approved successfully.')
      } else if (action === 'export') {
        await exportSalaryRecord(id)
        setSuccess('Export started.')
      }
      await loadRecords()
    } catch (e: any) {
      setError(`Failed to perform ${action} action.`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Submitted': return 'info'
      case 'Draft': return 'warning'
      default: return 'default'
    }
  }

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
                <PayrollIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                  Payroll Salary Records
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Manage driver salaries, commissions, and expenses with approval workflow
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              sx={{ borderRadius: 3, px: 3, fontWeight: 700, height: 48 }}
            >
              Generate Monthly Payroll
            </Button>
          </Box>

          <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Driver</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Base Salary</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Net Payable</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} align="center"><CircularProgress sx={{ my: 4 }} /></TableCell></TableRow>
                  ) : records.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10 }}>No salary records found for the current period.</TableCell></TableRow>
                  ) : records.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                            <DriverIcon fontSize="small" />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{record.driverName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>QAR {record.baseSalary.toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>QAR {record.totalPayable.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          size="small" 
                          color={getStatusColor(record.status) as any} 
                          sx={{ fontWeight: 800, borderRadius: 1.5 }} 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setSelectedRecord(record)}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          {record.status === 'Draft' && (
                            <Tooltip title="Submit for Approval">
                              <IconButton size="small" color="primary" onClick={() => handleAction(record.id, 'submit')}><SubmitIcon fontSize="small" /></IconButton>
                            </Tooltip>
                          )}
                          {record.status === 'Submitted' && (
                            <Tooltip title="Approve Record">
                              <IconButton size="small" color="success" onClick={() => handleAction(record.id, 'approve')}><ApproveIcon fontSize="small" /></IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Export to Excel">
                            <IconButton size="small" onClick={() => handleAction(record.id, 'export')}><ExportIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      <Dialog 
        open={!!selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
        fullWidth 
        maxWidth="md" 
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Salary Record Details
          <Chip label={selectedRecord?.status} color={getStatusColor(selectedRecord?.status || '') as any} size="small" sx={{ fontWeight: 800 }} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <Stack spacing={4}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Driver</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedRecord.driverName}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Period</Typography>
                  <Typography variant="body1">{selectedRecord.period}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Fixed Base</Typography>
                  <Typography variant="body1">QAR {selectedRecord.baseSalary.toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Net Total</Typography>
                  <Typography variant="body1" color="primary.main" sx={{ fontWeight: 900 }}>QAR {selectedRecord.totalPayable.toLocaleString()}</Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Line Items Breakdown</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (QAR)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell><Chip label={item.type} size="small" variant="outlined" sx={{ fontWeight: 700, height: 20, fontSize: 10 }} /></TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: item.type === 'Deduction' ? 'error.main' : 'inherit' }}>
                             {item.type === 'Deduction' ? '-' : '+'} {item.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedRecord(null)} sx={{ fontWeight: 700 }}>Close</Button>
          <Button variant="contained" startIcon={<ExportIcon />} onClick={() => handleAction(selectedRecord?.id || '', 'export')} sx={{ px: 3, borderRadius: 2 }}>Export Excel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
