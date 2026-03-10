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
    Grid
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
        haltStartTime: '',
        reason: ''
    });

    const fetchHalts = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getHalts(id);
            setHalts(data);
        } catch (error) {
            console.error('Failed to load halts:', error);
            // Demo Data
            setHalts([
                { id: 'H1', haltStartTime: '2023-11-01T12:00:00Z', haltEndTime: '2023-11-01T13:00:00Z', reason: 'Lunch Break', status: 'Ended' },
                { id: 'H2', haltStartTime: '2023-11-01T15:30:00Z', haltEndTime: null, reason: 'Traffic Congestion', status: 'Active' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHalts();
    }, [id]);

    const handleOpenNew = () => {
        setFormData({ haltStartTime: new Date().toISOString().slice(0, 16), reason: '' });
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
        try {
            await tripApi.createHalt(id, formData);
            setOpen(false);
            fetchHalts();
        } catch (e) {
            console.error(e);
            alert("Failed to create halt");
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'haltStartTime',
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

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Report Trip Delay or Halt</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Reason for Halt"
                                multiline
                                rows={3}
                                placeholder="e.g. Traffic, Breakdown, Weather..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Halt Started At"
                                InputLabelProps={{ shrink: true }}
                                value={formData.haltStartTime}
                                onChange={(e) => setFormData({ ...formData, haltStartTime: e.target.value })}
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
