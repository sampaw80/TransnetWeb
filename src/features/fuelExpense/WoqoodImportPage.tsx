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
  LinearProgress,
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
  TextField,
  MenuItem,
  Grid
} from '@mui/material'
import { 
  CloudUpload as UploadIcon, 
  EvStation as FuelIcon,
  Save as SaveIcon
} from '@mui/icons-material'
import { useState, useCallback, useEffect } from 'react'
import { 
  importWoqoodExcel, 
  getWoqoodImportStatus, 
  getWoqoodTransactions, 
  allocateWoqoodTransaction,
  type WoqoodImportStatus,
  type FuelTransaction
} from './fuelExpenseApi'

export function WoqoodImportPage() {
  const theme = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [status, setStatus] = useState<WoqoodImportStatus | null>(null)
  const [transactions, setTransactions] = useState<FuelTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Allocation dialog state
  const [allocateItem, setAllocateItem] = useState<FuelTransaction | null>(null)
  const [vehicleId, setVehicleId] = useState('')
  const [tripId, setTripId] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await importWoqoodExcel(file)
      setBatchId(result.batchId)
      setPolling(true)
      setSuccess('File uploaded successfully. Processing...')
    } catch (e: any) {
      setError('Upload failed. Please ensure the file is a valid Woqood Excel template.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatus = useCallback(async () => {
    if (!batchId) return
    try {
      const data = await getWoqoodImportStatus(batchId)
      setStatus(data)
      if (data.status === 'Completed' || data.status === 'Failed') {
        setPolling(false)
        if (data.status === 'Completed') {
          const txs = await getWoqoodTransactions(batchId)
          setTransactions(txs)
        }
      }
    } catch (e: any) {
      setPolling(false)
      setError('Failed to fetch import status.')
    }
  }, [batchId])

  useEffect(() => {
    let interval: any
    if (polling) {
      interval = setInterval(fetchStatus, 3000)
    }
    return () => clearInterval(interval)
  }, [polling, fetchStatus])

  const handleAllocate = async () => {
    if (!allocateItem) return
    try {
      await allocateWoqoodTransaction(allocateItem.id, vehicleId || undefined, tripId || undefined)
      setSuccess('Transaction allocated successfully.')
      setAllocateItem(null)
      // Refresh transactions
      if (batchId) {
        const txs = await getWoqoodTransactions(batchId)
        setTransactions(txs)
      }
    } catch (e: any) {
      setError('Failed to allocate transaction.')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Stack spacing={4}>
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
              <FuelIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.025em' }}>
                Woqood Fuel Import
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Upload Woqood Excel files and allocate transactions to vehicles or trips
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={3}>
              <Box sx={{ border: '2px dashed', borderColor: file ? 'primary.main' : 'divider', borderRadius: 3, p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                  id="woqood-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="woqood-upload">
                  <Stack spacing={2} alignItems="center">
                    <UploadIcon sx={{ fontSize: 48, color: file ? 'primary.main' : 'text.disabled' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {file ? file.name : 'Click to select or drag and drop fuel file'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supports standard Woqood monthly Excel exports
                      </Typography>
                    </Box>
                    <Button component="span" variant="outlined" sx={{ borderRadius: 2, fontWeight: 700 }}>
                      Choose File
                    </Button>
                  </Stack>
                </label>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  disabled={!file || loading || polling} 
                  onClick={handleUpload}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                  sx={{ borderRadius: 3, px: 4, height: 48, fontWeight: 700 }}
                >
                  Upload and Process
                </Button>
              </Box>
            </Stack>
          </Paper>

          {status && (
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Import Status: {status.status}</Typography>
                  {polling && <CircularProgress size={24} />}
                </Box>
                
                <Box sx={{ width: '100%' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(status.processedRows / (status.totalRows || 1)) * 100} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">{status.processedRows} of {status.totalRows} rows processed</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: status.errorCount > 0 ? 'error.main' : 'success.main' }}>
                      {status.errorCount} Errors
                    </Typography>
                  </Box>
                </Box>

                {status.errors.length > 0 && (
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Row Level Issues Found</Typography>
                    <Box sx={{ maxHeight: 150, overflow: 'auto', mt: 1 }}>
                      {status.errors.map((err, idx) => (
                        <Typography key={idx} variant="caption" component="div">
                          Row {err.row}: {err.error}
                        </Typography>
                      ))}
                    </Box>
                  </Alert>
                )}
              </Stack>
            </Paper>
          )}

          {transactions.length > 0 && (
            <Paper sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Imported Transactions</Typography>
                <Chip label={`${transactions.length} Records`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              </Box>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Card Number</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Plate</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Fuel Type</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Amount (QAR)</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{tx.cardNumber}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{tx.vehiclePlate}</TableCell>
                        <TableCell>{tx.fuelType}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{tx.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={tx.isAllocated ? "Allocated" : "Unallocated"} 
                            size="small" 
                            color={tx.isAllocated ? "success" : "warning"}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            variant="outlined" 
                            disabled={tx.isAllocated}
                            onClick={() => setAllocateItem(tx)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                          >
                            Allocate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {(error || success) && (
            <Fade in>
              <Box>
                {error && <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 3 }}>{success}</Alert>}
              </Box>
            </Fade>
          )}
        </Stack>
      </Fade>

      {/* Allocation Dialog */}
      <Dialog open={!!allocateItem} onClose={() => setAllocateItem(null)} PaperProps={{ sx: { borderRadius: 4, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Manual Allocation</DialogTitle>
        <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Allocate transaction for <strong>{allocateItem?.vehiclePlate}</strong> ({allocateItem?.amount.toFixed(2)} QAR)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Select Vehicle ID"
                  fullWidth
                  select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                >
                  <MenuItem value="">None</MenuItem>
                  {/* This should be populated with vehicles */}
                  <MenuItem value="v1">7728-QH (Sample)</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Select Trip ID"
                  fullWidth
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  placeholder="Enter Trip Reference"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAllocateItem(null)} sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAllocate} 
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            Confirm Allocation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
