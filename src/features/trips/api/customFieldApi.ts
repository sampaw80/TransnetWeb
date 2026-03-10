import { httpClient } from '../../../api/httpClient';

export const customFieldApi = {
    getCustomFields: async () => {
        const response = await httpClient.get('/custom-field-definitions');
        return response.data;
    },
    createCustomField: async (data: any) => {
        const response = await httpClient.post('/custom-field-definitions', data);
        return response.data;
    },
    updateCustomField: async (id: string, data: any) => {
        const response = await httpClient.put(`/custom-field-definitions/${id}`, data);
        return response.data;
    }
};
