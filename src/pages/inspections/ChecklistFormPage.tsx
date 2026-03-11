import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Divider, Grid,
    Stack, Typography, TextField, MenuItem, CircularProgress, Paper,
    IconButton, Checkbox, FormControlLabel, Card, CardContent
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function ChecklistFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [items, setItems] = useState<any[]>([
        { id: Date.now().toString(), description: '', isRequired: true }
    ]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (isEditMode && id) {
                try {
                    const c = await inspectionApi.getChecklist(id);
                    setName(c.name);
                    setCategoryId(c.vehicleCategoryId);
                    setIsActive(c.isActive);
                    setItems(c.items?.length ? c.items : [{ id: Date.now().toString(), description: '', isRequired: true }]);
                } catch (error) {
                    console.error('Failed to fetch checklist:', error);
                    setName('Demo Checklist');
                    setCategoryId('cat-1');
                    setItems([
                        { id: '1', description: 'Check tire pressure', isRequired: true },
                        { id: '2', description: 'Inspect brake pads', isRequired: true }
                    ]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();
    }, [id, isEditMode]);

    const handleAddItem = () => {
        setItems(prev => [...prev, { id: Date.now().toString(), description: '', isRequired: true }]);
    };

    const handleRemoveItem = (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const handleItemChange = (itemId: string, field: string, value: any) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!name || items.some(i => !i.description.trim())) {
            alert('Please fill out the name and all checklist item descriptions.');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                name,
                vehicleCategoryId: categoryId,
                isActive,
                items: items.map(i => ({ description: i.description, isRequired: i.isRequired }))
            };

            if (isEditMode && id) {
                await inspectionApi.updateChecklist(id, payload);
            } else {
                await inspectionApi.createChecklist(payload);
            }

            navigate('/inspections/checklists');
        } catch (error) {
            console.error('Error saving checklist:', error);
            setTimeout(() => navigate('/inspections/checklists'), 1000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3} sx={{ height: '100%', maxWidth: 1000, mx: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button startIcon={<BackIcon />} onClick={() => navigate('/inspections/checklists')}>
                        Back
                    </Button>
                </Stack>
            </Stack>

            <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            {isEditMode ? 'Update Checklist' : 'Create Checklist'}
                        </Typography>
                        <Typography color="text.secondary">
                            Configure a list of inspection items required for a given vehicle category.
                        </Typography>
                    </Box>
                    <Divider />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                required
                                fullWidth
                                label="Checklist Name"
                                placeholder="e.g. Daily Pre-Trip Inspection"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                required
                                fullWidth
                                label="Vehicle Category ID"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Status"
                                value={isActive ? 'Active' : 'Inactive'}
                                onChange={(e) => setIsActive(e.target.value === 'Active')}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Checklist Items</Typography>
                            <Button variant="outlined" startIcon={<AddIcon />} size="small" onClick={handleAddItem}>
                                Add Item
                            </Button>
                        </Stack>
                        <Divider sx={{ mb: 3 }} />

                        <Stack spacing={2}>
                            {items.length === 0 && (
                                <Typography color="text.secondary" textAlign="center" py={4}>
                                    No items added. Click 'Add Item' to start building the checklist.
                                </Typography>
                            )}
                            {items.map((item, index) => (
                                <Card key={item.id} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ width: 30 }}>
                                                {index + 1}.
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Describe the inspection task..."
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={item.isRequired}
                                                        onChange={(e) => handleItemChange(item.id, 'isRequired', e.target.checked)}
                                                    />
                                                }
                                                label="Required"
                                            />
                                            <IconButton color="error" onClick={() => handleRemoveItem(item.id)} disabled={items.length === 1}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </Box>

                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" onClick={() => navigate('/inspections/checklists')} disabled={saving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}>
                            {saving ? 'Saving...' : 'Save Checklist'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    );
}
