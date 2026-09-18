import { Outlet, useNavigate, useLocation } from 'react-router'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Container,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined'
import LogoutIcon from '@mui/icons-material/Logout'

import { Signout } from '../services/AuthService'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  const navItems = [
    { label: 'Dashboard', value: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Add Log', value: '/add-log', icon: <AddCircleOutlineIcon /> },
    { label: 'Dishes', value: '/dishes', icon: <RestaurantMenuIcon /> }
  ]

  const handleLogout = async () => {
    try {
      await Signout()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      navigate('/', { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pb: isDesktop ? 4 : 9 }}>
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Gnocchi
          </Typography>

          {isDesktop ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.value)}
                  sx={{
                    borderBottom: location.pathname === item.value ? '2px solid white' : 'none',
                    borderRadius: 0
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Tooltip title="Log out">
                <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Tooltip title="Log out">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container maxWidth={isDesktop ? 'md' : 'sm'} sx={{ mt: 3 }}>
        <Outlet />
      </Container>

      {!isDesktop && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={location.pathname}
            onChange={(event, newValue) => navigate(newValue)}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.value}
                label={item.label}
                value={item.value}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  )
}