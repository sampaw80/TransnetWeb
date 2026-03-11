import { useEffect, useState } from 'react';
import { Button, Chip, Paper, Stack, Typography, Grid, Box, Divider } from '@mui/material';
import { Refresh as RefreshIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { assetApi } from '../../features/assets/api/assetApi';

export function AssetLocationsPage() {
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const data = await assetApi.getAssetLocations();
            setLocations(data);
        } catch (error) {
            console.error('Failed to fetch asset locations:', error);
            // Fallback Data
            setLocations([
                {
                    id: 'loc1',
                    name: 'Main Depot',
                    address: '123 Logistics Way, Industrial Park',
                    assetCount: 45,
                    assets: [
                        { id: 'a1', name: 'Forklift F-1', type: 'Equipment', status: 1 },
                        { id: 'a2', name: 'Pallet Jack P-4', type: 'Equipment', status: 1 },
                    ]
                },
                {
                    id: 'loc2',
                    name: 'North Warehouse',
                    address: '456 Northern Blvd',
                    assetCount: 12,
                    assets: [
                        { id: 'a3', name: 'Generator G-2', type: 'Equipment', status: 3 },
                    ]
                },
                {
                    id: 'loc3',
                    name: 'Repair Shop',
                    address: '789 Service Rd',
                    assetCount: 8,
                    assets: [
                        { id: 'a4', name: 'Engine Hoist E-1', type: 'Tool', status: 1 },
                        { id: 'a5', name: 'Flatbed Trailer T-43', type: 'Trailer', status: 3 },
                    ]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1: return 'success';
            case 2: return 'info';
            case 3: return 'warning';
            default: return 'default';
        }
    };

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={800}>
                    Asset Locations
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchLocations}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            <Typography color="text.secondary">
                View the geographical distribution of your fleet and equipment inventory.
            </Typography>

            <Grid container spacing={3}>
                {locations.map((loc) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={loc.id}>
                        <Paper variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" alignItems="flex-start" spacing={2} mb={2}>
                                <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                                    <LocationIcon />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="h6" fontWeight={600}>{loc.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{loc.address}</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="button" color="text.secondary">Total Assets</Typography>
                                <Chip label={loc.assetCount} color="primary" size="small" />
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2" sx={{ mt: 1, mb: 2 }}>Sample Assets at Location</Typography>
                            <Stack spacing={1} flex={1}>
                                {loc.assets?.map((asset: any) => (
                                    <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                        <Typography variant="body2">{asset.name}</Typography>
                                        <Chip
                                            size="small"
                                            label={asset.status === 1 ? 'Avail' : asset.status === 2 ? 'In Use' : 'Maint'}
                                            color={getStatusColor(asset.status)}
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                ))}
                                {(!loc.assets || loc.assets.length === 0) && (
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">No sample data available.</Typography>
                                )}
                            </Stack>

                            <Button variant="text" size="small" fullWidth sx={{ mt: 2 }}>
                                View All Location Assets
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
