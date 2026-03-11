import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Chip,
    Grid,
    Stack,
    Tab,
    Tabs,
    Typography,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Timeline as StopsIcon,
    PauseCircle as HaltsIcon,
    Receipt as VoucherIcon,
    UploadFile as PodIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { tripApi } from '../../features/trips/api/tripApi';

// Import sub-sections from the hub (or directly if preferred)
import {
    TripStopsSection,
    TripHaltsSection,
    TripVoucherSection,
    PODUploadSection
} from '../tripsHub';

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
            id={`trip-tabpanel-${index}`}
            aria-labelledby={`trip-tab-${index}`}
            {...other}
            style={{ height: '100%', display: value === index ? 'block' : 'none' }}
        >
            {value === index && (
                <Box sx={{ p: 3, height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function TripDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const fetchTripDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getTrip(id);
            setTrip(data);
        } catch (error) {
            console.error('Failed to fetch trip details:', error);
            // Fallback
            setTrip({
                id,
                driver: 'John Doe',
                vehicle: 'Truck A (Volvo VNL)',
                status: 'In Progress',
                startDate: '2023-11-01T08:00:00Z',
                endDate: null
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripDetails();
    }, [id]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!trip) {
        return <Typography color="error">Trip not found.</Typography>;
    }

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/trips')}
                        color="inherit"
                    >
                        Back to Trips
                    </Button>
                    <Typography variant="h4" fontWeight={800}>
                        Trip {trip.id}
                    </Typography>
                    <Chip label={trip.status} color="primary" />
                </Stack>
                <Button variant="contained" onClick={() => navigate(`/trips/${id}/edit`)}>Edit Trip</Button>
            </Stack>

            <Card variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="trip management tabs"
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
                >
                    <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
                    <Tab icon={<StopsIcon />} iconPosition="start" label="Stops" />
                    <Tab icon={<HaltsIcon />} iconPosition="start" label="Halts" />
                    <Tab icon={<VoucherIcon />} iconPosition="start" label="Voucher" />
                    <Tab icon={<PodIcon />} iconPosition="start" label="POD Uploads" />
                </Tabs>

                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {/* OVERVIEW TAB */}
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Driver</Typography>
                                <Typography variant="body1" fontWeight={500} gutterBottom>{trip.driver}</Typography>

                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Assigned Vehicle</Typography>
                                <Typography variant="body1" fontWeight={500}>{trip.vehicle}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                <Typography variant="body1" fontWeight={500} gutterBottom>
                                    {trip.startDate ? new Date(trip.startDate).toLocaleString() : 'Not Started'}
                                </Typography>

                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>End Date</Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {trip.endDate ? new Date(trip.endDate).toLocaleString() : 'In Progress'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    {/* STOPS TAB */}
                    <CustomTabPanel value={tabValue} index={1}>
                        {/* Pass down the trip ID to the section so it pulls the correct route */}
                        <TripStopsSection />
                    </CustomTabPanel>

                    {/* HALTS TAB */}
                    <CustomTabPanel value={tabValue} index={2}>
                        <TripHaltsSection />
                    </CustomTabPanel>

                    {/* VOUCHER TAB */}
                    <CustomTabPanel value={tabValue} index={3}>
                        <TripVoucherSection />
                    </CustomTabPanel>

                    {/* POD UPLOADS TAB */}
                    <CustomTabPanel value={tabValue} index={4}>
                        <PODUploadSection />
                    </CustomTabPanel>

                </Box>
            </Card>
        </Stack>
    );
}
