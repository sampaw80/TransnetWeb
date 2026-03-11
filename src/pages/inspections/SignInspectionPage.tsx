import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Stack, Typography, CircularProgress, Paper, TextField
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Draw as SignIcon
} from '@mui/icons-material';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function SignInspectionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [signing, setSigning] = useState(false);
    const [signerName, setSignerName] = useState('');
    const [signatureData, setSignatureData] = useState('');

    const handleSign = async () => {
        if (!id || !signerName.trim()) return;

        try {
            setSigning(true);

            const payload = {
                signerName,
                signatureData: signatureData || 'Typed-Signature',
                signedAt: new Date().toISOString()
            };

            await inspectionApi.signInspection(id, payload);
            navigate(`/inspections/${id}`);
        } catch (error) {
            console.error('Failed to sign inspection:', error);
            setTimeout(() => navigate(`/inspections/${id}`), 1000);
        } finally {
            setSigning(false);
        }
    };

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Sign Inspection Report
                        </Typography>
                        <Typography color="text.secondary">
                            Provide authorization that the inspection #{id} was completed accurately.
                        </Typography>
                    </Box>
                    <Divider />

                    <TextField
                        label="Print Name"
                        required
                        fullWidth
                        value={signerName}
                        onChange={e => setSignerName(e.target.value)}
                    />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Signature</Typography>
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                height: 150,
                                bgcolor: 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Placeholder for an actual Canvas drawing pad plugin.  */}
                            <TextField
                                placeholder="Type signature or sign here..."
                                variant="standard"
                                InputProps={{ disableUnderline: true, sx: { fontFamily: 'cursive', fontSize: '1.5rem', textAlign: 'center' } }}
                                value={signatureData}
                                onChange={e => setSignatureData(e.target.value)}
                                fullWidth
                                sx={{ px: 2 }}
                            />
                        </Box>
                    </Box>

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate(-1)} disabled={signing}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSign}
                            disabled={signing || !signerName.trim()}
                            startIcon={signing ? <CircularProgress size={20} /> : <SignIcon />}
                        >
                            {signing ? 'Signing...' : 'Sign Document'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
