import { httpClient } from '../../../api/httpClient';

export const inspectionApi = {
    // Checklists
    getChecklists: async () => {
        const response = await httpClient.get('/api/inspection-checklists');
        return response.data;
    },

    getChecklist: async (id: string) => {
        const response = await httpClient.get(`/api/inspection-checklists/${id}`);
        return response.data;
    },

    createChecklist: async (data: any) => {
        const response = await httpClient.post('/api/inspection-checklists', data);
        return response.data;
    },

    updateChecklist: async (id: string, data: any) => {
        const response = await httpClient.put(`/api/inspection-checklists/${id}`, data);
        return response.data;
    },

    // Inspections
    submitInspection: async (data: any) => {
        const response = await httpClient.post('/api/inspections', data);
        return response.data;
    },

    getInspectionById: async (id: string) => {
        const response = await httpClient.get(`/api/inspections/${id}`);
        return response.data;
    },

    uploadPhotos: async (id: string, formData: FormData) => {
        const response = await httpClient.post(`/api/inspections/${id}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    signInspection: async (id: string, data: any) => {
        const response = await httpClient.put(`/api/inspections/${id}/sign`, data);
        return response.data;
    }
};
