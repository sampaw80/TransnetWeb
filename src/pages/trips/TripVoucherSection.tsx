import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    TextField
} from '@mui/material';
import {
    Save as SaveIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { tripApi } from '../../features/trips/api/tripApi';

export function TripVoucherSection() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [voucher, setVoucher] = useState<any>(null);

    const [formData, setFormData] = useState({
        voucherNumber: '',
        voucherDate: '',
        notes: '',
        createdByUserId: '00000000-0000-0000-0000-000000000000'
    });

    const fetchVoucher = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getVoucher(id);
            if (data) {
                setVoucher(data);
                setFormData({
                    voucherNumber: data.voucherNumber || '',
                    voucherDate: data.voucherDate ? new Date(data.voucherDate).toISOString().slice(0, 16) : '',
                    notes: data.notes || '',
                    createdByUserId: data.createdByUserId || '00000000-0000-0000-0000-000000000000'
                });
            }
        } catch (error) {
            console.error('Failed to load voucher:', error);
            // Demo Data if 404
            setFormData({
                voucherNumber: 'VCH-1001',
                voucherDate: new Date().toISOString().slice(0, 16),
                notes: 'Standard route voucher',
                createdByUserId: '00000000-0000-0000-0000-000000000000'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoucher();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        const payload: any = {
            voucherNumber: formData.voucherNumber,
            voucherDate: formData.voucherDate ? new Date(formData.voucherDate).toISOString() : new Date().toISOString(),
            notes: formData.notes || null,
            createdByUserId: formData.createdByUserId
        };
        try {
            if (voucher?.id) {
                await tripApi.updateVoucher(id, payload);
            } else {
                await tripApi.createVoucher(id, payload);
            }
            alert("Voucher saved successfully!");
            fetchVoucher();
        } catch (e) {
            console.error(e);
            alert("Failed to save voucher");
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h6">Trip Financial Voucher</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" startIcon={<PrintIcon />} disabled={loading}>Print PDF</Button>
                    <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={loading}>Save Voucher</Button>
                </Stack>
            </Stack>

            <Card variant="outlined">
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Voucher Number"
                                required
                                value={formData.voucherNumber}
                                onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Voucher Date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.voucherDate}
                                onChange={(e) => setFormData({ ...formData, voucherDate: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Created By User ID (Guid)"
                                required
                                value={formData.createdByUserId}
                                onChange={(e) => setFormData({ ...formData, createdByUserId: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Remarks / Notes"
                                multiline
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
