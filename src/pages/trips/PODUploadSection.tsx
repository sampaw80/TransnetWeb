import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Stack,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    UploadFile as UploadIcon,
    Delete as DeleteIcon,
    InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { tripApi } from '../../features/trips/api/tripApi';

export function PODUploadSection() {
    const { id } = useParams<{ id: string }>();
    const [pods, setPods] = useState<any[]>([]);

    const fetchPods = async () => {
        if (!id) return;
        try {
            const data = await tripApi.getPODs(id);
            setPods(data);
        } catch (error) {
            console.error('Failed to load pods:', error);
            // Demo Data
            setPods([
                { id: 'Doc-1', fileName: 'signed_manifest.pdf', uploadedAt: '2023-11-03T10:00:00Z', size: '1.2 MB' },
                { id: 'Doc-2', fileName: 'delivery_receipt_hq.png', uploadedAt: '2023-11-03T10:05:00Z', size: '2.4 MB' }
            ]);
        }
    };

    useEffect(() => {
        fetchPods();
    }, [id]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !id) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            await tripApi.uploadPOD(id, formData);
            fetchPods();
            alert("POD Uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload POD", error);
            alert("Failed to upload document.");
        }
    };

    const handleDelete = async (docId: string) => {
        if (!id) return;
        if (window.confirm("Delete this POD document?")) {
            try {
                await tripApi.deletePOD(id, docId);
                fetchPods();
            } catch (e) {
                console.error(e);
                alert("Failed to delete POD");
            }
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h6">Proof of Delivery (POD) Documents</Typography>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<UploadIcon />}
                >
                    Upload POD
                    <input
                        type="file"
                        hidden
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                    />
                </Button>
            </Stack>

            <Card variant="outlined" sx={{ flexGrow: 1 }}>
                <CardContent>
                    {pods.length === 0 ? (
                        <Box textAlign="center" py={5} color="text.secondary">
                            <Typography>No POD documents uploaded for this trip yet.</Typography>
                        </Box>
                    ) : (
                        <List>
                            {pods.map((pod) => (
                                <ListItem
                                    key={pod.id}
                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(pod.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon>
                                        <FileIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={pod.fileName}
                                        secondary={`Uploaded: ${new Date(pod.uploadedAt).toLocaleString()} • Size: ${pod.size || 'Unknown'}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
