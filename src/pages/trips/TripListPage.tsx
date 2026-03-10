import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    Typography,
    Menu,
    MenuItem,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    CheckCircle as ConfirmIcon,
    ThumbUp as ApproveIcon,
    Search as SearchIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { tripApi } from '../../features/trips/api/tripApi';

export function TripListPage() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const data = await tripApi.getTrips();
            setTrips(data);
        } catch (error) {
            console.error('Failed to load trips:', error);
            // Fallback Demo Data
            setTrips([
                { id: 'TRP-1001', driver: 'John Doe', vehicle: 'Truck A (Volvo VNL)', status: 'In Progress', startDate: '2023-11-01T08:00:00Z', endDate: null },
                { id: 'TRP-1002', driver: 'Jane Smith', vehicle: 'Van B (Ford Transit)', status: 'Completed', startDate: '2023-10-25T09:00:00Z', endDate: '2023-10-27T17:00:00Z' },
                { id: 'TRP-1003', driver: 'Mike Johnson', vehicle: 'Truck C (Peterbilt)', status: 'Planned', startDate: '2023-11-05T06:00:00Z', endDate: null },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedTripId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTripId(null);
    };

    const handleAction = (action: string) => {
        if (!selectedTripId) return;

        switch (action) {
            case 'view':
                navigate(`/trips/${selectedTripId}`);
                break;
            case 'edit':
                navigate(`/trips/${selectedTripId}/edit`);
                break;
            case 'update-status':
                // typically open a modal or navigate to a status update page
                console.log('Open Update Status Modal for', selectedTripId);
                break;
            case 'approve':
                tripApi.approveTrip(selectedTripId).then(() => fetchTrips());
                break;
            case 'confirm':
                tripApi.confirmTrip(selectedTripId).then(() => fetchTrips());
                break;
        }
        handleMenuClose();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'in progress': return 'info';
            case 'planned': return 'warning';
            default: return 'default';
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Trip ID', width: 130 },
        { field: 'driver', headerName: 'Driver', flex: 1, minWidth: 150 },
        { field: 'vehicle', headerName: 'Vehicle', flex: 1, minWidth: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.row.status}
                    color={getStatusColor(params.row.status) as any}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            width: 160,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            width: 160,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton size="small" onClick={(e) => handleMenuClick(e, params.row.id)}>
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    const filteredTrips = trips.filter(t =>
        t.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Trip Management
                    </Typography>
                    <Typography color="text.secondary">
                        Manage, dispatch, and monitor all transit operations across the fleet.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchTrips}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/trips/create')}
                    >
                        Create Trip
                    </Button>
                </Stack>
            </Stack>

            {/* Filters Toolbar */}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search by ID, Driver, or Status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* Additional filters like Date Range can go here */}
                </Stack>
            </Paper>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={filteredTrips}
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

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleAction('view')}>
                    <ViewIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> View Details
                </MenuItem>
                <MenuItem onClick={() => handleAction('edit')}>
                    <EditIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Edit Trip
                </MenuItem>
                <MenuItem onClick={() => handleAction('update-status')}>
                    <EditIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Update Status
                </MenuItem>
                <MenuItem onClick={() => handleAction('confirm')}>
                    <ConfirmIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} /> Confirm Completion
                </MenuItem>
                <MenuItem onClick={() => handleAction('approve')}>
                    <ApproveIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} /> Approve Trip
                </MenuItem>
                <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Trip
                </MenuItem>
            </Menu>
        </Stack>
    );
}
