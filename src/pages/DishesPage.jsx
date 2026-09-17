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
  Button
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
import { getAllCookingMethods, updateCookingMethod, deleteCookingMethod } from '../services/CookingMethodServices'
import { getAllResults, deleteResult } from '../services/ResultServices'
import { getAllVariants, deleteVariant } from '../services/VariantServices'
import { getAllScores, deleteScore } from '../services/ScoreServices'

export function DishesPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)

  const [dishes, setDishes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [methods, setMethods] = useState([])
  const [results, setResults] = useState([])
  const [variants, setVariants] = useState([])
  const [scores, setScores] = useState([])

  const [editDishOpen, setEditDishOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [dishName, setDishName] = useState('')
  const [dishDescription, setDishDescription] = useState('')

  const [editIngOpen, setEditIngOpen] = useState(false)
  const [selectedIng, setSelectedIng] = useState(null)
  const [ingValue, setIngValue] = useState('')
  const [ingAttribute, setIngAttribute] = useState('')

  const [editMethodOpen, setEditMethodOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [methodScoreId, setMethodScoreId] = useState('')

  useEffect(() => {
    loadLibraryData()
  }, [])

  const loadLibraryData = async () => {
    try {
      setLoading(true)
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
      console.error('Failed to load library data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, serviceDeleteFunc, setStateFunc, entityName) => {
    if (window.confirm(`Are you sure you want to delete this ${entityName}?`)) {
      try {
        await serviceDeleteFunc(id)
        setStateFunc((prev) => prev.filter((item) => item.id !== id))
      } catch (err) {
        console.error(`Failed to delete ${entityName}`, err)
      }
    }
  }

  const handleOpenEditDish = (dish) => {
    setSelectedDish(dish)
    setDishName(dish.name || '')
    setDishDescription(dish.description || '')
    setEditDishOpen(true)
  }

  const handleSaveDish = async () => {
    try {
      const updated = { ...selectedDish, name: dishName, description: dishDescription }
      await updateDish(selectedDish.id, updated)
      setDishes((prev) => prev.map((item) => (item.id === selectedDish.id ? updated : item)))
      setEditDishOpen(false)
    } catch (err) {
      console.error('Failed to update dish', err)
    }
  }

  const handleOpenEditIng = (ing) => {
    setSelectedIng(ing)
    setIngValue(ing.name || '')
    setIngAttribute(ing.attribute || 'Name')
    setEditIngOpen(true)
  }

  const handleSaveIng = async () => {
    try {
      await updateIngredient(selectedIng.id, ingValue, ingAttribute)
      setIngredients((prev) =>
        prev.map((item) => (item.id === selectedIng.id ? { ...item, name: ingValue, attribute: ingAttribute } : item))
      )
      setEditIngOpen(false)
    } catch (err) {
      console.error('Failed to update ingredient', err)
    }
  }

  const handleOpenEditMethod = (method) => {
    setSelectedMethod(method)
    setMethodScoreId(method.scoreId || '')
    setEditMethodOpen(true)
  }

  const handleSaveMethod = async () => {
    try {
      await updateCookingMethod(selectedMethod.id, methodScoreId)
      setMethods((prev) =>
        prev.map((item) => (item.id === selectedMethod.id ? { ...item, scoreId: methodScoreId } : item))
      )
      setEditMethodOpen(false)
    } catch (err) {
      console.error('Failed to update cooking method', err)
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
          <Tab icon={<StarIcon />} iconPosition="start" label={`Scores (${scores.length})`} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={2}>
          {dishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} key={dish.id || dish.name}>
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
                      <IconButton size="small" onClick={() => handleDelete(dish.id, deleteDish, setDishes, 'dish')} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {dish.description || 'No description added yet.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {ingredients.map((ing) => (
            <Chip
              key={ing.id || ing.name}
              label={ing.name}
              color="primary"
              variant="outlined"
              onDelete={() => handleDelete(ing.id, deleteIngredient, setIngredients, 'ingredient')}
              deleteIcon={<DeleteIcon fontSize="small" />}
              onClick={() => handleOpenEditIng(ing)}
            />
          ))}
        </Stack>
      )}

      {activeTab === 2 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {methods.map((method) => (
            <Chip
              key={method.id || method.name}
              label={method.name}
              color="secondary"
              variant="outlined"
              onClick={() => handleOpenEditMethod(method)}
              onDelete={() => handleDelete(method.id, deleteCookingMethod, setMethods, 'method')}
              deleteIcon={<DeleteIcon fontSize="small" />}
            />
          ))}
        </Stack>
      )}

      {activeTab === 3 && (
        <Grid container spacing={2}>
          {results.map((res, index) => (
            <Grid item xs={12} key={res.id || index}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" gap={1}>
                      <Chip label={res.ingredientName || 'Ingredient'} size="small" color="primary" />
                      <Chip label={res.cookingMethodName || 'Method'} size="small" color="secondary" />
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(res.id, deleteResult, setResults, 'result')} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  {res.notes && (
                    <Typography variant="body2" sx={{ my: 1 }}>
                      "{res.notes}"
                    </Typography>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">Score:</Typography>
                    <Rating value={res.score || 0} readOnly precision={0.5} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={2}>
          {variants.map((variant) => (
            <Grid item xs={12} key={variant.id || variant.name}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {variant.name}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDelete(variant.id, deleteVariant, setVariants, 'variant')} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {variant.description || 'No variant details logged.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 5 && (
        <Grid container spacing={2}>
          {scores.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card sx={{ boxShadow: 2 }}>
                <CardContent display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <Rating value={s.value || s.score || 0} readOnly precision={0.5} />
                    <IconButton size="small" onClick={() => handleDelete(s.id, deleteScore, setScores, 'score')} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editDishOpen} onClose={() => setEditDishOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Dish</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            <TextField label="Dish Name" fullWidth value={dishName} onChange={(e) => setDishName(e.target.value)} />
            <TextField label="Description" fullWidth multiline rows={3} value={dishDescription} onChange={(e) => setDishDescription(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDishOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDish} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editIngOpen} onClose={() => setEditIngOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            <TextField label="New Value" fullWidth value={ingValue} onChange={(e) => setIngValue(e.target.value)} />
            <TextField label="Attribute" fullWidth value={ingAttribute} onChange={(e) => setIngAttribute(e.target.value)} helperText="e.g. Name, Category" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIngOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveIng} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editMethodOpen} onClose={() => setEditMethodOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Update Cooking Method Score</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            <TextField label="Score ID" fullWidth value={methodScoreId} onChange={(e) => setMethodScoreId(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMethodOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMethod} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}