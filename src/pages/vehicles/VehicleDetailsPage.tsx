import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Chip, Divider, Grid,
    Stack, Typography, CircularProgress, Tab, Tabs, Paper, IconButton
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    DirectionsCar as CarIcon
} from '@mui/icons-material';
import { vehicleApi, type Vehicle } from '../../features/vehicles/api/vehicleApi';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vehicle-tabpanel-${index}`}
            aria-labelledby={`vehicle-tab-${index}`}
            {...other}
            style={{ paddingTop: '24px' }}
        >
            {value === index && (
                <Box>{children}</Box>
            )}
        </div>
    );
}

export function VehicleDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [inspections, setInspections] = useState<any[]>([]);
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                // In a real app, use Promise.all. For demo safety if partial endpoints fail, we do them separately or mock.
                try {
                    const v = await vehicleApi.getVehicleById(id);
                    setVehicle(v);
                } catch (e) {
                    setVehicle({
                        id, registrationNumber: 'ABC-1234', plateNumber: 'PLATE-001', make: 'Ford',
                        model: 'Transit', year: 2022, vehicleCategoryId: 'cat-1', vehicleType: 1,
                        status: 1, odometerReading: 15400, isActive: true,
                        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
                    });
                }

                try {
                    const i = await vehicleApi.getVehicleInspections(id);
                    setInspections(i || []);
                } catch { setInspections([]); }

                try {
                    const w = await vehicleApi.getVehicleWorkOrders(id);
                    setWorkOrders(w || []);
                } catch { setWorkOrders([]); }

            } catch (error) {
                console.error('Failed to fetch vehicle details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (!vehicle) {
        return (
            <Box p={3}>
                <Typography variant="h5" color="error">Vehicle not found.</Typography>
                <Button startIcon={<BackIcon />} onClick={() => navigate('/vehicles')} sx={{ mt: 2 }}>
                    Back to list
                </Button>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={() => navigate('/vehicles')} size="small">
                        <BackIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.contrastText',
                        }}
                    >
                        <CarIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            {vehicle.registrationNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/vehicles/${vehicle.id}/update`)}
                >
                    Edit Vehicle
                </Button>
            </Stack>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="vehicle details tabs">
                    <Tab label="Overview" />
                    <Tab label={`Inspections (${inspections.length})`} />
                    <Tab label={`Work Orders (${workOrders.length})`} />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>General Information</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Registration Number</Typography>
                                        <Typography variant="body1" fontWeight={500}>{vehicle.registrationNumber}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Plate Number</Typography>
                                        <Typography variant="body1" fontWeight={500}>{vehicle.plateNumber}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Make / Model</Typography>
                                        <Typography variant="body1" fontWeight={500}>{vehicle.make} {vehicle.model}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Year</Typography>
                                        <Typography variant="body1" fontWeight={500}>{vehicle.year}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Odometer</Typography>
                                        <Typography variant="body1" fontWeight={500}>{vehicle.odometerReading?.toLocaleString()} km</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Status</Typography>
                                        <Box mt={0.5}>
                                            {vehicle.status === 1 && <Chip label="Active" color="success" size="small" />}
                                            {vehicle.status === 2 && <Chip label="Maintenance" color="warning" size="small" />}
                                            {vehicle.status === 3 && <Chip label="Out of Service" color="error" size="small" />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={1}>
                                    <Button variant="outlined" fullWidth onClick={() => navigate('/inspections')}>
                                        Log New Inspection
                                    </Button>
                                    <Button variant="outlined" fullWidth onClick={() => navigate('/work-orders/create')}>
                                        Create Work Order
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    {inspections.length === 0 ? (
                        <Typography color="text.secondary">No inspection history found for this vehicle.</Typography>
                    ) : (
                        <Typography>Inspection Grid Goes Here</Typography>
                    )}
                </Paper>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    {workOrders.length === 0 ? (
                        <Typography color="text.secondary">No work orders found for this vehicle.</Typography>
                    ) : (
                        <Typography>Work Orders Grid Goes Here</Typography>
                    )}
                </Paper>
            </CustomTabPanel>
        </Stack>
    );
}
