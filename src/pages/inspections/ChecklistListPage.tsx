import { useEffect, useState } from 'react';
import { Button, Chip, IconButton, Paper, Stack, Typography, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { inspectionApi } from '../../features/inspections/api/inspectionApi';

export function ChecklistListPage() {
    const navigate = useNavigate();
    const [checklists, setChecklists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChecklists = async () => {
        try {
            setLoading(true);
            const data = await inspectionApi.getChecklists();
            setChecklists(data);
        } catch (error) {
            console.error('Failed to fetch checklists:', error);
            // Fallback data
            setChecklists([
                { id: 'c1', name: 'Daily Pre-Trip Inspection', vehicleCategoryId: 'cat-1', isActive: true, createdAt: new Date().toISOString() },
                { id: 'c2', name: 'Weekly Maintenance Check', vehicleCategoryId: 'cat-2', isActive: true, createdAt: new Date().toISOString() },
                { id: 'c3', name: 'Annual Safety Certification', vehicleCategoryId: 'cat-1', isActive: false, createdAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, []);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Checklist Name', flex: 1, minWidth: 200 },
        { field: 'vehicleCategoryId', headerName: 'Category', width: 150 },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.row.isActive ? "Active" : "Inactive"}
                    color={params.row.isActive ? "success" : "default"}
                    size="small"
                />
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created Date',
            width: 150,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="View List">
                        <IconButton size="small" color="info" onClick={() => navigate(`/inspections/checklists/${params.row.id}`)}>
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/inspections/checklists/${params.row.id}/update`)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={800}>
                    Inspection Checklists
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchChecklists}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/inspections/checklists/create')}
                    >
                        Create Checklist
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={checklists}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
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
