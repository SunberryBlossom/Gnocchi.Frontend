import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Paper,
  Stack
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FastfoodIcon from '@mui/icons-material/Fastfood'

import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'

import { getAllResults } from '../services/ResultServices'
import { getAllIngredients } from '../services/IngredientServices'

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalResults: 0,
    topIngredient: 'N/A',
    avgScore: 0
  })

  const [topIngredientsData] = useState({
    categories: ['Guanciale', 'Ricotta', 'San Marzano', 'Russet Potato'],
    series: [4.8, 4.5, 4.2, 3.9]
  })

  const [methodsPieData] = useState([
    { id: 0, value: 35, label: 'Pan Frying' },
    { id: 1, value: 25, label: 'Baking' },
    { id: 2, value: 20, label: 'Sous-vide' },
    { id: 3, value: 20, label: 'Boiling' }
  ])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const results = await getAllResults()
      const ingredients = await getAllIngredients()

      if (results && results.length > 0) {
        const total = results.length
        const avg = (results.reduce((acc, curr) => acc + (curr.score || 0), 0) / total).toFixed(1)

        setStats({
          totalResults: total,
          topIngredient: ingredients?.[0]?.name || 'Guanciale',
          avgScore: Number(avg)
        })
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <Typography variant="h5" fontWeight="bold">
        Kitchen Analytics
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
        <Paper elevation={2} sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, flex: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main', margin: '0 auto', mb: 1, width: 32, height: 32 }}>
            <RestaurantIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
            {stats.totalResults}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            Logged Results
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, flex: 1 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', margin: '0 auto', mb: 1, width: 32, height: 32 }}>
            <AutoAwesomeIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
            {stats.avgScore}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            Avg Rating
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, flex: 1 }}>
          <Avatar sx={{ bgcolor: 'success.main', margin: '0 auto', mb: 1, width: 32, height: 32 }}>
            <FastfoodIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.85rem', sm: '1.25rem' } }} noWrap>
            {stats.topIngredient}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            Top Rated
          </Typography>
        </Paper>
      </Stack>

      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Highest Rated Ingredients
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Based on average scores from cooking outcomes
          </Typography>

          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: topIngredientsData.categories }]}
              series={[{ data: topIngredientsData.series, color: '#1976d2', label: 'Average Score' }]}
              height={260}
              margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Cooking Method Usage
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Distribution of techniques used in your logs
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[
                {
                  data: methodsPieData,
                  innerRadius: 30,
                  outerRadius: 80,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              height={220}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}