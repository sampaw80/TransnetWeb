import MenuIcon from '@mui/icons-material/Menu'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

type HeaderProps = {
  onOpenMobileMenu: () => void
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (t) => alpha(t.palette.background.paper, 0.96),
        backgroundImage: (t) =>
          `linear-gradient(90deg, ${alpha(t.palette.primary.main, 0.07)} 0%, transparent 55%)`,
        borderBottom: (t) => `1px solid ${alpha(t.palette.primary.main, 0.18)}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onOpenMobileMenu}
          sx={{ mr: 2, display: { md: 'none' } }}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Inventory2OutlinedIcon fontSize="small" color="primary" />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800 }}>
            Fleet & Inventory
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2" color="text.secondary">
          Operations Console
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

