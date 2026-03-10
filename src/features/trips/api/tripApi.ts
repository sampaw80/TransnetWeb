import { httpClient } from '../../../api/httpClient';

export const tripApi = {
    // Basic Trip CRUD
    getTrips: async (params?: any) => {
        const response = await httpClient.get('/trips', { params });
        return response.data;
    },
    getTrip: async (id: string) => {
        const response = await httpClient.get(`/trips/${id}`);
        return response.data;
    },
    createTrip: async (data: any) => {
        const response = await httpClient.post('/trips', data);
        return response.data;
    },
    updateTrip: async (id: string, data: any) => {
        const response = await httpClient.put(`/trips/${id}`, data);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await httpClient.put(`/trips/${id}/status`, { status });
        return response.data;
    },
    confirmTrip: async (id: string) => {
        const response = await httpClient.put(`/trips/${id}/confirm`);
        return response.data;
    },
    approveTrip: async (id: string) => {
        const response = await httpClient.put(`/trips/${id}/approve`);
        return response.data;
    },

    // Trip Stops
    getStops: async (tripId: string) => {
        const response = await httpClient.get(`/trips/${tripId}/stops`);
        return response.data;
    },
    addStop: async (tripId: string, data: any) => {
        const response = await httpClient.post(`/trips/${tripId}/stops`, data);
        return response.data;
    },
    editStop: async (tripId: string, stopId: string, data: any) => {
        const response = await httpClient.put(`/trips/${tripId}/stops/${stopId}`, data);
        return response.data;
    },
    deleteStop: async (tripId: string, stopId: string) => {
        const response = await httpClient.delete(`/trips/${tripId}/stops/${stopId}`);
        return response.data;
    },

    // Trip Halts
    getHalts: async (tripId: string) => {
        const response = await httpClient.get(`/trips/${tripId}/halts`);
        return response.data;
    },
    createHalt: async (tripId: string, data: any) => {
        const response = await httpClient.post(`/trips/${tripId}/halts`, data);
        return response.data;
    },
    endHalt: async (tripId: string, haltId: string) => {
        const response = await httpClient.put(`/trips/${tripId}/halts/${haltId}/end`);
        return response.data;
    },

    // Trip Vouchers
    getVoucher: async (tripId: string) => {
        const response = await httpClient.get(`/trips/${tripId}/voucher`);
        return response.data;
    },
    createVoucher: async (tripId: string, data: any) => {
        const response = await httpClient.post(`/trips/${tripId}/voucher`, data);
        return response.data;
    },
    updateVoucher: async (tripId: string, data: any) => {
        const response = await httpClient.put(`/trips/${tripId}/voucher`, data);
        return response.data;
    },

    // POD Uploads
    getPODs: async (tripId: string) => {
        const response = await httpClient.get(`/trips/${tripId}/pod-uploads`);
        return response.data;
    },
    uploadPOD: async (tripId: string, formData: FormData) => {
        const response = await httpClient.post(`/trips/${tripId}/pod-uploads`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deletePOD: async (tripId: string, docId: string) => {
        const response = await httpClient.delete(`/trips/${tripId}/pod-uploads/${docId}`);
        return response.data;
    },

    // Import Trips
    importTrips: async (formData: FormData) => {
        const response = await httpClient.post('/trips/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
