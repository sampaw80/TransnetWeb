import { httpClient } from '../../../api/httpClient';

export const importBatchApi = {
    getBatches: async () => {
        const response = await httpClient.get('/api/import-batches');
        return response.data;
    },
    getBatchDetails: async (id: string) => {
        const response = await httpClient.get(`/api/import-batches/${id}`);
        return response.data;
    }
};
