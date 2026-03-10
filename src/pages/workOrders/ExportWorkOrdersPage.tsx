import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Stack, Typography, CircularProgress, Paper
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    GetApp as DownloadIcon
} from '@mui/icons-material';
import { workOrderApi } from '../../features/workOrders/api/workOrderApi';

export function ExportWorkOrdersPage() {
    const navigate = useNavigate();
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        try {
            setExporting(true);
            const blob = await workOrderApi.exportWorkOrders();
            // Browser download trick
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `work_orders_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Failed to export:', error);
            alert("Failed to export. API may be unavailable. Creating demo download...");
            // Demo file
            const blob = new Blob(['ID,Title,Status\n1,Demo Work Order,Open'], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `demo_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate('/work-orders')}>
                    Back to List
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Export Work Orders
                        </Typography>
                        <Typography color="text.secondary">
                            Download a complete CSV report of all maintenance work orders for analysis.
                        </Typography>
                    </Box>
                    <Divider />

                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <DownloadIcon color="primary" sx={{ fontSize: 64, mb: 2, opacity: 0.8 }} />
                        <Typography variant="body1" gutterBottom>
                            Ready to generate your report.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This will trigger a download containing all historical work order data and their current statuses.
                        </Typography>
                    </Box>

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate('/work-orders')} disabled={exporting}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleExport}
                            disabled={exporting}
                            startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                        >
                            {exporting ? 'Generating Document...' : 'Download Report'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
