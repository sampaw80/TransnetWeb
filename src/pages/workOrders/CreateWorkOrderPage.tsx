import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Grid, Stack, Typography, TextField,
    CircularProgress, Paper, Autocomplete, MenuItem
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { vehicleApi, type Vehicle } from '../../features/vehicles/api/vehicleApi';
import { workOrderApi } from '../../features/workOrders/api/workOrderApi';

export function CreateWorkOrderPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(2); // Medium
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const v = await vehicleApi.getVehicles();
                setVehicles(v);
            } catch {
                setVehicles([
                    { id: '1', registrationNumber: 'ABC-1234', plateNumber: 'XYZ-999', make: 'Ford', model: 'Transit', year: 2022, status: 1, isActive: true, vehicleCategoryId: 'cat-1', vehicleType: 1, odometerReading: 0, createdAt: '', updatedAt: '' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();

        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDueDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle || !title.trim()) return;

        try {
            setSaving(true);
            const payload = {
                vehicleId: selectedVehicle.id,
                title,
                description,
                priority, // 1=Low, 2=Medium, 3=High
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            };

            await workOrderApi.createWorkOrder(payload);
            navigate('/work-orders');
        } catch (error) {
            console.error('Failed to create work order:', error);
            setTimeout(() => navigate('/work-orders'), 1000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 800, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Stack>

            <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Create Work Order
                        </Typography>
                        <Typography color="text.secondary">
                            Log a maintenance task or repair job for a specific vehicle.
                        </Typography>
                    </Box>
                    <Divider />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                options={vehicles}
                                getOptionLabel={(o) => `${o.registrationNumber} (${o.make})`}
                                value={selectedVehicle}
                                onChange={(_, val) => setSelectedVehicle(val)}
                                renderInput={(params) => <TextField {...params} label="Select Vehicle" required />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Task Title"
                                fullWidth
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Replace driver side mirror"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Provide detailed instructions..."
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Priority"
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                            >
                                <MenuItem value={1}>Low</MenuItem>
                                <MenuItem value={2}>Medium</MenuItem>
                                <MenuItem value={3}>High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                type="date"
                                label="Due Date"
                                InputLabelProps={{ shrink: true }}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving || !selectedVehicle || !title.trim()}
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        >
                            {saving ? 'Saving...' : 'Create Work Order'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
