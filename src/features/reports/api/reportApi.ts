import { httpClient } from '../../../api/httpClient';

export const reportApi = {
    getCategoryPerformance: async () => {
        const response = await httpClient.get('/reports/vehicle-category-performance');
        return response.data;
    }
};
