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
    Divider,
    TextField,
    InputAdornment
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
        advanceAmount: 0,
        fuelAllowance: 0,
        tollExpenses: 0,
        otherExpenses: 0,
        remarks: ''
    });

    const fetchVoucher = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await tripApi.getVoucher(id);
            if (data) {
                setVoucher(data);
                setFormData({
                    advanceAmount: data.advanceAmount || 0,
                    fuelAllowance: data.fuelAllowance || 0,
                    tollExpenses: data.tollExpenses || 0,
                    otherExpenses: data.otherExpenses || 0,
                    remarks: data.remarks || ''
                });
            }
        } catch (error) {
            console.error('Failed to load voucher:', error);
            // Demo Data if 404
            setFormData({
                advanceAmount: 500,
                fuelAllowance: 1200,
                tollExpenses: 150,
                otherExpenses: 0,
                remarks: 'Standard route voucher'
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
        try {
            if (voucher?.id) {
                await tripApi.updateVoucher(id, formData);
            } else {
                await tripApi.createVoucher(id, formData);
            }
            alert("Voucher saved successfully!");
            fetchVoucher();
        } catch (e) {
            console.error(e);
            alert("Failed to save voucher");
        }
    };

    const calculateTotal = () => {
        return Number(formData.advanceAmount) + Number(formData.fuelAllowance) +
            Number(formData.tollExpenses) + Number(formData.otherExpenses);
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
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Driver Advance"
                                type="number"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                value={formData.advanceAmount}
                                onChange={(e) => setFormData({ ...formData, advanceAmount: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Fuel Allowance"
                                type="number"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                value={formData.fuelAllowance}
                                onChange={(e) => setFormData({ ...formData, fuelAllowance: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Toll Expenses"
                                type="number"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                value={formData.tollExpenses}
                                onChange={(e) => setFormData({ ...formData, tollExpenses: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Other Expenses"
                                type="number"
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                value={formData.otherExpenses}
                                onChange={(e) => setFormData({ ...formData, otherExpenses: Number(e.target.value) })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Remarks / Notes"
                                multiline
                                rows={3}
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" justifyContent="flex-end">
                                <Typography variant="h5" fontWeight={700}>
                                    Total Allocated: ${calculateTotal().toFixed(2)}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
