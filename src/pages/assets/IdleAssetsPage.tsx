import { useEffect, useState } from 'react';
import { Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { assetApi } from '../../features/assets/api/assetApi';

export function IdleAssetsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const data = await assetApi.getIdleAssets();
            setAssets(data);
        } catch (error) {
            console.error('Failed to fetch idle assets:', error);
            // Fallback Data
            setAssets([
                { id: '1', name: 'Portable Generator A', type: 'Equipment', status: 1, location: 'Main Depot', lastUsed: '2023-10-15T00:00:00Z', daysIdle: 35 },
                { id: '2', name: 'Spare Tire Set (Winter)', type: 'Parts', status: 1, location: 'Warehouse 3', lastUsed: '2023-04-10T00:00:00Z', daysIdle: 210 },
                { id: '3', name: 'Flatbed Trailer T-43', type: 'Trailer', status: 3, location: 'Repair Shop', lastUsed: '2023-11-01T00:00:00Z', daysIdle: 18 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Asset Name', flex: 1, minWidth: 200 },
        { field: 'type', headerName: 'Type', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params: GridRenderCellParams) => {
                switch (params.row.status) {
                    case 1: return <Chip label="Available" color="success" size="small" />;
                    case 2: return <Chip label="In Use" color="info" size="small" />;
                    case 3: return <Chip label="Maintenance" color="warning" size="small" />;
                    default: return <Chip label="Unknown" color="default" size="small" />;
                }
            }
        },
        { field: 'location', headerName: 'Current Location', width: 200 },
        {
            field: 'daysIdle',
            headerName: 'Days Idle',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="body2"
                    color={params.row.daysIdle > 30 ? 'error' : 'text.primary'}
                    fontWeight={params.row.daysIdle > 30 ? 'bold' : 'normal'}
                >
                    {params.row.daysIdle} days
                </Typography>
            )
        },
        {
            field: 'lastUsed',
            headerName: 'Last Used',
            width: 150,
            valueFormatter: (value: any) => value ? new Date(value).toLocaleDateString() : 'N/A'
        }
    ];

    return (
        <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={800}>
                    Idle Assets
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchAssets}
                        disabled={loading}
                    >
                        Refresh List
                    </Button>
                </Stack>
            </Stack>

            <Typography color="text.secondary">
                Review assets that have been idle or unassigned across the fleet.
            </Typography>

            <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={assets}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
                        },
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
