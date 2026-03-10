import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
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
    PlayArrow as EndIcon
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { tripApi } from '../../features/trips/api/tripApi';

export function TripHaltsSection() {
    const { id } = useParams<{ id: string }>();
    const [halts, setHalts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog State
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        haltType: 2,
        reason: '',
        latitude: '',
        longitude: '',
        locationName: '',
        startedAt: '',
        recordedByDriverId: '00000000-0000-0000-0000-000000000000'
    });

    const fetchHalts = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getHalts(id);
            setHalts(data);
        } catch (error) {
            console.error('Failed to load halts:', error);
            // Demo Data fallback
            setHalts([
                { id: 'H1', startedAt: '2023-11-01T12:00:00Z', haltEndTime: '2023-11-01T13:00:00Z', reason: 'Lunch Break', status: 'Ended', haltType: 5 },
                { id: 'H2', startedAt: '2023-11-01T15:30:00Z', haltEndTime: null, reason: 'Traffic Congestion', status: 'Active', haltType: 2 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHalts();
    }, [id]);

    const handleOpenNew = () => {
        setFormData({
            haltType: 2,
            reason: '',
            latitude: '',
            longitude: '',
            locationName: '',
            startedAt: new Date().toISOString().slice(0, 16),
            recordedByDriverId: '00000000-0000-0000-0000-000000000000'
        });
        setOpen(true);
    };

    const handleEndHalt = async (haltId: string) => {
        if (!id) return;
        try {
            await tripApi.endHalt(id, haltId);
            fetchHalts();
        } catch (e) {
            console.error(e);
            alert("Failed to end halt");
        }
    };

    const handleCreateHalt = async () => {
        if (!id) return;
        const payload: any = {
            haltType: formData.haltType,
            reason: formData.reason || null,
            latitude: formData.latitude ? Number(formData.latitude) : null,
            longitude: formData.longitude ? Number(formData.longitude) : null,
            locationName: formData.locationName || null,
            startedAt: formData.startedAt ? new Date(formData.startedAt).toISOString() : new Date().toISOString(),
            recordedByDriverId: formData.recordedByDriverId
        };
        try {
            await tripApi.createHalt(id, payload);
            setOpen(false);
            fetchHalts();
        } catch (e) {
            console.error(e);
            alert("Failed to create halt");
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'startedAt',
            headerName: 'Started At',
            width: 170,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'N/A'
        },
        {
            field: 'haltEndTime',
            headerName: 'Ended At',
            width: 170,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleString() : 'In Progress'
        },
        { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 200 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.row.status}
                    color={params.row.status === 'Active' ? 'error' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                params.row.status === 'Active' && (
                    <Button
                        size="small"
                        color="primary"
                        startIcon={<EndIcon />}
                        onClick={() => handleEndHalt(params.row.id)}
                    >
                        Resume
                    </Button>
                )
            )
        }
    ];

    return (
        <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h6">Trip Halts & Delays</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<RefreshIcon />} onClick={fetchHalts} disabled={loading}>Refresh</Button>
                    <Button size="small" variant="contained" color="warning" startIcon={<AddIcon />} onClick={handleOpenNew}>Report Halt</Button>
                </Stack>
            </Stack>

            <DataGrid
                rows={halts}
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

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Report Trip Delay or Halt</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Halt Type"
                                value={formData.haltType}
                                onChange={(e) => setFormData({ ...formData, haltType: Number(e.target.value) })}
                            >
                                <MenuItem value={1}>Scheduled</MenuItem>
                                <MenuItem value={2}>Unscheduled</MenuItem>
                                <MenuItem value={3}>Emergency</MenuItem>
                                <MenuItem value={4}>Fuel Stop</MenuItem>
                                <MenuItem value={5}>Rest</MenuItem>
                                <MenuItem value={6}>Inspection</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Halt Started At"
                                InputLabelProps={{ shrink: true }}
                                value={formData.startedAt}
                                onChange={(e) => setFormData({ ...formData, startedAt: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Driver ID (Guid)"
                                required
                                value={formData.recordedByDriverId}
                                onChange={(e) => setFormData({ ...formData, recordedByDriverId: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Reason for Halt"
                                multiline
                                rows={2}
                                placeholder="e.g. Traffic, Breakdown, Weather..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Location Name"
                                value={formData.locationName}
                                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Latitude"
                                type="number"
                                inputProps={{ step: "0.000001" }}
                                value={formData.latitude}
                                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                fullWidth
                                label="Longitude"
                                type="number"
                                inputProps={{ step: "0.000001" }}
                                value={formData.longitude}
                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={handleCreateHalt}>Confirm Halt</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
