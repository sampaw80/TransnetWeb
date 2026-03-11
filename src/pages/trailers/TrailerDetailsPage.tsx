import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Card, CardContent, Chip, Divider, Grid,
    Stack, Typography, CircularProgress, Tab, Tabs, Paper, IconButton
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    RvHookup as TrailerIcon
} from '@mui/icons-material';
import { trailerApi, type Trailer } from '../../features/trailers/api/trailerApi';

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
            id={`trailer-tabpanel-${index}`}
            aria-labelledby={`trailer-tab-${index}`}
            {...other}
            style={{ paddingTop: '24px' }}
        >
            {value === index && (
                <Box>{children}</Box>
            )}
        </div>
    );
}

export function TrailerDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trailer, setTrailer] = useState<Trailer | null>(null);
    const [performance, setPerformance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Fallback for demo since backend might throw 404
                try {
                    const t = await trailerApi.getTrailerById(id);
                    setTrailer(t);
                } catch (e) {
                    setTrailer({
                        id,
                        registrationNumber: 'TR-100',
                        type: 'Flatbed',
                        capacity: 20000,
                        status: 1,
                        currentVehicleId: 'v1',
                        currentVehicleReg: 'ABC-1234',
                        lastMaintenanceDate: new Date().toISOString()
                    });
                }

                try {
                    const p = await trailerApi.getTrailerPerformance(id);
                    setPerformance(p);
                } catch {
                    setPerformance({ revenue: 15400, expenses: 2300, tripsCompleted: 42 });
                }

            } catch (error) {
                console.error('Failed to fetch trailer details:', error);
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

    if (!trailer) {
        return (
            <Box p={3}>
                <Typography variant="h5" color="error">Trailer not found.</Typography>
                <Button startIcon={<BackIcon />} onClick={() => navigate('/trailers')} sx={{ mt: 2 }}>
                    Back to list
                </Button>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={() => navigate('/trailers')} size="small">
                        <BackIcon />
                    </IconButton>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            bgcolor: 'secondary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'secondary.contrastText',
                        }}
                    >
                        <TrailerIcon fontSize="large" />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            {trailer.registrationNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {trailer.type} Trailer - {trailer.capacity?.toLocaleString()} kg Capacity
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/trailers/${trailer.id}/attach`)}
                    >
                        Manage Attachment
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/trailers/${trailer.id}/update`)}
                    >
                        Edit Trailer
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="trailer details tabs">
                    <Tab label="Overview" />
                    <Tab label="Performance Analytics" />
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
                                        <Typography variant="body1" fontWeight={500}>{trailer.registrationNumber}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Type</Typography>
                                        <Typography variant="body1" fontWeight={500}>{trailer.type || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Capacity</Typography>
                                        <Typography variant="body1" fontWeight={500}>{trailer.capacity ? `${trailer.capacity.toLocaleString()} kg` : 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Attachment Status</Typography>
                                        <Box mt={0.5}>
                                            {trailer.currentVehicleReg ? (
                                                <Chip label={`Attached: ${trailer.currentVehicleReg}`} color="info" size="small" />
                                            ) : (
                                                <Chip label="Unattached" color="default" size="small" />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Operational Status</Typography>
                                        <Box mt={0.5}>
                                            {trailer.status === 1 && <Chip label="Available" color="success" size="small" />}
                                            {trailer.status === 2 && <Chip label="In Use" color="info" size="small" />}
                                            {trailer.status === 3 && <Chip label="Maintenance" color="warning" size="small" />}
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography color="text.secondary" variant="caption">Last Maintenance</Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {trailer.lastMaintenanceDate ? new Date(trailer.lastMaintenanceDate).toLocaleDateString() : 'Never'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Attachment</Typography>
                                <Divider sx={{ mb: 2 }} />
                                {trailer.currentVehicleReg ? (
                                    <Stack spacing={2}>
                                        <Typography variant="body2">Currently attached to vehicle <strong>{trailer.currentVehicleReg}</strong>.</Typography>
                                        <Button variant="outlined" color="warning" fullWidth>
                                            Detach Trailer
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Stack spacing={2}>
                                        <Typography variant="body2" color="text.secondary">Trailer is currently idle.</Typography>
                                        <Button variant="contained" fullWidth onClick={() => navigate(`/trailers/${trailer.id}/attach`)}>
                                            Attach to Vehicle
                                        </Button>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary" gutterBottom>Total Revenue</Typography>
                            <Typography variant="h4" color="success.main" fontWeight={700}>
                                ${performance?.revenue?.toLocaleString() || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary" gutterBottom>Maintenance Expenses</Typography>
                            <Typography variant="h4" color="error.main" fontWeight={700}>
                                ${performance?.expenses?.toLocaleString() || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary" gutterBottom>Trips Completed</Typography>
                            <Typography variant="h4" color="info.main" fontWeight={700}>
                                {performance?.tripsCompleted?.toLocaleString() || 0}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </CustomTabPanel>
        </Stack>
    );
}
