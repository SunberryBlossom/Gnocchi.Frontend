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
import { getAllCookingMethods } from '../services/CookingMethodServices'
import { getMethodLabel } from '../constants/cookingMethods'

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalResults: 0,
    topIngredient: 'N/A',
    avgScore: 0
  })

  const [topIngredientsData, setTopIngredientsData] = useState({
    categories: [],
    series: []
  })

  const [methodsPieData, setMethodsPieData] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const getScoreValue = (scoreObj) => {
    if (!scoreObj) return 0
    if (typeof scoreObj.rating === 'number') return scoreObj.rating + 1
    if (typeof scoreObj.ratingValue === 'number') return scoreObj.ratingValue
    return 0
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [resultsRes, ingredientsRes, methodsRes] = await Promise.allSettled([
        getAllResults(),
        getAllIngredients(),
        getAllCookingMethods()
      ])

      const results = resultsRes.status === 'fulfilled' ? resultsRes.value || [] : []
      const ingredients = ingredientsRes.status === 'fulfilled' ? ingredientsRes.value || [] : []
      const methods = methodsRes.status === 'fulfilled' ? methodsRes.value || [] : []

      // 1. Slå upp ingrediensnamn och räkna frekvens i loggade resultat
      const ingMap = {}
      ingredients.forEach((i) => {
        const id = String(i.ingredientId || i.id || '').toLowerCase()
        ingMap[id] = i.name || i.Name
      })

      const ingCounts = {}
      results.forEach((res) => {
        const iId = String(res.ingredientId || '').toLowerCase()
        const name = ingMap[iId]
        if (name) {
          ingCounts[name] = (ingCounts[name] || 0) + 1
        }
      })

      const sortedIngs = Object.entries(ingCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      const categories = sortedIngs.map(([name]) => name)
      const series = sortedIngs.map(([, count]) => count)

      setTopIngredientsData({
        categories: categories.length > 0 ? categories : ['No results yet'],
        series: series.length > 0 ? series : [0]
      })

      const methodMap = {}
      methods.forEach((m) => {
        const id = String(m.cookingMethodId || m.id || '').toLowerCase()
        const mEnum = m.method !== undefined ? m.method : m.Method
        methodMap[id] = getMethodLabel(mEnum)
      })

      const methodCounts = {}
      results.forEach((res) => {
        const mId = String(res.cookingMethodId || '').toLowerCase()
        const label = methodMap[mId] || 'Other'
        methodCounts[label] = (methodCounts[label] || 0) + 1
      })

      const pieData = Object.entries(methodCounts).map(([label, value], index) => ({
        id: index,
        value,
        label
      }))

      setMethodsPieData(pieData)

      // 3. Sätt översiktskort
      const topIngredientName = sortedIngs.length > 0 ? sortedIngs[0][0] : 'N/A'

      setStats({
        totalResults: results.length,
        topIngredient: topIngredientName,
        avgScore: results.length > 0 ? (results.length / ingredients.length).toFixed(1) : '0.0'
      })
    } catch (err) {
      console.error('Could not fetch dashboard data:', err)
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
            {topIngredientsData.categories.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: topIngredientsData.categories }]}
                series={[{ data: topIngredientsData.series, color: '#1976d2', label: 'Score' }]}
                height={260}
                margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No scored ingredients logged yet.
              </Typography>
            )}
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
            {methodsPieData.length > 0 ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No cooking methods logged yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}