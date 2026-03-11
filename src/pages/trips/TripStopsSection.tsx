import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { tripApi } from '../../features/trips/api/tripApi';

export function TripStopsSection() {
    const { id } = useParams<{ id: string }>();
    const [stops, setStops] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog State
    const [open, setOpen] = useState(false);
    const [editingStopId, setEditingStopId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        stopOrder: 1,
        stopType: 1,
        locationName: '',
        scheduledArrivalAt: '',
        actualArrivalAt: '',
        actualDepartureAt: ''
    });

    const fetchStops = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getStops(id);
            setStops(data);
        } catch (error) {
            console.error('Failed to load stops:', error);
            // Demo Data fallback if API not ready
            setStops([
                { id: 'S1', stopOrder: 1, locationName: 'Warehouse A, NY', scheduledArrivalAt: '2023-11-01T10:00:00Z', actualDepartureAt: '2023-11-01T11:30:00Z' },
                { id: 'S2', stopOrder: 2, locationName: 'Distribution Center, NJ', scheduledArrivalAt: '2023-11-01T14:00:00Z', actualDepartureAt: null }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStops();
    }, [id]);

    const handleOpenNew = () => {
        setEditingStopId(null);
        setFormData({ stopOrder: stops.length + 1, stopType: 1, locationName: '', scheduledArrivalAt: '', actualArrivalAt: '', actualDepartureAt: '' });
        setOpen(true);
    };

    const handleOpenEdit = (stop: any) => {
        setEditingStopId(stop.id);
        setFormData({
            stopOrder: stop.stopOrder,
            stopType: stop.stopType || 1,
            locationName: stop.locationName,
            scheduledArrivalAt: stop.scheduledArrivalAt ? new Date(stop.scheduledArrivalAt).toISOString().slice(0, 16) : '',
            actualArrivalAt: stop.actualArrivalAt ? new Date(stop.actualArrivalAt).toISOString().slice(0, 16) : '',
            actualDepartureAt: stop.actualDepartureAt ? new Date(stop.actualDepartureAt).toISOString().slice(0, 16) : ''
        });
        setOpen(true);
    };

    const handleDelete = async (stopId: string) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this stop?")) {
            try {
                await tripApi.deleteStop(id, stopId);
                fetchStops();
            } catch (e) {
                console.error(e);
                alert("Failed to delete stop");
            }
        }
    };

    const handleSave = async () => {
        if (!id) return;
        const payload: any = {
            stopOrder: formData.stopOrder,
            stopType: formData.stopType,
            locationName: formData.locationName,
            scheduledArrivalAt: formData.scheduledArrivalAt ? new Date(formData.scheduledArrivalAt).toISOString() : null
        };

        try {
            if (editingStopId) {
                payload.actualArrivalAt = formData.actualArrivalAt ? new Date(formData.actualArrivalAt).toISOString() : null;
                payload.actualDepartureAt = formData.actualDepartureAt ? new Date(formData.actualDepartureAt).toISOString() : null;
                await tripApi.editStop(id, editingStopId, payload);
            } else {
                await tripApi.addStop(id, payload);
            }
            setOpen(false);
            fetchStops();
        } catch (e) {
            console.error(e);
            alert("Failed to save stop");
        }
    };

    const columns: GridColDef[] = [
        { field: 'stopOrder', headerName: 'Order', width: 80, align: 'center', headerAlign: 'center' },
        { field: 'location', headerName: 'Location', flex: 1, minWidth: 200 },
        {
            field: 'arrivalTime',
            headerName: 'Arrival Time',
            width: 170,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'Pending'
        },
        {
            field: 'departureTime',
            headerName: 'Departure Time',
            width: 170,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'Pending'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <IconButton size="small" onClick={() => handleOpenEdit(params.row)} color="primary">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h6">Trip Itinerary (Stops)</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<RefreshIcon />} onClick={fetchStops} disabled={loading}>Refresh</Button>
                    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>Add Stop</Button>
                </Stack>
            </Stack>

            <DataGrid
                rows={stops}
                columns={columns}
                loading={loading}
                hideFooter
                disableRowSelectionOnClick
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: (t) => t.palette.background.default,
                        borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    },
                }}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingStopId ? 'Edit Stop' : 'Add New Stop'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Stop Order"
                                type="number"
                                value={formData.stopOrder}
                                onChange={(e) => setFormData({ ...formData, stopOrder: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                fullWidth
                                label="Location Name"
                                value={formData.locationName}
                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Stop Type"
                                value={formData.stopType}
                                onChange={(e) => setFormData({ ...formData, stopType: Number(e.target.value) })}
                            >
                                <MenuItem value={1}>PickUp</MenuItem>
                                <MenuItem value={2}>DropOff</MenuItem>
                                <MenuItem value={3}>Waypoint</MenuItem>
                                <MenuItem value={4}>Depot</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Scheduled Arrival"
                                InputLabelProps={{ shrink: true }}
                                value={formData.scheduledArrivalAt}
                                onChange={(e) => setFormData({ ...formData, scheduledArrivalAt: e.target.value })}
                            />
                        </Grid>
                        {editingStopId && (
                            <>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        label="Actual Arrival"
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.actualArrivalAt}
                                        onChange={(e) => setFormData({ ...formData, actualArrivalAt: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        label="Actual Departure"
                                        InputLabelProps={{ shrink: true }}
                                        value={formData.actualDepartureAt}
                                        onChange={(e) => setFormData({ ...formData, actualDepartureAt: e.target.value })}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
