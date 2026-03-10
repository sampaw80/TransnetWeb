import { httpClient } from '../../../api/httpClient';

export const customFieldApi = {
    getCustomFields: async () => {
        const response = await httpClient.get('/api/custom-field-definitions');
        return response.data;
    },
    createCustomField: async (data: any) => {
        const response = await httpClient.post('/api/custom-field-definitions', data);
        return response.data;
    },
    updateCustomField: async (id: string, data: any) => {
        const response = await httpClient.put(`/api/custom-field-definitions/${id}`, data);
        return response.data;
    }
};
