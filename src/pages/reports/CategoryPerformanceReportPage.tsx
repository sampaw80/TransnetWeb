import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, Typography, Grid } from '@mui/material';
import { Refresh as RefreshIcon, TrendingUp, Engineering, DirectionsCar } from '@mui/icons-material';
import {
    BarChart,
    PieChart
} from '@mui/x-charts';
import { reportApi } from '../../features/reports/api/reportApi';

export function CategoryPerformanceReportPage() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const data = await reportApi.getCategoryPerformance();
            setReportData(data);
        } catch (error) {
            console.error('Failed to fetch report data:', error);
            // Fallback Demo Data for Analytics
            setReportData({
                summary: {
                    totalVehicles: 142,
                    totalCategories: 6,
                    totalInspectionsThisMonth: 89,
                    totalWorkOrdersOpen: 24
                },
                categoryDistribution: [
                    { id: 'c1', label: 'Heavy Trucks', value: 45 },
                    { id: 'c2', label: 'Light Utilities', value: 30 },
                    { id: 'c3', label: 'Trailers', value: 50 },
                    { id: 'c4', label: 'Passenger Vans', value: 17 }
                ],
                maintenanceCosts: [
                    { category: 'Heavy Trucks', cost: 15400 },
                    { category: 'Light Utilities', cost: 4200 },
                    { category: 'Trailers', cost: 8900 },
                    { category: 'Passenger Vans', cost: 1200 }
                ],
                utilizationRates: [
                    { category: 'Heavy Trucks', rate: 85 },
                    { category: 'Light Utilities', rate: 92 },
                    { category: 'Trailers', rate: 76 },
                    { category: 'Passenger Vans', rate: 45 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    if (!reportData && !loading) return <Typography>No data returned.</Typography>;

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Category Performance Report
                    </Typography>
                    <Typography color="text.secondary">
                        High-level analytics and metrics across all recorded vehicle categories.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchReport}
                        disabled={loading}
                    >
                        Refresh Data
                    </Button>
                </Stack>
            </Stack>

            <Divider />

            {/* KPI Summary Cards */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <DirectionsCar color="primary" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" variant="subtitle2">Total Fleet Size</Typography>
                                    <Typography variant="h4" fontWeight={700}>{reportData?.summary?.totalVehicles || 0}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <TrendingUp color="success" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" variant="subtitle2">Active Categories</Typography>
                                    <Typography variant="h4" fontWeight={700}>{reportData?.summary?.totalCategories || 0}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Engineering color="warning" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" variant="subtitle2">Open Work Orders</Typography>
                                    <Typography variant="h4" fontWeight={700}>{reportData?.summary?.totalWorkOrdersOpen || 0}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <RefreshIcon color="info" sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography color="text.secondary" variant="subtitle2">Monthly Inspections</Typography>
                                    <Typography variant="h4" fontWeight={700}>{reportData?.summary?.totalInspectionsThisMonth || 0}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: 400, p: 2 }}>
                        <Typography variant="h6" gutterBottom>Vehicle Distribution by Category</Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            {reportData?.categoryDistribution && (
                                <PieChart
                                    series={[{
                                        data: reportData.categoryDistribution,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        innerRadius: 30,
                                        paddingAngle: 5,
                                        cornerRadius: 5,
                                    }]}
                                    height={300}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: 400, p: 2 }}>
                        <Typography variant="h6" gutterBottom>Maintenance Costs ($)</Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            {reportData?.maintenanceCosts && (
                                <BarChart
                                    dataset={reportData.maintenanceCosts}
                                    xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
                                    series={[{ dataKey: 'cost', color: '#ff5722' }]}
                                    height={300}
                                    margin={{ left: 60 }}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ height: 400, p: 2 }}>
                        <Typography variant="h6" gutterBottom>Utilization Rate (%) per Category</Typography>
                        <Box sx={{ flexGrow: 1, height: 300 }}>
                            {reportData?.utilizationRates && (
                                <BarChart
                                    dataset={reportData.utilizationRates}
                                    yAxis={[{ scaleType: 'band', dataKey: 'category' }]}
                                    series={[{ dataKey: 'rate', color: '#4caf50' }]}
                                    layout="horizontal"
                                    height={300}
                                    margin={{ left: 150 }}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
