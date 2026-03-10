import { TripListPage as RealTripListPage } from './trips/TripListPage';
import { TripFormPage as RealTripFormPage } from './trips/TripFormPage';
import { TripDetailsPage as RealTripDetailsPage } from './trips/TripDetailsPage';

// Trips
export const TripListPage = RealTripListPage;
export const TripFormPage = RealTripFormPage;
export const TripDetailsPage = RealTripDetailsPage;

import { TripStopsSection as RealTripStopsSection } from './trips/TripStopsSection';
import { TripHaltsSection as RealTripHaltsSection } from './trips/TripHaltsSection';

import { TripVoucherSection as RealTripVoucherSection } from './trips/TripVoucherSection';
import { PODUploadSection as RealPODUploadSection } from './trips/PODUploadSection';

// Sub-modules (Usually handled in TripDetails context, but exposed for direct routing testing)
export const TripStopsSection = RealTripStopsSection;
export const TripHaltsSection = RealTripHaltsSection;
export const TripVoucherSection = RealTripVoucherSection;
export const PODUploadSection = RealPODUploadSection;

import { ImportTripsPage as RealImportTripsPage } from './trips/ImportTripsPage';

import { ImportBatchListPage as RealImportBatchListPage } from './trips/ImportBatchListPage';
import { ImportBatchDetailsPage as RealImportBatchDetailsPage } from './trips/ImportBatchDetailsPage';

// Imports and Batches
export const ImportTripsPage = RealImportTripsPage;
export const ImportBatchListPage = RealImportBatchListPage;
export const ImportBatchDetailsPage = RealImportBatchDetailsPage;

import { CustomFieldListPage as RealCustomFieldListPage } from './trips/CustomFieldListPage';
import { CustomFieldFormPage as RealCustomFieldFormPage } from './trips/CustomFieldFormPage';

// Custom Fields
export const CustomFieldListPage = RealCustomFieldListPage;
export const CustomFieldFormPage = RealCustomFieldFormPage;
