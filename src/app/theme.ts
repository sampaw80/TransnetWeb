import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import type { ThemeOptions, Theme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    nav: {
      bg: string
      paper: string
      hover: string
      active: string
      activeText: string
      text: string
      subtleText: string
      border: string
    }
  }
  interface PaletteOptions {
    nav?: {
      bg: string
      paper: string
      hover: string
      active: string
      activeText: string
      text: string
      subtleText: string
      border: string
    }
  }
}

export type ThemeType = 'default' | 'dark' | 'lightProfessional' | 'modernMinimal' | 'midnightSlate' | 'vibrantEnterprise' | 'ecoFresh'

const commonTypography: ThemeOptions['typography'] = {
  fontFamily: ['Roboto', 'Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'].join(','),
  h4: { fontWeight: 800, letterSpacing: -0.4 },
  h6: { fontWeight: 800, letterSpacing: -0.2 },
  subtitle2: { fontWeight: 800 },
  button: { textTransform: 'none', fontWeight: 700 },
}

const commonShape = { borderRadius: 12 }

const commonShadows = [
  'none',
  '0px 1px 2px rgba(15, 23, 42, 0.06)',
  '0px 2px 8px rgba(15, 23, 42, 0.08)',
  '0px 6px 16px rgba(15, 23, 42, 0.10)',
  ...Array.from({ length: 21 }, () => '0px 6px 16px rgba(15, 23, 42, 0.10)'),
] as unknown as ThemeOptions['shadows']

const getComponentOverrides = (mode: 'light' | 'dark'): ThemeOptions['components'] => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === 'light' ? '#F6F8FC' : '#0F172A',
      },
    },
  },
  MuiAppBar: {
    defaultProps: { color: 'inherit', elevation: 0 },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderBottom: mode === 'light' ? '1px solid rgba(15, 23, 42, 0.10)' : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'saturate(180%) blur(10px)',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: 64,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.nav.paper,
        color: theme.palette.nav.text,
        borderRight: `1px solid ${theme.palette.nav.border}`,
        backgroundImage: 'none',
        boxShadow: theme.shadows[2],
      }),
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'small', variant: 'outlined' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        '&.Mui-selected': {
          backgroundColor: theme.palette.nav.active,
          color: theme.palette.nav.activeText,
        },
        '&.Mui-selected:hover': {
          backgroundColor: theme.palette.nav.active,
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: () => ({
        minWidth: 40,
        color: 'inherit',
        opacity: 0.9,
      }),
    },
  },
})

const themeConfigs: Record<ThemeType, ThemeOptions> = {
  default: {
    palette: {
      mode: 'light',
      primary: { main: '#16A34A', dark: '#15803D', light: '#4ADE80' },
      secondary: { main: '#2563EB' },
      background: { default: '#F6F8FC', paper: '#FFFFFF' },
      nav: {
        bg: '#F8FFFA',
        paper: '#F3FFF6',
        hover: 'rgba(22, 163, 74, 0.06)',
        active: 'rgba(22, 163, 74, 0.22)',
        activeText: '#064E3B',
        text: '#0B1220',
        subtleText: '#475569',
        border: 'rgba(22, 163, 74, 0.18)',
      },
    },
  },
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#4ADE80', dark: '#16A34A', light: '#86EFAC' },
      secondary: { main: '#60A5FA' },
      background: { default: '#0B1222', paper: '#111827' },
      text: { primary: '#F9FAFB', secondary: '#9CA3AF' },
      nav: {
        bg: '#111827',
        paper: '#1F2937',
        hover: 'rgba(74, 222, 128, 0.08)',
        active: 'rgba(74, 222, 128, 0.16)',
        activeText: '#86EFAC',
        text: '#F9FAFB',
        subtleText: '#9CA3AF',
        border: 'rgba(255, 255, 255, 0.06)',
      },
    },
  },
  lightProfessional: {
    palette: {
      mode: 'light',
      primary: { main: '#2563EB', dark: '#1D4ED8', light: '#60A5FA' },
      secondary: { main: '#64748B' },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      nav: {
        bg: '#F1F5F9',
        paper: '#FFFFFF',
        hover: 'rgba(37, 99, 235, 0.04)',
        active: 'rgba(37, 99, 235, 0.08)',
        activeText: '#1D4ED8',
        text: '#0F172A',
        subtleText: '#475569',
        border: 'rgba(0, 0, 0, 0.06)',
      },
    },
  },
  modernMinimal: {
    palette: {
      mode: 'light',
      primary: { main: '#8B5CF6', dark: '#7C3AED', light: '#A78BFA' },
      secondary: { main: '#F472B6' },
      background: { default: '#FAFAFA', paper: '#FFFFFF' },
      nav: {
        bg: '#FFFFFF',
        paper: '#FFFFFF',
        hover: 'rgba(139, 92, 246, 0.05)',
        active: 'rgba(139, 92, 246, 0.1)',
        activeText: '#7C3AED',
        text: '#18181B',
        subtleText: '#71717A',
        border: 'rgba(0, 0, 0, 0.04)',
      },
    },
    shape: { borderRadius: 16 },
  },
  midnightSlate: {
    palette: {
      mode: 'dark',
      primary: { main: '#38BDF8', dark: '#0284C7', light: '#7DD3FC' },
      secondary: { main: '#94A3B8' },
      background: { default: '#0F172A', paper: '#1E293B' },
      nav: {
        bg: '#0F172A',
        paper: '#1E293B',
        hover: 'rgba(56, 189, 248, 0.08)',
        active: 'rgba(56, 189, 248, 0.15)',
        activeText: '#7DD3FC',
        text: '#F1F5F9',
        subtleText: '#94A3B8',
        border: 'rgba(255, 255, 255, 0.05)',
      },
    },
  },
  vibrantEnterprise: {
    palette: {
      mode: 'light',
      primary: { main: '#4F46E5', dark: '#4338CA', light: '#818CF8' },
      secondary: { main: '#F97316' },
      background: { default: '#F5F3FF', paper: '#FFFFFF' },
      nav: {
        bg: '#4F46E5',
        paper: '#4338CA',
        hover: 'rgba(255, 255, 255, 0.1)',
        active: 'rgba(255, 255, 255, 0.2)',
        activeText: '#FFFFFF',
        text: 'rgba(255, 255, 255, 0.8)',
        subtleText: 'rgba(255, 255, 255, 0.6)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  ecoFresh: {
    palette: {
      mode: 'light',
      primary: { main: '#059669', dark: '#047857', light: '#34D399' },
      secondary: { main: '#D97706' },
      background: { default: '#F0FDF4', paper: '#FFFFFF' },
      nav: {
        bg: '#F0FDF4',
        paper: '#DCFCE7',
        hover: 'rgba(5, 150, 105, 0.05)',
        active: 'rgba(5, 150, 105, 0.1)',
        activeText: '#047857',
        text: '#064E3B',
        subtleText: '#065F46',
        border: 'rgba(5, 150, 105, 0.1)',
      },
    },
  },
}

export const getTheme = (type: ThemeType): Theme => {
  const config = themeConfigs[type]
  const mode = config.palette?.mode as 'light' | 'dark' || 'light'
  
  const base = createTheme({
    ...config,
    typography: { ...commonTypography, ...config.typography },
    shape: { ...commonShape, ...config.shape },
    shadows: commonShadows,
    components: getComponentOverrides(mode),
  })
  
  return responsiveFontSizes(base)
}

// Keep appTheme for backward compatibility if needed, using the default
export const appTheme = getTheme('default')

