import type { ReactElement } from 'react'
import {
  AnalyticsOutlined as AnalyticsOutlinedIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
  DashboardOutlined as DashboardOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  DirectionsCarOutlined as DirectionsCarOutlinedIcon,
  CategoryOutlined as CategoryOutlinedIcon
} from '@mui/icons-material'

export type NavSubItem = {
  label: string
  to: string
  icon: ReactElement
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
    icon: <DirectionsCarOutlinedIcon />,
    children: [
      { label: 'Vehicle Category', to: '/vehicle-categories', icon: <CategoryOutlinedIcon /> },
    ]
  },
  { label: 'Reports', to: '/reports', icon: <AnalyticsOutlinedIcon /> },
  { label: 'Todos', to: '/todos', icon: <AssignmentTurnedInOutlinedIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
]

