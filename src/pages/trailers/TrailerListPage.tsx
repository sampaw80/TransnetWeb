import { useEffect, useState } from 'react';
import { Button, Chip, IconButton, Paper, Stack, Typography, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, Refresh as RefreshIcon, Link as AttachIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { trailerApi, type Trailer } from '../../features/trailers/api/trailerApi';

export function TrailerListPage() {
    const navigate = useNavigate();
    const [trailers, setTrailers] = useState<Trailer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTrailers = async () => {
        try {
            setLoading(true);
            const data = await trailerApi.getTrailers();
            setTrailers(data);
        } catch (error) {
            console.error('Failed to fetch trailers:', error);
            // Fallback data for UI preview purposes
            setTrailers([
                { id: 't1', registrationNumber: 'TR-100', type: 'Flatbed', capacity: 20000, status: 1, currentVehicleId: '1', currentVehicleReg: 'ABC-1234', lastMaintenanceDate: new Date().toISOString() },
                { id: 't2', registrationNumber: 'TR-200', type: 'Refrigerated', capacity: 15000, status: 1, lastMaintenanceDate: new Date().toISOString() },
                { id: 't3', registrationNumber: 'TR-300', type: 'Dry Van', capacity: 25000, status: 2, lastMaintenanceDate: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrailers();
    }, []);

    const getStatusChip = (status: number) => {
        switch (status) {
            case 1: return <Chip label="Available" color="success" size="small" />;
            case 2: return <Chip label="In Use" color="info" size="small" />;
            case 3: return <Chip label="Maintenance" color="warning" size="small" />;
            default: return <Chip label="Unknown" size="small" />;
        }
    };

    const columns: GridColDef[] = [
        { field: 'registrationNumber', headerName: 'Registration No.', flex: 1, minWidth: 150 },
        { field: 'type', headerName: 'Type', flex: 1, minWidth: 120 },
        {
            field: 'capacity',
            headerName: 'Capacity (kg)',
            width: 130,
            valueFormatter: (value: any) => `${value?.toLocaleString() || 0}`
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.status)
        },
        {
            field: 'currentVehicleReg',
            headerName: 'Attached To',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) =>
                params.row.currentVehicleReg ? (
                    <Tooltip title="View Vehicle Details">
                        <Chip label={params.row.currentVehicleReg} size="small" variant="outlined" onClick={() => navigate(`/vehicles/${params.row.currentVehicleId}`)} />
                    </Tooltip>
                ) : (
                    <Typography variant="body2" color="text.secondary">Unattached</Typography>
                )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => navigate(`/trailers/${params.row.id}`)}>
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/trailers/${params.row.id}/update`)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Attach to Vehicle">
                        <IconButton size="small" color="secondary" onClick={() => navigate(`/trailers/${params.row.id}/attach`)}>
                            <AttachIcon fontSize="small" />
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
                    Trailers
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchTrailers}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/trailers/register')}
                    >
                        Register Trailer
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={trailers}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
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
