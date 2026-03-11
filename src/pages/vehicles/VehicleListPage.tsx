import { useEffect, useState } from 'react';
import { Button, Chip, IconButton, Paper, Stack, Typography, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { vehicleApi, type Vehicle } from '../../features/vehicles/api/vehicleApi';

export function VehicleListPage() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await vehicleApi.getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
            // Fallback data for UI preview purposes during development if API is offline
            setVehicles([
                { id: '1', registrationNumber: 'ABC-1234', plateNumber: 'PLATE-001', make: 'Ford', model: 'Transit', year: 2022, vehicleCategoryId: 'cat-1', vehicleType: 1, status: 1, odometerReading: 15400, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                { id: '2', registrationNumber: 'XYZ-9876', plateNumber: 'PLATE-002', make: 'Mercedes', model: 'Sprinter', year: 2023, vehicleCategoryId: 'cat-2', vehicleType: 1, status: 2, odometerReading: 5000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const getStatusChip = (status: number) => {
        switch (status) {
            case 1: return <Chip label="Active" color="success" size="small" />;
            case 2: return <Chip label="Maintenance" color="warning" size="small" />;
            case 3: return <Chip label="Out of Service" color="error" size="small" />;
            default: return <Chip label="Unknown" size="small" />;
        }
    };

    const columns: GridColDef[] = [
        { field: 'registrationNumber', headerName: 'Registration No.', flex: 1, minWidth: 150 },
        { field: 'plateNumber', headerName: 'Plate No.', flex: 1, minWidth: 120 },
        { field: 'make', headerName: 'Make', flex: 1, minWidth: 120 },
        { field: 'model', headerName: 'Model', flex: 1, minWidth: 120 },
        { field: 'year', headerName: 'Year', width: 90 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.status)
        },
        {
            field: 'odometerReading',
            headerName: 'Odometer',
            width: 120,
            valueFormatter: (value: any) => `${value?.toLocaleString() || 0} km`
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => navigate(`/vehicles/${params.row.id}`)}>
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/vehicles/${params.row.id}/update`)}>
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
                    Vehicles
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchVehicles}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/vehicles/register')}
                    >
                        Register Vehicle
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={vehicles}
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
