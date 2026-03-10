import { httpClient } from '../../../api/httpClient';

export const workOrderApi = {
    getWorkOrders: async () => {
        const response = await httpClient.get('/api/work-orders');
        return response.data;
    },

    createWorkOrder: async (data: any) => {
        const response = await httpClient.post('/api/work-orders', data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await httpClient.put(`/api/work-orders/${id}/status`, { status });
        return response.data;
    },

    exportWorkOrders: async () => {
        const response = await httpClient.get('/api/work-orders/export', { responseType: 'blob' });
        return response.data;
    }
};
