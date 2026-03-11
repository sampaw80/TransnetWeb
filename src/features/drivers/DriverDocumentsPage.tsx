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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Download as DownloadIcon,
  FolderOutlined as FolderIcon,
  Upload as UploadIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getDocuments, uploadDocument } from './documentApi'
import type { DriverDocument } from './documentApi'
import { alpha, useTheme } from '@mui/material/styles'

const DOC_TYPES = ['Licence', 'ID Card', 'Medical Certificate', 'Insurance', 'Contract', 'Other']

export function DriverDocumentsPage() {
  const theme = useTheme()
  const { id: driverId } = useParams<{ id: string }>()
  const [documents, setDocuments] = useState<DriverDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [docType, setDocType] = useState('Licence')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (!driverId) return
    setLoading(true)
    try {
      setDocuments(await getDocuments(driverId))
    } catch {
      setError('Failed to load documents.')
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => { load() }, [load])

  const handleUpload = async () => {
    if (!driverId || !selectedFile) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('documentType', docType)
    try {
      await uploadDocument(driverId, fd)
      setSuccess('Document uploaded successfully.')
      setUploadOpen(false)
      setSelectedFile(null)
      await load()
    } catch {
      setError('Failed to upload document.')
    } finally {
      setUploading(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'documentType',
      headerName: 'Type',
      flex: 1,
      renderCell: (p: any) => <Chip label={p.value} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1 }} />,
    },
    {
      field: 'fileName',
      headerName: 'File Name',
      flex: 2,
      renderCell: (p: any) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value}</Typography>,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry',
      flex: 1,
      renderCell: (p: any) => p.value ? (
        <Typography variant="caption" color={new Date(p.value) < new Date() ? 'error' : 'text.secondary'}>
          {new Date(p.value).toLocaleDateString()}
        </Typography>
      ) : <Typography variant="caption" color="text.disabled">—</Typography>,
    },
    {
      field: 'uploadedAt',
      headerName: 'Uploaded',
      flex: 1,
      renderCell: (p: any) => <Typography variant="caption" color="text.secondary">{new Date(p.value).toLocaleDateString()}</Typography>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (p: any) => (
        <Tooltip title="Download">
          <IconButton size="small" component="a" href={p.row.fileUrl} target="_blank" rel="noopener noreferrer" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <DownloadIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}` }}>
                <FolderIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.025em' }}>Driver Documents</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Manage driver compliance documents</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setUploadOpen(true)} sx={{ borderRadius: 3, px: 3, fontWeight: 700, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}` }}>
              Upload Document
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ borderRadius: 3 }}>{success}</Alert>}

          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Documents</Typography>
              <Chip label={`${documents.length} Files`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={documents}
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

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Upload Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
              <InputLabel>Document Type</InputLabel>
              <Select label="Document Type" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {DOC_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: selectedFile ? 'primary.main' : 'divider',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: selectedFile ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.04) },
              }}
            >
              <UploadIcon sx={{ fontSize: 40, color: selectedFile ? 'primary.main' : 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color={selectedFile ? 'primary.main' : 'text.secondary'} sx={{ fontWeight: 600 }}>
                {selectedFile ? selectedFile.name : 'Click to select a file'}
              </Typography>
              <input ref={fileRef} type="file" hidden onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setUploadOpen(false)} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!selectedFile || uploading} startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadIcon />} sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
