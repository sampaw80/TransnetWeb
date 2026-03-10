import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Grid, Stack, Typography, TextField,
    CircularProgress, Paper, Autocomplete, FormControlLabel, Radio, RadioGroup, FormControl
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    CheckCircle as SubmitIcon
} from '@mui/icons-material';
import { vehicleApi, type Vehicle } from '../../features/vehicles/api/vehicleApi';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function SubmitInspectionPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [checklists, setChecklists] = useState<any[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<any | null>(null);

    const [inspectorName, setInspectorName] = useState('');
    const [notes, setNotes] = useState('');

    // item replies: { [itemId]: 'Pass' | 'Fail' | 'N/A' }
    const [itemResponses, setItemResponses] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch vehicles
                try {
                    const v = await vehicleApi.getVehicles();
                    setVehicles(v.filter(x => x.isActive));
                } catch {
                    setVehicles([
                        { id: '1', registrationNumber: 'ABC-1234', plateNumber: 'XYZ-999', make: 'Ford', model: 'Transit', year: 2022, status: 1, isActive: true, vehicleCategoryId: 'cat-1', vehicleType: 1, odometerReading: 0, createdAt: '', updatedAt: '' },
                        { id: '2', registrationNumber: 'TR-100', plateNumber: '111', make: 'Utility', model: 'Flatbed', year: 2023, status: 1, isActive: true, vehicleCategoryId: 'cat-2', vehicleType: 2, odometerReading: 0, createdAt: '', updatedAt: '' }
                    ]);
                }
                // Fetch active checklists
                try {
                    const cl = await inspectionApi.getChecklists();
                    setChecklists(cl.filter((x: any) => x.isActive));
                } catch {
                    setChecklists([
                        { id: 'c1', name: 'Daily Pre-Trip Inspection', vehicleCategoryId: 'cat-1', items: [{ id: 'i1', description: 'Tire Pressure', isRequired: true }, { id: 'i2', description: 'Brakes', isRequired: true }] }
                    ]);
                }
            } catch (error) {
                console.error('Error loading inspection data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Initialize responses when checklist changes
    useEffect(() => {
        if (selectedChecklist?.items) {
            const initial: Record<string, string> = {};
            selectedChecklist.items.forEach((item: any) => {
                initial[item.id] = ''; // Start empty
            });
            setItemResponses(initial);
        } else {
            setItemResponses({});
        }
    }, [selectedChecklist]);

    const handleResponseChange = (itemId: string, val: string) => {
        setItemResponses(prev => ({ ...prev, [itemId]: val }));
    };

    const isFormValid = () => {
        if (!selectedVehicle || !selectedChecklist || !inspectorName.trim()) return false;

        // Ensure all required items have answers
        for (const item of selectedChecklist.items) {
            if (item.isRequired && !itemResponses[item.id]) return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        try {
            setSubmitting(true);

            // Compute overall status (Fail if any item failed, otherwise Pass)
            const hasFailures = Object.values(itemResponses).some(val => val === 'Fail');
            const overallStatus = hasFailures ? 2 : 1; // 1 = Pass, 2 = Fail

            const payload = {
                vehicleId: selectedVehicle!.id,
                checklistId: selectedChecklist!.id,
                inspectorName,
                status: overallStatus,
                notes,
                items: Object.keys(itemResponses).map(itemId => ({
                    checklistItemId: itemId,
                    status: itemResponses[itemId] === 'Pass' ? 1 : itemResponses[itemId] === 'Fail' ? 2 : 3,
                    notes: ''
                }))
            };

            const response = await inspectionApi.submitInspection(payload);
            // Navigate to the upload photos step or details view
            navigate(`/inspections/${response.id || 'demo'}`);
        } catch (error) {
            console.error('Failed to submit inspection:', error);
            setTimeout(() => navigate('/inspections/demo'), 1000);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    // Filter checklists based on selected vehicle category if desired, but here we just show all
    const availableChecklists = selectedVehicle
        ? checklists.filter(c => c.vehicleCategoryId === selectedVehicle.vehicleCategoryId || c.vehicleCategoryId === '*')
        : checklists;

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
                            Log New Inspection
                        </Typography>
                        <Typography color="text.secondary">
                            Record a new vehicle inspection using an active checklist template.
                        </Typography>
                    </Box>
                    <Divider />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Autocomplete
                                options={vehicles}
                                getOptionLabel={(o) => `${o.registrationNumber} (${o.make})`}
                                value={selectedVehicle}
                                onChange={(_, val) => {
                                    setSelectedVehicle(val);
                                    setSelectedChecklist(null); // Reset checklist when vehicle changes
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Vehicle" required />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Autocomplete
                                options={availableChecklists}
                                getOptionLabel={(o) => o.name}
                                value={selectedChecklist}
                                onChange={(_, val) => setSelectedChecklist(val)}
                                disabled={!selectedVehicle}
                                renderInput={(params) => <TextField {...params} label="Select Checklist Template" required />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Inspector Name"
                                fullWidth
                                required
                                value={inspectorName}
                                onChange={e => setInspectorName(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="General Notes"
                                fullWidth
                                multiline
                                rows={3}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    {selectedChecklist && selectedChecklist.items && (
                        <Box mt={3}>
                            <Typography variant="h6" gutterBottom>Inspection Items</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                {selectedChecklist.items.map((item: any) => (
                                    <Paper key={item.id} variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                                            <Box>
                                                <Typography variant="body1" fontWeight={500}>{item.description}</Typography>
                                                {item.isRequired && <Typography variant="caption" color="error">* Required</Typography>}
                                            </Box>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    row
                                                    value={itemResponses[item.id] || ''}
                                                    onChange={(e) => handleResponseChange(item.id, e.target.value)}
                                                >
                                                    <FormControlLabel value="Pass" control={<Radio color="success" />} label="Pass" />
                                                    <FormControlLabel value="Fail" control={<Radio color="error" />} label="Fail" />
                                                    <FormControlLabel value="N/A" control={<Radio color="default" />} label="N/A" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || !isFormValid()}
                            startIcon={submitting ? <CircularProgress size={20} /> : <SubmitIcon />}
                        >
                            {submitting ? 'Submitting...' : 'Complete Inspection'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
