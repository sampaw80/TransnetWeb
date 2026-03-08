import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { NavLink, useLocation } from 'react-router-dom'
import { navItems } from './navigation'

type LeftMenuProps = {
  onNavigate?: () => void
}

export function LeftMenu({ onNavigate }: LeftMenuProps) {
  const location = useLocation()

  return (
    <>
      <Toolbar
        sx={{
          px: 2,
          borderBottom: (t) => `1px solid ${t.palette.nav.border}`,
          backgroundImage: (t) =>
            `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.28)} 0%, transparent 55%)`,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: (t) => t.palette.nav.text, fontWeight: 900 }} noWrap>
            Fleet System
          </Typography>
          <Typography variant="caption" sx={{ color: (t) => t.palette.nav.subtleText }} noWrap>
            Manage vehicles, stock, dispatch
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: (t) => t.palette.nav.border }} />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onNavigate}
            selected={location.pathname === item.to}
            sx={{
              mx: 0.5,
              my: 0.25,
              color: (t) => t.palette.nav.text,
              '&:hover': { bgcolor: (t) => t.palette.nav.hover },
              '&.Mui-selected': {
                bgcolor: (t) => t.palette.nav.active,
                color: (t) => t.palette.nav.activeText,
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 700, fontSize: 14, noWrap: true }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  )
}

