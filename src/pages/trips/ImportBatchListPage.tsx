import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { importBatchApi } from '../../features/trips/api/importBatchApi';

export function ImportBatchListPage() {
    const navigate = useNavigate();
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const data = await importBatchApi.getBatches();
            setBatches(data);
        } catch (error) {
            console.error('Failed to load batches:', error);
            // Demo Data
            setBatches([
                { id: 'B-1001', submittedBy: 'Admin User', uploadedAt: '2023-11-04T08:00:00Z', status: 'Completed', totalRows: 150, successfulRows: 150, failedRows: 0 },
                { id: 'B-1002', submittedBy: 'Dispatch', uploadedAt: '2023-11-04T09:12:00Z', status: 'Completed with Errors', totalRows: 50, successfulRows: 48, failedRows: 2 },
                { id: 'B-1003', submittedBy: 'Admin User', uploadedAt: '2023-11-05T10:00:00Z', status: 'Processing', totalRows: 300, successfulRows: 120, failedRows: 0 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const getStatusColor = (status: string) => {
        if (status.includes('Completed with Errors')) return 'warning';
        if (status.includes('Completed')) return 'success';
        if (status.includes('Failed')) return 'error';
        return 'info';
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Batch ID', width: 130 },
        { field: 'submittedBy', headerName: 'Submitted By', flex: 1, minWidth: 150 },
        {
            field: 'uploadedAt',
            headerName: 'Uploaded At',
            width: 170,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'N/A'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 180,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.row.status}
                    color={getStatusColor(params.row.status) as any}
                    size="small"
                    variant="outlined"
                />
            )
        },
        { field: 'totalRows', headerName: 'Total Rows', width: 100, type: 'number' },
        { field: 'successfulRows', headerName: 'Success', width: 100, type: 'number' },
        { field: 'failedRows', headerName: 'Failed', width: 100, type: 'number' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton size="small" onClick={() => navigate(`/trips/import-batches/${params.row.id}`)} color="primary">
                    <ViewIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Import Batches
                    </Typography>
                    <Typography color="text.secondary">
                        Monitor the background processing queues for bulk trip creation.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchBatches}
                        disabled={loading}
                    >
                        Refresh List
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/trips/import')}
                    >
                        Upload New File
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={batches}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 15 } },
                    }}
                    pageSizeOptions={[15, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: (t) => t.palette.background.default,
                            borderBottom: (t) => `1px solid ${t.palette.divider}`,
                        },
                    }}
                />
            </Paper>
        </Stack>
    );
}
