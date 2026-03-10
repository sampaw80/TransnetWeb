import { BasePagePlaceholder } from './BasePagePlaceholder';
import { VehicleListPage as RealVehicleListPage } from './vehicles/VehicleListPage';
import { VehicleDetailsPage as RealVehicleDetailsPage } from './vehicles/VehicleDetailsPage';
import { VehicleFormPage } from './vehicles/VehicleFormPage';
import { TrailerListPage as RealTrailerListPage } from './trailers/TrailerListPage';
import { TrailerDetailsPage as RealTrailerDetailsPage } from './trailers/TrailerDetailsPage';
import { TrailerFormPage } from './trailers/TrailerFormPage';
import { AttachTrailerPage as RealAttachTrailerPage } from './trailers/AttachTrailerPage';
import { TrailerPerformancePage as RealTrailerPerformancePage } from './trailers/TrailerPerformancePage';
import { ChecklistListPage as RealChecklistListPage } from './inspections/ChecklistListPage';
import { ChecklistFormPage as RealChecklistFormPage } from './inspections/ChecklistFormPage';
import { SubmitInspectionPage as RealSubmitInspectionPage } from './inspections/SubmitInspectionPage';
import { InspectionDetailsPage as RealInspectionDetailsPage } from './inspections/InspectionDetailsPage';
import { UploadPhotosPage as RealUploadPhotosPage } from './inspections/UploadPhotosPage';
import { SignInspectionPage as RealSignInspectionPage } from './inspections/SignInspectionPage';
import { WorkOrderListPage as RealWorkOrderListPage } from './workOrders/WorkOrderListPage';
import { CreateWorkOrderPage as RealCreateWorkOrderPage } from './workOrders/CreateWorkOrderPage';
import { UpdateWorkOrderStatusPage as RealUpdateWorkOrderStatusPage } from './workOrders/UpdateWorkOrderStatusPage';
import { ExportWorkOrdersPage as RealExportWorkOrdersPage } from './workOrders/ExportWorkOrdersPage';
import { IdleAssetsPage as RealIdleAssetsPage } from './assets/IdleAssetsPage';
import { AssetLocationsPage as RealAssetLocationsPage } from './assets/AssetLocationsPage';
import { CategoryPerformanceReportPage as RealCategoryPerformanceReportPage } from './reports/CategoryPerformanceReportPage';

// Vehicles
export const VehicleListPage = RealVehicleListPage;
export const VehicleDetailsPage = RealVehicleDetailsPage;
export const RegisterVehiclePage = VehicleFormPage;
export const UpdateVehiclePage = VehicleFormPage;
export const VehicleInspectionsPage = () => <BasePagePlaceholder title="Inspection History" description="View inspections per vehicle." />;
export const VehicleWorkOrdersPage = () => <BasePagePlaceholder title="Vehicle Work Orders" description="View work orders per vehicle." />;

// Trailers
export const TrailerListPage = RealTrailerListPage;
export const TrailerDetailsPage = RealTrailerDetailsPage;
export const RegisterTrailerPage = TrailerFormPage;
export const UpdateTrailerPage = TrailerFormPage;
export const AttachTrailerPage = RealAttachTrailerPage;
export const TrailerPerformancePage = RealTrailerPerformancePage;

// Categories
export const CategoryListPage = () => <BasePagePlaceholder title="Vehicle Categories" description="View all vehicle categories." />;
export const CreateCategoryPage = () => <BasePagePlaceholder title="Create Category" description="Form to create vehicle category." />;
export const EditCategoryPage = () => <BasePagePlaceholder title="Edit Category" description="Form to update vehicle category." />;

// Inspections
export const ChecklistListPage = RealChecklistListPage;
export const ChecklistFormPage = RealChecklistFormPage;
export const SubmitInspectionPage = RealSubmitInspectionPage;
export const InspectionDetailsPage = RealInspectionDetailsPage;
export const UploadPhotosPage = RealUploadPhotosPage;
export const SignInspectionPage = RealSignInspectionPage;

// Work Orders
export const WorkOrderListPage = RealWorkOrderListPage;
export const CreateWorkOrderPage = RealCreateWorkOrderPage;
export const UpdateWorkOrderStatusPage = RealUpdateWorkOrderStatusPage;
export const ExportWorkOrdersPage = RealExportWorkOrdersPage;

// Assets
export const IdleAssetsPage = RealIdleAssetsPage;
export const AssetLocationsPage = RealAssetLocationsPage;

// Reports
export const CategoryPerformanceReportPage = RealCategoryPerformanceReportPage;
