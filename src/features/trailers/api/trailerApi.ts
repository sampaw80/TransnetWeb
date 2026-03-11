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
        const response = await httpClient.get<Trailer[]>('/trailers');
        return response.data;
    },

    getTrailerById: async (id: string) => {
        const response = await httpClient.get<Trailer>(`/trailers/${id}`);
        return response.data;
    },

    registerTrailer: async (data: Partial<Trailer>) => {
        const response = await httpClient.post<Trailer>('/trailers', data);
        return response.data;
    },

    attachToVehicle: async (trailerId: string, vehicleId: string) => {
        const response = await httpClient.put(`/trailers/${trailerId}/attach/${vehicleId}`);
        return response.data;
    },

    getTrailerPerformance: async (id: string) => {
        const response = await httpClient.get(`/trailers/${id}/performance`);
        return response.data;
    }
};
