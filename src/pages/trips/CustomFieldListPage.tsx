import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { customFieldApi } from '../../features/trips/api/customFieldApi';

export function CustomFieldListPage() {
    const navigate = useNavigate();
    const [fields, setFields] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFields = async () => {
        try {
            setLoading(true);
            const data = await customFieldApi.getCustomFields();
            setFields(data);
        } catch (error) {
            console.error('Failed to load Custom Fields:', error);
            // Demo Data
            setFields([
                { id: 'CF-1', fieldName: 'Hazardous Materials', dataType: 'Boolean', isRequired: true, displayOrder: 1 },
                { id: 'CF-2', fieldName: 'Temperature Control Setpoint', dataType: 'Number', isRequired: false, displayOrder: 2 },
                { id: 'CF-3', fieldName: 'Special Instructions', dataType: 'Text', isRequired: false, displayOrder: 3 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFields();
    }, []);

    const columns: GridColDef[] = [
        { field: 'fieldName', headerName: 'Field Name', flex: 1, minWidth: 200 },
        {
            field: 'dataType',
            headerName: 'Data Type',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip label={params.row.dataType} size="small" variant="outlined" />
            )
        },
        {
            field: 'isRequired',
            headerName: 'Required',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                params.row.isRequired
                    ? <Typography variant="body2" color="error.main" fontWeight={600}>Yes</Typography>
                    : <Typography variant="body2" color="text.secondary">No</Typography>
            )
        },
        { field: 'displayOrder', headerName: 'Display Order', width: 130, type: 'number' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton size="small" onClick={() => navigate(`/trips/custom-fields/${params.row.id}/edit`)} color="primary">
                    <EditIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Custom Field Definitions
                    </Typography>
                    <Typography color="text.secondary">
                        Define attributes that can be tracked generically across diverse Trips.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchFields}
                        disabled={loading}
                    >
                        Refresh List
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/trips/custom-fields/create')}
                    >
                        New Definition
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={fields}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 15 } },
                    }}
                    pageSizeOptions={[15, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: (t) => t.palette.background.default,
                            borderBottom: (t) => `1px solid ${t.palette.divider}`,
                        },
                    }}
                />
            </Paper>
        </Stack>
    );
}
