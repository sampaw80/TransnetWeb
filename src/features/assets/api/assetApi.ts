import { httpClient } from '../../../api/httpClient';

export const assetApi = {
    getIdleAssets: async () => {
        const response = await httpClient.get('/api/asset-locations/idle');
        return response.data;
    },

    recordLocation: async (data: any) => {
        const response = await httpClient.post('/api/asset-locations', data);
        return response.data;
    },

    getAssetLocations: async () => {
        const response = await httpClient.get('/api/asset-locations'); // or equivalent route representing grouped maps
        return response.data;
    }
};
