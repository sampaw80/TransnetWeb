import { httpClient } from '../../../api/httpClient';

export interface Trailer {
    id: string;
    registrationNumber: string;
    plateNumber?: string;
    make?: string;
    model?: string;
    year?: number;
    type?: string;
    capacity?: number;
    status: number;
    isActive?: boolean;
    currentVehicleId?: string;
    currentVehicleReg?: string;
    lastMaintenanceDate?: string;
}

export const trailerApi = {
    getTrailers: async () => {
        const response = await httpClient.get<Trailer[]>('/api/trailers');
        return response.data;
    },

    getTrailerById: async (id: string) => {
        const response = await httpClient.get<Trailer>(`/api/trailers/${id}`);
        return response.data;
    },

    registerTrailer: async (data: Partial<Trailer>) => {
        const response = await httpClient.post<Trailer>('/api/trailers', data);
        return response.data;
    },

    attachToVehicle: async (trailerId: string, vehicleId: string) => {
        const response = await httpClient.put(`/api/trailers/${trailerId}/attach/${vehicleId}`);
        return response.data;
    },

    getTrailerPerformance: async (id: string) => {
        const response = await httpClient.get(`/api/trailers/${id}/performance`);
        return response.data;
    }
};
