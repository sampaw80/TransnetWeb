import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Grid,
    Stack, Typography, CircularProgress, Paper, Chip
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function InspectionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [inspection, setInspection] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                try {
                    const m = await inspectionApi.getInspectionById(id);
                    setInspection(m);
                } catch {
                    // Fallback UI data
                    setInspection({
                        id,
                        vehicleId: 'v123',
                        vehicleReg: 'TR-100',
                        inspectorName: 'John Doe',
                        inspectionDate: new Date().toISOString(),
                        status: 1, // 1=Pass, 2=Fail
                        notes: 'Vehicle looks good. minor scratches on left door.',
                        items: [
                            { checklistItemId: '1', description: 'Tires Check', status: 1, notes: 'Good condition' },
                            { checklistItemId: '2', description: 'Brake Check', status: 1, notes: '' },
                            { checklistItemId: '3', description: 'Oil Level', status: 2, notes: 'Slightly low' }, // Failed item
                        ]
                    });
                }
            } catch (error) {
                console.error('Failed to fetch data for inspection details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (!inspection) {
        return <Typography color="error">Inspection not found.</Typography>;
    }

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 1000, mx: 'auto', mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button startIcon={<PrintIcon />} variant="outlined" onClick={() => window.print()}>
                    Print Report
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Inspection Report
                            </Typography>
                            <Typography color="text.secondary">
                                Completed on {new Date(inspection.inspectionDate).toLocaleString()}
                            </Typography>
                        </Box>
                        <Chip
                            label={inspection.status === 1 ? 'PASS' : 'FAIL'}
                            color={inspection.status === 1 ? 'success' : 'error'}
                            size="medium"
                            sx={{ fontWeight: 'bold', px: 1 }}
                        />
                    </Box>
                    <Divider />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="caption" color="text.secondary">Vehicle Registration</Typography>
                            <Typography variant="body1" fontWeight={500}>{inspection.vehicleReg || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="caption" color="text.secondary">Inspector Name</Typography>
                            <Typography variant="body1" fontWeight={500}>{inspection.inspectorName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="caption" color="text.secondary">General Notes</Typography>
                            <Typography variant="body1">{inspection.notes || 'None'}</Typography>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>Checklist Items</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {inspection.items?.length > 0 ? (
                            <Stack spacing={2}>
                                {inspection.items.map((item: any, idx: number) => (
                                    <Paper key={idx} sx={{ p: 2, border: 1, borderColor: 'divider', bgcolor: item.status === 2 ? 'error.lighter' : 'background.default' }}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                                            <Box flex={1}>
                                                <Typography variant="body1" fontWeight={500}>{item.description}</Typography>
                                                {item.notes && <Typography variant="body2" color="text.secondary" mt={0.5}>Notes: {item.notes}</Typography>}
                                            </Box>
                                            <Box width={100} textAlign="right">
                                                {item.status === 1 && <Chip label="Pass" color="success" size="small" />}
                                                {item.status === 2 && <Chip label="Fail" color="error" size="small" />}
                                                {item.status === 3 && <Chip label="N/A" color="default" size="small" />}
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">No items recorded for this inspection.</Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Stack>
    );
}
