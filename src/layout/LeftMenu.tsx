import { 
  Box, 
  Divider, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Collapse
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { NavLink, useLocation } from 'react-router-dom'
import { navItems } from './navigation'
import type { NavItem } from './navigation'
import { useAppTheme } from '../app/ThemeProvider'
import type { ThemeType } from '../app/theme'
import { 
  Palette as PaletteIcon, 
  ExpandLess, 
  ExpandMore 
} from '@mui/icons-material'
import { useState } from 'react'

type LeftMenuProps = {
  onNavigate?: () => void
}

const themeOptions: { value: ThemeType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'lightProfessional', label: 'Light Professional' },
  { value: 'modernMinimal', label: 'Modern Minimal' },
  { value: 'midnightSlate', label: 'Midnight Slate' },
  { value: 'vibrantEnterprise', label: 'Vibrant Enterprise' },
  { value: 'ecoFresh', label: 'Eco Fresh' },
]

export function LeftMenu({ onNavigate }: LeftMenuProps) {
  const location = useLocation()
  const { themeType, setTheme } = useAppTheme()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 1 }}>
          {navItems.map((item) => (
            <NavMenuItem 
              key={item.label} 
              item={item} 
              location={location} 
              onNavigate={onNavigate} 
            />
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: (t) => `1px solid ${t.palette.nav.border}`, bgcolor: (t) => alpha(t.palette.nav.bg, 0.4) }}>
        <FormControl fullWidth size="small">
          <InputLabel 
            id="theme-select-label" 
            sx={{ 
              color: (t) => `${t.palette.nav.subtleText} !important`,
              fontSize: 12,
              '&.Mui-focused': { color: (t) => `${t.palette.primary.main} !important` }
            }}
          >
            Theme
          </InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme-select"
            value={themeType}
            label="Theme"
            onChange={(e) => setTheme(e.target.value as ThemeType)}
            startAdornment={<PaletteIcon sx={{ mr: 1, fontSize: 18, color: (t) => t.palette.nav.subtleText }} />}
            sx={{
              borderRadius: 2,
              color: (t) => `${t.palette.nav.text} !important`,
              '& .MuiSelect-select': {
                color: (t) => `${t.palette.nav.text} !important`,
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: (t) => `${t.palette.nav.border} !important`,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (t) => `${t.palette.primary.main} !important`,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: (t) => `${t.palette.primary.main} !important`,
              },
              '& .MuiSelect-icon': {
                color: (t) => `${t.palette.nav.subtleText} !important`,
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: 'background.paper',
                  '& .MuiMenuItem-root': {
                    color: 'text.primary',
                    fontSize: 14,
                    fontWeight: 500,
                  },
                },
              },
            }}
          >
            {themeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

function NavMenuItem({ item, location, onNavigate }: { item: NavItem; location: any; onNavigate?: () => void }) {
  const [open, setOpen] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open)
    } else if (onNavigate) {
      onNavigate()
    }
  }

  const isSelected = item.to ? location.pathname === item.to : false

  return (
    <>
      <ListItemButton
        component={item.to ? NavLink : 'div'}
        {...(item.to ? { to: item.to } : {})}
        onClick={handleClick}
        selected={isSelected}
        sx={{
          mx: 0.5,
          my: 0.25,
          borderRadius: 2,
          color: (t) => t.palette.nav.text,
          '&:hover': { bgcolor: (t) => t.palette.nav.hover },
          '&.Mui-selected': {
            bgcolor: (t) => t.palette.nav.active,
            color: (t) => t.palette.nav.activeText,
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ fontWeight: 700, fontSize: 14, noWrap: true }}
        />
        {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {item.children!.map((child) => (
              <ListItemButton
                key={child.to}
                component={NavLink}
                to={child.to}
                onClick={onNavigate}
                selected={location.pathname === child.to}
                sx={{
                  mx: 0.5,
                  my: 0.25,
                  borderRadius: 2,
                  color: (t) => t.palette.nav.text,
                  '&:hover': { bgcolor: (t) => t.palette.nav.hover },
                  '&.Mui-selected': {
                    bgcolor: (t) => t.palette.nav.active,
                    color: (t) => t.palette.nav.activeText,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{child.icon}</ListItemIcon>
                <ListItemText
                  primary={child.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 13, noWrap: true }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
