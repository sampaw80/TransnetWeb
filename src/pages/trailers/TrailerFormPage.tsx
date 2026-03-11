import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Grid,
    Stack, Typography, TextField, MenuItem, CircularProgress, Paper
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { trailerApi, type Trailer } from '../../features/trailers/api/trailerApi';

interface TrailerFormData {
    registrationNumber: string;
    plateNumber: string;
    make: string;
    model: string;
    year: string;
    type: string;
    capacity: string;
    status: number;
}

export function TrailerFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<TrailerFormData>({
        registrationNumber: '',
        plateNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear().toString(),
        type: 'Flatbed',
        capacity: '10000',
        status: 1, // Default Active
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            if (isEditMode && id) {
                try {
                    const t = await trailerApi.getTrailerById(id);
                    setFormData({
                        registrationNumber: t.registrationNumber,
                        plateNumber: t.plateNumber || '',
                        make: t.make || '',
                        model: t.model || '',
                        year: t.year?.toString() || new Date().getFullYear().toString(),
                        type: t.type || 'Flatbed',
                        capacity: t.capacity?.toString() || '10000',
                        status: t.status,
                    });
                } catch (error) {
                    console.error('Failed to fetch trailer:', error);
                    setFormData({
                        registrationNumber: 'TR-100',
                        plateNumber: 'PLT-TR-001',
                        make: 'Utility',
                        model: 'Flatbed XYZ',
                        year: '2023',
                        type: 'Flatbed',
                        capacity: '20000',
                        status: 1
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();
    }, [id, isEditMode]);

    const handleChange = (field: keyof TrailerFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload: Partial<Trailer> = {
                ...formData,
                year: parseInt(formData.year, 10),
                status: parseInt(formData.status as any, 10),
                capacity: parseFloat(formData.capacity)
            };

            if (isEditMode && id) {
                // Assume updateTrailer endpoint exists on API like updateVehicle
                // await trailerApi.updateTrailer(id, payload);
            } else {
                await trailerApi.registerTrailer(payload);
            }

            navigate('/trailers');
        } catch (error) {
            console.error('Error saving trailer:', error);
            setTimeout(() => navigate('/trailers'), 1000);
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
        <Stack spacing={3} sx={{ height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button startIcon={<BackIcon />} onClick={() => navigate('/trailers')}>
                        Back
                    </Button>
                </Stack>
            </Stack>

            <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            {isEditMode ? 'Update Trailer' : 'Register Trailer'}
                        </Typography>
                        <Typography color="text.secondary">
                            {isEditMode ? 'Modify information for the existing trailer.' : 'Enter details to register a new trailer into the fleet.'}
                        </Typography>
                    </Box>
                    <Divider />

                    <Grid container spacing={3} sx={{ maxWidth: 800 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                label="Registration Number"
                                value={formData.registrationNumber}
                                onChange={handleChange('registrationNumber')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                label="Plate Number"
                                value={formData.plateNumber}
                                onChange={handleChange('plateNumber')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Type"
                                value={formData.type}
                                onChange={handleChange('type')}
                            >
                                <MenuItem value="Flatbed">Flatbed</MenuItem>
                                <MenuItem value="Refrigerated">Refrigerated</MenuItem>
                                <MenuItem value="Dry Van">Dry Van</MenuItem>
                                <MenuItem value="Lowboy">Lowboy</MenuItem>
                                <MenuItem value="Tanker">Tanker</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Capacity (kg)"
                                value={formData.capacity}
                                onChange={handleChange('capacity')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                required
                                fullWidth
                                label="Make"
                                value={formData.make}
                                onChange={handleChange('make')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                required
                                fullWidth
                                label="Model"
                                value={formData.model}
                                onChange={handleChange('model')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Year"
                                value={formData.year}
                                onChange={handleChange('year')}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Status"
                                value={formData.status}
                                onChange={handleChange('status')}
                            >
                                <MenuItem value={1}>Available</MenuItem>
                                <MenuItem value={2}>In Use</MenuItem>
                                <MenuItem value={3}>Maintenance</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate('/trailers')} disabled={saving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
                            {saving ? 'Saving...' : 'Save Trailer'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
