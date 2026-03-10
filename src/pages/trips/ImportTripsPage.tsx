import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { tripApi } from '../../features/trips/api/tripApi';

export function ImportTripsPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccess(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await tripApi.importTrips(formData);

            // Let's assume the API returns an object { batchId: "B-1234" }
            setSuccess(`File uploaded successfully! Background processing started.`);
            setFile(null);

            // After a moment traverse to the batches list to let user see logs
            setTimeout(() => {
                navigate(`/trips/import-batches/${result.batchId || 'recent'}`);
            }, 2000);

        } catch (e: any) {
            console.error(e);
            setError(e.response?.data?.message || 'Failed to import trips. Check the file format.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/trips')}
                    color="inherit"
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight={800}>
                    Import Trips
                </Typography>
            </Stack>

            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Card variant="outlined">
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>

                    <Box textAlign="center">
                        <Typography variant="h6" gutterBottom>Upload Excel File</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ maxWidth: 400 }}>
                            Ensure your Excel file follows the standardized trip template containing the Driver, Assigned Vehicle, and initial Status.
                        </Typography>
                    </Box>

                    <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ py: 3, px: 5, borderStyle: 'dashed', borderWidth: 2 }}
                    >
                        {file ? file.name : "Select Excel File"}
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".xlsx, .xls, .csv"
                            hidden
                        />
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        sx={{ minWidth: 200 }}
                    >
                        {uploading ? <CircularProgress size={24} color="inherit" /> : 'Start Import'}
                    </Button>

                </CardContent>
            </Card>
        </Stack>
    );
}
