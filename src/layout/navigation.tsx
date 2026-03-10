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

export type NavItem = {
  label: string
  to: string
  icon: ReactElement
  children?: NavItem[]
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
      { label: 'Trips', to: '/trips', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Stops', to: '/trips/stops', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Halts', to: '/trips/halts', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Trip Voucher', to: '/trips/vouchers', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'POD Uploads', to: '/trips/pods', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Import Trips', to: '/trips/import', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Import Batches', to: '/trips/import-batches', icon: <AssignmentTurnedInOutlinedIcon /> },
      { label: 'Custom Fields', to: '/trips/custom-fields', icon: <AssignmentTurnedInOutlinedIcon /> },
    ]
  },
  { label: 'Reports', to: '/reports', icon: <AnalyticsOutlinedIcon /> },
  { label: 'Todos', to: '/todos', icon: <AssignmentTurnedInOutlinedIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
]

