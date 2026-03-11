import type { ReactElement } from 'react'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined'

export type NavSubItem = {
  label: string
  to: string
  icon: ReactElement
  children?: NavItem[]
}

export type NavItem = {
  label: string
  to?: string
  icon: ReactElement
  children?: NavSubItem[]
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlinedIcon /> },
  {
    label: 'Vehicle Management',
    to: '/vehicles-management',
    icon: <DirectionsCarOutlinedIcon />,
    children: [
      { label: 'Vehicles', to: '/vehicles', icon: <DirectionsCarOutlinedIcon /> },
      { label: 'Trailers', to: '/trailers', icon: <LocalShippingOutlinedIcon /> },
      { label: 'Categories', to: '/vehicle-categories', icon: <CategoryOutlinedIcon /> },
      { label: 'Inspections', to: '/inspections', icon: <FactCheckOutlinedIcon /> },
      { label: 'Work Orders', to: '/work-orders', icon: <BuildCircleOutlinedIcon /> },
      { label: 'Assets', to: '/assets', icon: <InventoryOutlinedIcon /> },
      { label: 'Reports', to: '/vehicles/reports', icon: <AnalyticsOutlinedIcon /> },
    ]
  },
  {
    label: 'Trip Management',
    to: '/trips-management',
    icon: <AssignmentTurnedInOutlinedIcon />,
    children: [
      { label: 'Trips', to: '/trips', icon: <RouteOutlinedIcon /> },
      { label: 'Stops', to: '/trips/stops', icon: <LocationOnOutlinedIcon /> },
      { label: 'Halts', to: '/trips/halts', icon: <PauseCircleOutlinedIcon /> },
      { label: 'Trip Voucher', to: '/trips/vouchers', icon: <ReceiptLongOutlinedIcon /> },
      { label: 'POD Uploads', to: '/trips/pods', icon: <CloudUploadOutlinedIcon /> },
      { label: 'Import Trips', to: '/trips/import', icon: <FileUploadOutlinedIcon /> },
      { label: 'Import Batches', to: '/trips/import-batches', icon: <LibraryBooksOutlinedIcon /> },
      { label: 'Custom Fields', to: '/trips/custom-fields', icon: <SettingsSuggestOutlinedIcon /> },
    ]
  },
  {
    label: 'Driver Management',
    to: '/driver-management',
    icon: <BadgeOutlinedIcon />,
    children: [
      { label: 'Drivers', to: '/drivers', icon: <GroupOutlinedIcon /> },
      { label: 'Attendance', to: '/drivers/attendance', icon: <EventNoteOutlinedIcon /> },
      { label: 'Expenses', to: '/drivers/expenses', icon: <ReceiptLongOutlinedIcon /> },
      { label: 'Assignments', to: '/drivers/assignments', icon: <RouteOutlinedIcon /> },
      { label: 'GPS Tracking', to: '/drivers/gps-tracking', icon: <GpsFixedIcon /> },
      { label: 'Documents', to: '/drivers/documents', icon: <FolderOutlinedIcon /> },
      { label: 'Notifications', to: '/drivers/notifications', icon: <NotificationsOutlinedIcon /> },
    ],
  },
  { label: 'Reports', to: '/reports', icon: <AnalyticsOutlinedIcon /> },
  { label: 'Todos', to: '/todos', icon: <AssignmentTurnedInOutlinedIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
]

