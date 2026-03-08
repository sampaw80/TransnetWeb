import { createTheme, responsiveFontSizes } from '@mui/material/styles'

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

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#16A34A', // light green
      dark: '#15803D',
      light: '#4ADE80',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB', // blue accent (pairs well with green)
      dark: '#1D4ED8',
      light: '#60A5FA',
      contrastText: '#FFFFFF',
    },
    success: { main: '#15803D' },
    warning: { main: '#B45309' },
    error: { main: '#B42318' },
    info: { main: '#2563EB' },
    background: {
      default: '#F6F8FC', // app canvas
      paper: '#FFFFFF', // surfaces
    },
    text: {
      primary: '#0B1220',
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.12)',
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
  typography: {
    fontFamily: ['Roboto', 'Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: -0.4 },
    h6: { fontWeight: 800, letterSpacing: -0.2 },
    subtitle2: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  shadows: (() => {
    const custom = [
      'none',
      '0px 1px 2px rgba(15, 23, 42, 0.06)',
      '0px 2px 8px rgba(15, 23, 42, 0.08)',
      '0px 6px 16px rgba(15, 23, 42, 0.10)',
      ...Array.from({ length: 21 }, () => '0px 6px 16px rgba(15, 23, 42, 0.10)'),
    ]
    return custom.slice(0, 25) as unknown as ReturnType<typeof createTheme>['shadows']
  })(),
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F6F8FC',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { color: 'inherit', elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(15, 23, 42, 0.10)',
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
  },
})

export const appTheme = responsiveFontSizes(baseTheme)

