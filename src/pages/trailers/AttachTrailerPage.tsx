import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Stack, Typography, CircularProgress, Paper, Autocomplete, TextField
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Link as AttachIcon
} from '@mui/icons-material';
import { trailerApi, type Trailer } from '../../features/trailers/api/trailerApi';
import { vehicleApi, type Vehicle } from '../../features/vehicles/api/vehicleApi';

export function AttachTrailerPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [trailer, setTrailer] = useState<Trailer | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // Fallback demo data logic
                try {
                    const t = await trailerApi.getTrailerById(id);
                    setTrailer(t);
                } catch {
                    setTrailer({ id, registrationNumber: 'TR-100', type: 'Flatbed', capacity: 20000, status: 1 });
                }

                try {
                    const vList = await vehicleApi.getVehicles();
                    setVehicles(vList);
                } catch {
                    setVehicles([
                        { id: 'v1', registrationNumber: 'ABC-1234', plateNumber: 'XYZ-999', make: 'Ford', model: 'Transit', year: 2022, status: 1, isActive: true, vehicleCategoryId: 'cat-1', vehicleType: 1, odometerReading: 0, createdAt: '', updatedAt: '' },
                        { id: 'v2', registrationNumber: 'DEF-5678', plateNumber: 'LMN-444', make: 'Mercedes', model: 'Sprinter', year: 2021, status: 1, isActive: true, vehicleCategoryId: 'cat-1', vehicleType: 2, odometerReading: 0, createdAt: '', updatedAt: '' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch data for attach:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAttach = async () => {
        if (!selectedVehicle || !trailer) return;

        try {
            setSaving(true);
            await trailerApi.attachToVehicle(trailer.id, selectedVehicle.id);
            navigate(`/trailers/${trailer.id}`);
        } catch (error) {
            console.error('Error attaching trailer:', error);
            setTimeout(() => navigate(`/trailers/${trailer.id}`), 1000);
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

    if (!trailer) {
        return <Typography color="error">Trailer not found.</Typography>;
    }

    const activeVehicles = vehicles.filter(v => v.status === 1); // Only show active vehicles

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate(`/trailers/${trailer.id}`)}>
                    Back
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Attach Trailer
                        </Typography>
                        <Typography color="text.secondary">
                            Select an available vehicle to assign to trailer <strong>{trailer.registrationNumber}</strong>.
                        </Typography>
                    </Box>
                    <Divider />

                    <Autocomplete
                        options={activeVehicles}
                        getOptionLabel={(option) => `${option.registrationNumber} (${option.make} ${option.model})`}
                        value={selectedVehicle}
                        onChange={(_event, newValue) => setSelectedVehicle(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Vehicle" required />}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                <Stack spacing={0.5}>
                                    <Typography variant="body1">{option.registrationNumber}</Typography>
                                    <Typography variant="caption" color="text.secondary">{option.plateNumber} • {option.make} {option.model}</Typography>
                                </Stack>
                            </li>
                        )}
                        fullWidth
                    />

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate(`/trailers/${trailer.id}`)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAttach}
                            disabled={saving || !selectedVehicle}
                            startIcon={saving ? <CircularProgress size={20} /> : <AttachIcon />}
                        >
                            {saving ? 'Attaching...' : 'Confirm Attachment'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
