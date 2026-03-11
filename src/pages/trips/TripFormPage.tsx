import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { tripApi } from '../../features/trips/api/tripApi';

export function TripFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        tripNumber: 'TRP-' + Math.floor(Math.random() * 10000),
        driverId: '00000000-0000-0000-0000-000000000000',
        vehicleId: '00000000-0000-0000-0000-000000000000',
        trailerId: '',
        scheduledStartAt: '',
        totalDistanceKm: ''
    });

    useEffect(() => {
        if (isEdit && id) {
            tripApi.getTrip(id)
                .then(data => {
                    setFormData({
                        tripNumber: data.tripNumber || '',
                        driverId: data.driverId || '00000000-0000-0000-0000-000000000000',
                        vehicleId: data.vehicleId || '00000000-0000-0000-0000-000000000000',
                        trailerId: data.trailerId || '',
                        scheduledStartAt: data.scheduledStartAt ? new Date(data.scheduledStartAt).toISOString().slice(0, 16) : '',
                        totalDistanceKm: data.totalDistanceKm || ''
                    });
                })
                .catch(err => console.error('Failed to fetch trip data:', err))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Prepare correct payload
        const payload: any = {
            driverId: formData.driverId,
            vehicleId: formData.vehicleId,
            trailerId: formData.trailerId ? formData.trailerId : null,
            scheduledStartAt: formData.scheduledStartAt ? new Date(formData.scheduledStartAt).toISOString() : new Date().toISOString()
        };

        try {
            if (isEdit && id) {
                payload.totalDistanceKm = formData.totalDistanceKm ? Number(formData.totalDistanceKm) : null;
                await tripApi.updateTrip(id, payload);
            } else {
                payload.tripNumber = formData.tripNumber;
                await tripApi.createTrip(payload);
            }
            navigate('/trips');
        } catch (error) {
            console.error('Failed to save trip', error);
            alert('Failed to save trip. Check console for details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/trips')}
                    color="inherit"
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight={800}>
                    {isEdit ? `Edit Trip ${id}` : 'Create New Trip'}
                </Typography>
            </Stack>

            <Card variant="outlined">
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {!isEdit && (
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Trip Number"
                                        required
                                        value={formData.tripNumber}
                                        onChange={handleChange('tripNumber')}
                                    />
                                </Grid>
                            )}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Driver ID (Guid)"
                                    required
                                    value={formData.driverId}
                                    onChange={handleChange('driverId')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Vehicle ID (Guid)"
                                    required
                                    value={formData.vehicleId}
                                    onChange={handleChange('vehicleId')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Trailer ID (Guid Optional)"
                                    value={formData.trailerId}
                                    onChange={handleChange('trailerId')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Scheduled Start At"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.scheduledStartAt}
                                    onChange={handleChange('scheduledStartAt')}
                                />
                            </Grid>
                            {isEdit && (
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Total Distance (Km)"
                                        value={formData.totalDistanceKm}
                                        onChange={handleChange('totalDistanceKm')}
                                    />
                                </Grid>
                            )}

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/trips')}
                                        sx={{ mr: 2 }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        disabled={saving}
                                    >
                                        {isEdit ? 'Save Changes' : 'Create Trip'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Stack>
    );
}
