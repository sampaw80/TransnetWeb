import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Stack, Typography, CircularProgress, Paper, IconButton
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    CloudUpload as UploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function UploadPhotosPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);

            // Generate preview URLs
            const newUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));

        // Revoke old URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (!id || selectedFiles.length === 0) return;

        try {
            setUploading(true);
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append(`photos`, file); // Depends on backend expected key
            });

            await inspectionApi.uploadPhotos(id, formData);
            navigate(`/inspections/${id}`);
        } catch (error) {
            console.error('Failed to upload photos:', error);
            // Demo fallback - still navigate back
            setTimeout(() => navigate(`/inspections/${id}`), 1000);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                    Back to Inspection
                </Button>
            </Stack>

            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Upload Inspection Photos
                        </Typography>
                        <Typography color="text.secondary">
                            Attach supporting photos to inspection report #{id}.
                        </Typography>
                    </Box>
                    <Divider />

                    {/* Upload Area */}
                    <Box
                        component="label"
                        sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 6,
                            textAlign: 'center',
                            bgcolor: 'background.default',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6">Click to select photos</Typography>
                        <Typography variant="body2" color="text.secondary">JPG, PNG, GIF</Typography>
                    </Box>

                    {/* Previews */}
                    {previewUrls.length > 0 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Selected Photos ({previewUrls.length})</Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                {previewUrls.map((url, index) => (
                                    <Box key={index} position="relative">
                                        <Box
                                            component="img"
                                            src={url}
                                            alt={`Preview ${index}`}
                                            sx={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 1, border: 1, borderColor: 'divider' }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemovePhoto(index)}
                                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.lighter' } }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate(-1)} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={uploading || selectedFiles.length === 0}
                            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                        >
                            {uploading ? 'Uploading...' : 'Upload Photos'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
