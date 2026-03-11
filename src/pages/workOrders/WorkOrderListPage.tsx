import { useEffect, useState } from 'react';
import { Button, Chip, IconButton, Paper, Stack, Typography, Tooltip } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, ExitToApp as ExportIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { workOrderApi } from '../../features/workOrders/api/workOrderApi';

export function WorkOrderListPage() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkOrders = async () => {
        try {
            setLoading(true);
            const data = await workOrderApi.getWorkOrders();
            setWorkOrders(data);
        } catch (error) {
            console.error('Failed to fetch work orders:', error);
            // Fallback Demo Data
            setWorkOrders([
                { id: 'wo1', vehicleId: 'v1', vehicleReg: 'ABC-1234', title: 'Routine Oil Change', status: 1, priority: 2, dueDate: '2023-11-20T00:00:00Z', createdAt: '2023-11-15T12:00:00Z' },
                { id: 'wo2', vehicleId: 'v2', vehicleReg: 'TR-100', title: 'Replace Brake Pads', status: 2, priority: 3, dueDate: '2023-11-18T00:00:00Z', createdAt: '2023-11-16T14:30:00Z' },
                { id: 'wo3', vehicleId: 'v3', vehicleReg: 'XYZ-9876', title: 'Inspect Engine Light', status: 3, priority: 1, dueDate: '2023-11-25T00:00:00Z', createdAt: '2023-11-17T09:15:00Z' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const getStatusChip = (status: number) => {
        switch (status) {
            case 1: return <Chip label="Open" color="error" size="small" />;
            case 2: return <Chip label="In Progress" color="warning" size="small" />;
            case 3: return <Chip label="Completed" color="success" size="small" />;
            default: return <Chip label="Unknown" color="default" size="small" />;
        }
    };

    const getPriorityChip = (priority: number) => {
        switch (priority) {
            case 1: return <Chip label="Low" color="info" size="small" variant="outlined" />;
            case 2: return <Chip label="Medium" color="warning" size="small" variant="outlined" />;
            case 3: return <Chip label="High" color="error" size="small" variant="outlined" />;
            default: return <Chip label="Unknown" color="default" size="small" variant="outlined" />;
        }
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
        { field: 'vehicleReg', headerName: 'Vehicle', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.status)
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 120,
            renderCell: (params: GridRenderCellParams) => getPriorityChip(params.row.priority)
        },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 150,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="Update Status">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/work-orders/${params.row.id}/status`)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={800}>
                    Work Orders
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchWorkOrders}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ExportIcon />}
                        onClick={() => navigate('/work-orders/export')}
                    >
                        Export
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/work-orders/create')}
                    >
                        Create Work Order
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={workOrders}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
                        },
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
