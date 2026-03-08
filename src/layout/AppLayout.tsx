import { Box, Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { LeftMenu } from './LeftMenu'

const drawerWidth = 260

export function AppLayout() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawerVariant = useMemo(() => (isDesktop ? 'permanent' : 'temporary'), [isDesktop])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onOpenMobileMenu={() => setMobileOpen(true)} />

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Navigation">
        <Drawer
          variant={drawerVariant}
          open={isDesktop ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <LeftMenu onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, maxWidth: 1400, width: '100%', mx: 'auto' }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

