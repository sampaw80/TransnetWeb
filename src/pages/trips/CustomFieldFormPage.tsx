import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    Typography,
    CircularProgress,
    MenuItem,
    FormControlLabel,
    Switch
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { customFieldApi } from '../../features/trips/api/customFieldApi';

export function CustomFieldFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fieldName: '',
        dataType: 'Text',
        isRequired: false,
        displayOrder: 1,
        options: '' // JSON-stringified comma array for multiple choice configs
    });

    useEffect(() => {
        if (isEdit && id) {
            customFieldApi.getCustomFields()
                .then(dataList => {
                    const match = dataList.find((f: any) => f.id === id);
                    if (match) {
                        setFormData({
                            fieldName: match.fieldName || '',
                            dataType: match.dataType || 'Text',
                            isRequired: match.isRequired || false,
                            displayOrder: match.displayOrder || 1,
                            options: match.options || ''
                        });
                    }
                })
                .catch(err => console.error('Failed to fetch definitions:', err))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleToggle = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit && id) {
                await customFieldApi.updateCustomField(id, formData);
            } else {
                await customFieldApi.createCustomField(formData);
            }
            navigate('/trips/custom-fields');
        } catch (error) {
            console.error('Failed to save field', error);
            alert('Failed to save configuration. Check console for details.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/trips/custom-fields')}
                    color="inherit"
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight={800}>
                    {isEdit ? `Edit Schema Definition` : 'Create Custom Field Schema'}
                </Typography>
            </Stack>

            <Card variant="outlined">
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Field Name"
                                    required
                                    placeholder="e.g. Temperature Setpoint"
                                    value={formData.fieldName}
                                    onChange={handleChange('fieldName')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Data Type Validation"
                                    value={formData.dataType}
                                    onChange={handleChange('dataType')}
                                >
                                    <MenuItem value="Text">Text (String)</MenuItem>
                                    <MenuItem value="Number">Number (Decimal)</MenuItem>
                                    <MenuItem value="Boolean">Boolean (Yes/No Toggle)</MenuItem>
                                    <MenuItem value="Date">Date/Time</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={formData.isRequired} onChange={handleToggle('isRequired')} color="primary" />
                                    }
                                    label="Mandatory Field (Required on all generated Trips)"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Display Layout Order"
                                    value={formData.displayOrder}
                                    onChange={handleChange('displayOrder')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/trips/custom-fields')}
                                        sx={{ mr: 2 }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        disabled={saving}
                                    >
                                        {isEdit ? 'Save Changes' : 'Create Schema'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Stack>
    );
}
