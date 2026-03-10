import { httpClient } from '../../../api/httpClient';

export interface Vehicle {
    id: string;
    registrationNumber: string;
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    vehicleCategoryId: string;
    vehicleType: number;
    status: number;
    currentDriverId?: string;
    currentLocationId?: string;
    odometerReading: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const vehicleApi = {
    getVehicles: async () => {
        const response = await httpClient.get<Vehicle[]>('/vehicles');
        return response.data;
    },

    getVehicleById: async (id: string) => {
        const response = await httpClient.get<Vehicle>(`/vehicles/${id}`);
        return response.data;
    },

    registerVehicle: async (data: Partial<Vehicle>) => {
        const response = await httpClient.post<Vehicle>('/vehicles', data);
        return response.data;
    },

    updateVehicle: async (id: string, data: Partial<Vehicle>) => {
        const response = await httpClient.put<Vehicle>(`/vehicles/${id}`, data);
        return response.data;
    },

    getVehicleInspections: async (id: string) => {
        const response = await httpClient.get(`/vehicles/${id}/inspections`);
        return response.data;
    },

    getVehicleWorkOrders: async (id: string) => {
        const response = await httpClient.get(`/vehicles/${id}/workorders`);
        return response.data;
    }
};
