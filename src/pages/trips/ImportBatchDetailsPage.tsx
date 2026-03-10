import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Stack,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ErrorOutline as ErrorIcon,
    CheckCircleOutline as CheckIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { importBatchApi } from '../../features/trips/api/importBatchApi';

export function ImportBatchDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchBatchDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await importBatchApi.getBatchDetails(id);
            setBatch(data);
        } catch (error) {
            console.error('Failed to fetch batch details:', error);
            // Demo Data
            setBatch({
                id: id,
                submittedBy: 'System',
                uploadedAt: '2023-11-05T10:00:00Z',
                status: 'Completed with Errors',
                totalRows: 50,
                successfulRows: 48,
                failedRows: 2,
                logs: [
                    { rowNumber: 15, message: 'Driver "Unknown" not found in system.', isError: true },
                    { rowNumber: 32, message: 'Vehicle format invalid.', isError: true },
                    { rowNumber: 1, message: 'Successfully parsed initial rows.', isError: false }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatchDetails();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!batch) {
        return <Typography color="error">Batch not found.</Typography>;
    }

    const getStatusColor = (status: string) => {
        if (status.includes('Completed with Errors')) return 'warning';
        if (status.includes('Completed')) return 'success';
        if (status.includes('Failed')) return 'error';
        return 'info';
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/trips/import-batches')}
                        color="inherit"
                    >
                        Back
                    </Button>
                    <Typography variant="h4" fontWeight={800}>
                        Batch {batch.id}
                    </Typography>
                    <Chip label={batch.status} color={getStatusColor(batch.status) as any} />
                </Stack>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchBatchDetails}>
                    Refresh
                </Button>
            </Stack>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Batch Summary</Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Submitted By</Typography>
                            <Typography variant="body1">{batch.submittedBy}</Typography>

                            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Uploaded At</Typography>
                            <Typography variant="body1">{new Date(batch.uploadedAt).toLocaleString()}</Typography>

                            <Box sx={{ mt: 3, p: 2, bgcolor: (t) => t.palette.background.default, borderRadius: 1 }}>
                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="text.secondary">Total Rows Evaluated</Typography>
                                    <Typography variant="body2" fontWeight={700}>{batch.totalRows}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="success.main">Successfully Created</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">{batch.successfulRows}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="error.main">Failed Rows</Typography>
                                    <Typography variant="body2" fontWeight={700} color="error.main">{batch.failedRows}</Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Processing Logs</Typography>
                            {(!batch.logs || batch.logs.length === 0) ? (
                                <Typography color="text.secondary">No detailed logs collected for this batch.</Typography>
                            ) : (
                                <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: 'background.paper' }}>
                                    {batch.logs.map((log: any, index: number) => (
                                        <ListItem key={index} divider={index < batch.logs.length - 1} sx={{ py: 1.5 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {log.isError ? <ErrorIcon color="error" /> : <CheckIcon color="success" />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={log.message}
                                                secondary={`Originating from row #${log.rowNumber}`}
                                                primaryTypographyProps={{ variant: 'body2', color: log.isError ? 'error.main' : 'text.primary' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}
