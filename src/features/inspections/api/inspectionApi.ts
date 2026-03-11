import { httpClient } from '../../../api/httpClient';

export const inspectionApi = {
    // Checklists
    getChecklists: async () => {
        const response = await httpClient.get('/inspection-checklists');
        return response.data;
    },

    getChecklist: async (id: string) => {
        const response = await httpClient.get(`/inspection-checklists/${id}`);
        return response.data;
    },

    createChecklist: async (data: any) => {
        const response = await httpClient.post('/inspection-checklists', data);
        return response.data;
    },

    updateChecklist: async (id: string, data: any) => {
        const response = await httpClient.put(`/inspection-checklists/${id}`, data);
        return response.data;
    },

    // Inspections
    submitInspection: async (data: any) => {
        const response = await httpClient.post('/inspections', data);
        return response.data;
    },

    getInspectionById: async (id: string) => {
        const response = await httpClient.get(`/inspections/${id}`);
        return response.data;
    },

    uploadPhotos: async (id: string, formData: FormData) => {
        const response = await httpClient.post(`/inspections/${id}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    signInspection: async (id: string, data: any) => {
        const response = await httpClient.put(`/inspections/${id}/sign`, data);
        return response.data;
    }
};
