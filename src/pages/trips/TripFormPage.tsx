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
    CircularProgress,
    MenuItem
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
        driver: '',
        vehicle: '',
        status: 'Planned',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (isEdit && id) {
            tripApi.getTrip(id)
                .then(data => {
                    setFormData({
                        driver: data.driver || '',
                        vehicle: data.vehicle || '',
                        status: data.status || 'Planned',
                        startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
                        endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : ''
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
        try {
            if (isEdit && id) {
                await tripApi.updateTrip(id, formData);
            } else {
                await tripApi.createTrip(formData);
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Driver Name"
                                    required
                                    value={formData.driver}
                                    onChange={handleChange('driver')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Assigned Vehicle Registration"
                                    required
                                    value={formData.vehicle}
                                    onChange={handleChange('vehicle')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Initial Status"
                                    value={formData.status}
                                    onChange={handleChange('status')}
                                >
                                    <MenuItem value="Planned">Planned</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Start Date & Time"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.startDate}
                                    onChange={handleChange('startDate')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="End Date & Time"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.endDate}
                                    onChange={handleChange('endDate')}
                                />
                            </Grid>

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
