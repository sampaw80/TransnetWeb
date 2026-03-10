import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TodosPage } from '../pages/TodosPage'
import { VehicleCategoriesPage } from '../pages/VehicleCategoriesPage'
import { LoginPage } from '../pages/LoginPage'
import { RequireAuth } from '../features/auth/RequireAuth'

import {
  VehicleListPage,
  VehicleDetailsPage,
  RegisterVehiclePage,
  UpdateVehiclePage,
  VehicleInspectionsPage,
  VehicleWorkOrdersPage,
  TrailerListPage,
  TrailerDetailsPage,
  RegisterTrailerPage,
  AttachTrailerPage,
  TrailerPerformancePage,
  CategoryListPage,
  CreateCategoryPage,
  ChecklistListPage,
  ChecklistFormPage,
  SubmitInspectionPage,
  InspectionDetailsPage,
  UploadPhotosPage,
  SignInspectionPage,
  WorkOrderListPage,
  CreateWorkOrderPage,
  UpdateWorkOrderStatusPage,
  ExportWorkOrdersPage,
  IdleAssetsPage,
  AssetLocationsPage,
  CategoryPerformanceReportPage
} from '../pages/vehiclesHub'

import {
  TripListPage,
  TripFormPage,
  TripDetailsPage,
  TripStopsSection,
  TripHaltsSection,
  TripVoucherSection,
  PODUploadSection,
  ImportTripsPage,
  ImportBatchListPage,
  ImportBatchDetailsPage,
  CustomFieldListPage,
  CustomFieldFormPage
} from '../pages/tripsHub'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'todos', element: <TodosPage /> },
      { path: 'vehicle-categories', element: <VehicleCategoriesPage /> },
      { path: 'settings', element: <SettingsPage /> },

      // Vehicle Management Redirect
      { path: 'vehicles-management', element: <Navigate to="/vehicles" replace /> },

      // Vehicles
      { path: 'vehicles', element: <VehicleListPage /> },
      { path: 'vehicles/register', element: <RegisterVehiclePage /> },
      { path: 'vehicles/:id', element: <VehicleDetailsPage /> },
      { path: 'vehicles/:id/update', element: <UpdateVehiclePage /> },
      { path: 'vehicles/:id/inspections', element: <VehicleInspectionsPage /> },
      { path: 'vehicles/:id/work-orders', element: <VehicleWorkOrdersPage /> },

      // Trailers
      { path: 'trailers', element: <TrailerListPage /> },
      { path: 'trailers/register', element: <RegisterTrailerPage /> },
      { path: 'trailers/:id', element: <TrailerDetailsPage /> },
      { path: 'trailers/:id/attach', element: <AttachTrailerPage /> },
      { path: 'trailers/:id/performance', element: <TrailerPerformancePage /> },

      // Categories
      { path: 'vehicle-categories', element: <CategoryListPage /> },
      { path: 'vehicle-categories/create', element: <CreateCategoryPage /> },

      // Inspections
      { path: 'inspections', element: <SubmitInspectionPage /> },
      { path: 'inspections/checklists', element: <ChecklistListPage /> },
      { path: 'inspections/checklists/create', element: <ChecklistFormPage /> },
      { path: 'inspections/checklists/:id/update', element: <ChecklistFormPage /> },
      { path: 'inspections/:id', element: <InspectionDetailsPage /> },
      { path: 'inspections/:id/photos', element: <UploadPhotosPage /> },
      { path: 'inspections/:id/sign', element: <SignInspectionPage /> },

      // Work Orders
      { path: 'work-orders', element: <WorkOrderListPage /> },
      { path: 'work-orders/create', element: <CreateWorkOrderPage /> },
      { path: 'work-orders/:id/status', element: <UpdateWorkOrderStatusPage /> },
      { path: 'work-orders/export', element: <ExportWorkOrdersPage /> },

      // Assets
      { path: 'assets', element: <Navigate to="/assets/idle" replace /> },
      { path: 'assets/idle', element: <IdleAssetsPage /> },
      { path: 'assets/locations', element: <AssetLocationsPage /> },

      // Vehicle Reports
      { path: 'vehicles/reports', element: <CategoryPerformanceReportPage /> },

      // Trip Management Redirect
      { path: 'trips-management', element: <Navigate to="/trips" replace /> },

      // Trips
      { path: 'trips', element: <TripListPage /> },
      { path: 'trips/create', element: <TripFormPage /> },
      { path: 'trips/:id', element: <TripDetailsPage /> },
      { path: 'trips/:id/edit', element: <TripFormPage /> },
      { path: 'trips/stops', element: <TripStopsSection /> },
      { path: 'trips/halts', element: <TripHaltsSection /> },
      { path: 'trips/vouchers', element: <TripVoucherSection /> },
      { path: 'trips/pods', element: <PODUploadSection /> },
      { path: 'trips/import', element: <ImportTripsPage /> },
      { path: 'trips/import-batches', element: <ImportBatchListPage /> },
      { path: 'trips/import-batches/:id', element: <ImportBatchDetailsPage /> },
      { path: 'trips/custom-fields', element: <CustomFieldListPage /> },
      { path: 'trips/custom-fields/create', element: <CustomFieldFormPage /> },
      { path: 'trips/custom-fields/:id/edit', element: <CustomFieldFormPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

