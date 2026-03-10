import { httpClient } from '../../../api/httpClient';

export const reportApi = {
    getCategoryPerformance: async () => {
        const response = await httpClient.get('/api/reports/vehicle-category-performance');
        return response.data;
    }
};
