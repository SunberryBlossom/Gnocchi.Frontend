import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Rating,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TuneIcon from '@mui/icons-material/Tune'
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { getAllDishes, updateDish, deleteDish } from '../services/DishServices'
import { getAllIngredients, updateIngredient, deleteIngredient } from '../services/IngredientServices'
import { getAllCookingMethods, deleteCookingMethod } from '../services/CookingMethodServices'
import { getAllResults, deleteResult } from '../services/ResultServices'
import { getAllVariants, deleteVariant } from '../services/VariantServices'
import { getAllScores, deleteScore } from '../services/ScoreServices'

export function DishesPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Data State - direkt från backend
  const [dishes, setDishes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [methods, setMethods] = useState([])
  const [results, setResults] = useState([])
  const [variants, setVariants] = useState([])
  const [scores, setScores] = useState([])

  // Modal States för entiteter som stödjer update
  const [editDishOpen, setEditDishOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [dishName, setDishName] = useState('')
  const [dishDescription, setDishDescription] = useState('')

  const [editIngOpen, setEditIngOpen] = useState(false)
  const [selectedIng, setSelectedIng] = useState(null)
  const [ingValue, setIngValue] = useState('')
  const [ingAttribute, setIngAttribute] = useState('')

  useEffect(() => {
    loadLibraryData()
  }, [])

  // Hämtar färsk data direkt från backend (SSOT)
  const loadLibraryData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dishRes, ingRes, methodRes, resultRes, variantRes, scoreRes] = await Promise.all([
        getAllDishes(),
        getAllIngredients(),
        getAllCookingMethods(),
        getAllResults(),
        getAllVariants(),
        getAllScores()
      ])

      setDishes(dishRes || [])
      setIngredients(ingRes || [])
      setMethods(methodRes || [])
      setResults(resultRes || [])
      setVariants(variantRes || [])
      setScores(scoreRes || [])
    } catch (err) {
      console.error('Failed to fetch data from backend:', err)
      setError('Error connecting to the backend. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, serviceDeleteFunc, entityName) => {
    if (window.confirm(`Are you sure you want to delete this ${entityName}?`)) {
      try {
        await serviceDeleteFunc(id)
        await loadLibraryData()
      } catch (err) {
        console.error(`Could not delete ${entityName}`, err)
        alert(`An error occurred while deleting ${entityName}.`)
      }
    }
  }

  // --- DISH EDIT ---
  const handleOpenEditDish = (dish) => {
    setSelectedDish(dish)
    setDishName(dish.name || '')
    setDishDescription(dish.description || '')
    setEditDishOpen(true)
  }


  const handleSaveDish = async () => {
    try {
      const id = selectedDish.dishId || selectedDish.id
      await updateDish(id, dishName)
      await loadLibraryData()
      setEditDishOpen(false)
    } catch (err) {
      console.error('Could not update dish:', err)
      alert('Update failed.')
    }
  }


  // --- INGREDIENT EDIT ---
  const handleOpenEditIng = (ing) => {
    setSelectedIng(ing)
    setIngValue(ing.name || '')
    setIngAttribute(ing.attribute || 'Name')
    setEditIngOpen(true)
  }


  // Spara ingrediens
const handleSaveIng = async () => {
    try {
      const id = selectedIng.ingredientId || selectedIng.id
      await updateIngredient(id, ingValue)
      await loadLibraryData()
      setEditIngOpen(false)
    } catch (err) {
      console.error('Could not update ingredient:', err)
      alert('Update failed.')
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
    <Box py={2}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Kitchen Library
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<RestaurantIcon />} iconPosition="start" label={`Dishes (${dishes.length})`} />
          <Tab icon={<LocalGroceryStoreIcon />} iconPosition="start" label={`Ingredients (${ingredients.length})`} />
          <Tab icon={<OutdoorGrillIcon />} iconPosition="start" label={`Methods (${methods.length})`} />
          <Tab icon={<AssessmentIcon />} iconPosition="start" label={`Results (${results.length})`} />
          <Tab icon={<TuneIcon />} iconPosition="start" label={`Variants (${variants.length})`} />
        </Tabs>
      </Box>

      {/* 1. DISHES TAB */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          {dishes.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No dishes could be fetched from the database.</Typography>
            </Grid>
          ) : (
            dishes.map((dish) => {
              const id = dish.dishId || dish.id
              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" fontWeight="bold">
                          {dish.name}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenEditDish(dish)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(id, deleteDish, 'rätt')} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {dish.description || 'No description available.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      )}

      {/* 2. INGREDIENTS TAB */}
      {activeTab === 1 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {ingredients.length === 0 ? (
            <Typography color="text.secondary">No ingredients are registered.</Typography>
          ) : (
            ingredients.map((ing) => {
              const id = ing.ingredientId || ing.id
              return (
                <Chip
                  key={id}
                  label={ing.name}
                  color="primary"
                  variant="outlined"
                  onDelete={() => handleDelete(id, deleteIngredient, 'ingrediens')}
                  deleteIcon={<DeleteIcon fontSize="small" />}
                  onClick={() => handleOpenEditIng(ing)}
                />
              )
            })
          )}
        </Stack>
      )}

      {/* 3. METHODS TAB */}
      {activeTab === 2 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {methods.length === 0 ? (
            <Typography color="text.secondary">No cooking methods are registered.</Typography>
          ) : (
            methods.map((method) => {
              const id = method.cookingMethodId || method.id
              return (
                <Chip
                  key={id}
                  label={method.method !== undefined ? `Method #${method.method}` : method.name}
                  color="secondary"
                  variant="outlined"
                  onDelete={() => handleDelete(id, deleteCookingMethod, 'method')}
                  deleteIcon={<DeleteIcon fontSize="small" />}
                />
              )
            })
          )}
        </Stack>
      )}

      {/* 4. RESULTS TAB */}
      {activeTab === 3 && (
        <Grid container spacing={2}>
          {results.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No results logged yet.</Typography>
            </Grid>
          ) : (
            results.map((res) => {
              const id = res.resultId || res.id
              return (
                <Grid item xs={12} key={id}>
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" gap={1}>
                          <Chip label={res.ingredientName || 'Ingredient'} size="small" color="primary" />
                          <Chip label={res.cookingMethodName || 'Method'} size="small" color="secondary" />
                        </Box>
                        <IconButton size="small" onClick={() => handleDelete(id, deleteResult, 'resultat')} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      {res.comment && (
                        <Typography variant="body2" sx={{ my: 1 }}>
                          "{res.comment}"
                        </Typography>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">Betyg:</Typography>
                        <Rating value={res.score || 0} readOnly precision={0.5} size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      )}

      {/* 5. VARIANTS TAB */}
      {activeTab === 4 && (
        <Grid container spacing={2}>
          {variants.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No variants are registered.</Typography>
            </Grid>
          ) : (
            variants.map((variant) => {
              const id = variant.variantId || variant.id
              return (
                <Grid item xs={12} key={id}>
                  <Card sx={{ boxShadow: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {variant.name}
                        </Typography>
                        <IconButton size="small" onClick={() => handleDelete(id, deleteVariant, 'variant')} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {variant.description || 'No details available.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      )}

      {/* MODAL DIALOGS */}
      <Dialog open={editDishOpen} onClose={() => setEditDishOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit dish</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" fullWidth value={dishName} onChange={(e) => setDishName(e.target.value)} />
            <TextField label="Description" fullWidth multiline rows={3} value={dishDescription} onChange={(e) => setDishDescription(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDishOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDish} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editIngOpen} onClose={() => setEditIngOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit ingredient</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            <TextField label="New value" fullWidth value={ingValue} onChange={(e) => setIngValue(e.target.value)} />
            <TextField label="Attribute" fullWidth value={ingAttribute} onChange={(e) => setIngAttribute(e.target.value)} helperText="t.ex. Name" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIngOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveIng} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}