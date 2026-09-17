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
  useMediaQuery,
  useTheme
} from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined'

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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', pb: isDesktop ? 4 : 9 }}>
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Gnocchi
          </Typography>

          {isDesktop && (
            <Box sx={{ display: 'flex', gap: 1 }}>
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
            </Box>
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