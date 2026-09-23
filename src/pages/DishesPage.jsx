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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

import { getAllDishes, updateDish, deleteDish } from '../services/DishServices'
import { getAllIngredients, updateIngredient, deleteIngredient } from '../services/IngredientServices'
import { getAllCookingMethods, deleteCookingMethod } from '../services/CookingMethodServices'
import { getAllResults, deleteResult } from '../services/ResultServices'
import { getAllVariants, deleteVariant } from '../services/VariantServices'
import { getAllScores, deleteScore } from '../services/ScoreServices'
import { getAllRecipeSteps } from '../services/RecipeStepServices'

import { getMethodLabel } from '../constants/cookingMethods'
import { getDishTypeLabel } from '../constants/dishTypes'
import { SCORE_MAP } from '../constants/scores'

// Helper to reverse-lookup numeric score from SCORE_MAP GUIDs
const getScoreValueFromGuid = (guid) => {
  if (!guid) return null
  const targetGuid = String(guid).trim().toLowerCase()
  const entry = Object.entries(SCORE_MAP).find(([rating, scoreGuid]) => scoreGuid.toLowerCase() === targetGuid)
  return entry ? Number(entry[0]) : null
}

export function DishesPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Data State
  const [dishes, setDishes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [methods, setMethods] = useState([])
  const [results, setResults] = useState([])
  const [variants, setVariants] = useState([])
  const [scores, setScores] = useState([])
  const [recipeSteps, setRecipeSteps] = useState([])

  // Modal States
  const [editDishOpen, setEditDishOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [dishName, setDishName] = useState('')

  const [editIngOpen, setEditIngOpen] = useState(false)
  const [selectedIng, setSelectedIng] = useState(null)
  const [ingValue, setIngValue] = useState('')

  useEffect(() => {
    loadLibraryData()
  }, [])

  const loadLibraryData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dishRes, ingRes, methodRes, resultRes, variantRes, scoreRes, stepRes] = await Promise.allSettled([
        getAllDishes(),
        getAllIngredients(),
        getAllCookingMethods(),
        getAllResults(),
        getAllVariants(),
        getAllScores(),
        getAllRecipeSteps()
      ])

      setDishes(dishRes.status === 'fulfilled' ? dishRes.value || [] : [])
      setIngredients(ingRes.status === 'fulfilled' ? ingRes.value || [] : [])
      setMethods(methodRes.status === 'fulfilled' ? methodRes.value || [] : [])
      setResults(resultRes.status === 'fulfilled' ? resultRes.value || [] : [])
      setVariants(variantRes.status === 'fulfilled' ? variantRes.value || [] : [])
      setScores(scoreRes.status === 'fulfilled' ? scoreRes.value || [] : [])
      setRecipeSteps(stepRes.status === 'fulfilled' ? stepRes.value || [] : [])
    } catch (err) {
      console.error('Failed to fetch data from backend:', err)
      setError('Error connecting to the backend. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // --- LOOKUP HELPERS ---
  const getVariantName = (variantId, dishId) => {
    const targetVariantId = variantId ? String(variantId).trim().toLowerCase() : null
    const targetDishId = dishId ? String(dishId).trim().toLowerCase() : null

    const found = variants.find((v) => {
      const vId = v.variantId || v.id || v.VariantId
      if (targetVariantId && vId && String(vId).trim().toLowerCase() === targetVariantId) {
        return true
      }

      const dishList = v.dishes || v.Dishes || []
      if (targetDishId && Array.isArray(dishList)) {
        return dishList.some((dId) => String(dId).trim().toLowerCase() === targetDishId)
      }

      return false
    })

    if (!found) return null

    const rawType = found.type ?? found.Type ?? found.name ?? found.Name
    if (rawType === undefined || rawType === null) return 'Custom Variant'

    if (typeof rawType === 'number') {
      return getDishTypeLabel(rawType)
    }

    return String(rawType)
  }

  const getScoreRating = (scoreId, dishId) => {
    const mapRating = getScoreValueFromGuid(scoreId)
    if (mapRating !== null) return mapRating

    if (typeof scoreId === 'number') return scoreId
    if (typeof scoreId === 'string' && !isNaN(Number(scoreId)) && scoreId.trim() !== '' && !scoreId.includes('-')) {
      return Number(scoreId)
    }

    const targetScoreId = scoreId ? String(scoreId).trim().toLowerCase() : null
    const targetDishId = dishId ? String(dishId).trim().toLowerCase() : null

    if (!targetScoreId && !targetDishId) return 0

    const found = scores.find((s) => {
      const sId = s.scoreId || s.id || s.ScoreId
      if (targetScoreId && sId && String(sId).trim().toLowerCase() === targetScoreId) return true

      const sDishId = s.dishId || s.DishId
      if (targetDishId && sDishId && String(sDishId).trim().toLowerCase() === targetDishId) return true

      return false
    })

    if (!found) return 0

    const foundGuidMapRating = getScoreValueFromGuid(found.scoreId || found.id || found.ScoreId)
    if (foundGuidMapRating !== null) return foundGuidMapRating

    const val =
      found.rating ??
      found.Rating ??
      found.score ??
      found.Score ??
      found.value ??
      found.Value ??
      found.ratingValue ??
      found.RatingValue ??
      0

    return Number(val) || 0
  }

  const getIngredientName = (ingredientId) => {
    if (!ingredientId) return 'Unknown Ingredient'
    const targetStr = String(ingredientId).trim().toLowerCase()
    const found = ingredients.find((i) => {
      const id = i.ingredientId || i.id || i.IngredientId
      return id && String(id).trim().toLowerCase() === targetStr
    })
    return found ? found.name || found.Name : 'Unknown Ingredient'
  }

  const getMethodName = (methodId) => {
    if (!methodId) return 'Unknown Method'
    const targetStr = String(methodId).trim().toLowerCase()
    const found = methods.find((m) => {
      const id = m.cookingMethodId || m.id || m.CookingMethodId
      return id && String(id).trim().toLowerCase() === targetStr
    })
    if (!found) return 'Unknown Method'
    const methodEnum = found.method !== undefined ? found.method : found.Method
    return getMethodLabel(methodEnum)
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

  const handleOpenEditDish = (dish) => {
    setSelectedDish(dish)
    setDishName(dish.name || '')
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

  const handleOpenEditIng = (ing) => {
    setSelectedIng(ing)
    setIngValue(ing.name || '')
    setEditIngOpen(true)
  }

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
              <Typography color="text.secondary">No dishes registered in database.</Typography>
            </Grid>
          ) : (
            dishes.map((dish) => {
              const id = dish.dishId || dish.id
              const variantName = getVariantName(dish.variantId || dish.VariantId, id)
              const scoreRating = getScoreRating(dish.scoreId || dish.ScoreId, id)

              const dtoStepIds = dish.recipeStepIds || dish.RecipeStepIds || []
              const matchedStepsFromState = recipeSteps.filter((step) => {
                const stepDishId = step.dishId || step.DishId
                return stepDishId && String(stepDishId).toLowerCase() === String(id).toLowerCase()
              })
              const stepCount = dtoStepIds.length > 0 ? dtoStepIds.length : matchedStepsFromState.length

              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {dish.name}
                        </Typography>
                        <Box display="flex">
                          <IconButton size="small" onClick={() => handleOpenEditDish(dish)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(id, deleteDish, 'dish')} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Stack spacing={1.5} mt={2}>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={`Variant: ${variantName || 'Standard'}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>

                        <Box display="flex" gap={1}>
                          <Chip
                            label={`${stepCount} ${stepCount === 1 ? 'Recipe Step' : 'Recipe Steps'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>

                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Score:
                          </Typography>
                          <Rating value={scoreRating} readOnly precision={0.5} size="small" />
                        </Box>
                      </Stack>
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
        <Grid container spacing={2}>
          {ingredients.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No ingredients registered in database.</Typography>
            </Grid>
          ) : (
            ingredients.map((ing) => {
              const id = ing.ingredientId || ing.id

              // MANUAL LOOKUP ADDED HERE
              const dtoResultIds = ing.resultIds || ing.ResultIds || []
              const matchedResultsFromState = results.filter((r) => {
                const rIngId = r.ingredientId || r.IngredientId
                return rIngId && String(rIngId).toLowerCase() === String(id).toLowerCase()
              })
              const resultCount = dtoResultIds.length > 0 ? dtoResultIds.length : matchedResultsFromState.length

              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {ing.name}
                        </Typography>
                        <Box display="flex">
                          <IconButton size="small" onClick={() => handleOpenEditIng(ing)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(id, deleteIngredient, 'ingredient')} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Stack spacing={1.5} mt={2}>
                        <Box display="flex" gap={1}>
                          <Chip
                            icon={ing.edibleRaw ? <CheckCircleOutlinedIcon fontSize="small" /> : <CancelOutlinedIcon fontSize="small" />}
                            label={ing.edibleRaw ? 'Edible Raw' : 'Cooked Only'}
                            size="small"
                            color={ing.edibleRaw ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </Box>

                        <Box display="flex" gap={1}>
                          <Chip
                            label={`${resultCount} ${resultCount === 1 ? 'Linked Result' : 'Linked Results'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      )}

      {/* 3. METHODS TAB */}
      {activeTab === 2 && (
        <Grid container spacing={2}>
          {methods.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No cooking methods registered in database.</Typography>
            </Grid>
          ) : (
            methods.map((method) => {
              const id = method.cookingMethodId || method.id
              const methodEnum = method.method !== undefined ? method.method : method.Method
              const labelName = getMethodLabel(methodEnum)

              // MANUAL LOOKUP ADDED HERE
              const dtoResults = method.results || method.Results || []
              const matchedResultsFromState = results.filter((r) => {
                const rMethodId = r.cookingMethodId || r.CookingMethodId
                return rMethodId && String(rMethodId).toLowerCase() === String(id).toLowerCase()
              })
              const resultCount = dtoResults.length > 0 ? dtoResults.length : matchedResultsFromState.length

              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {labelName}
                        </Typography>
                        <IconButton size="small" onClick={() => handleDelete(id, deleteCookingMethod, 'cooking method')} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Stack spacing={1.5} mt={2}>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={`Method ID Code: ${methodEnum}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>

                        <Box display="flex" gap={1}>
                          <Chip
                            label={`${resultCount} ${resultCount === 1 ? 'Linked Result' : 'Linked Results'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      )}

      {/* 4. RESULTS TAB */}
      {activeTab === 3 && (
        <Grid container spacing={2}>
          {results.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No logged results found.</Typography>
            </Grid>
          ) : (
            results.map((res) => {
              const id = res.resultId || res.id
              const ingredientName = getIngredientName(res.ingredientId || res.IngredientId)
              const methodName = getMethodName(res.cookingMethodId || res.CookingMethodId)

              // MANUAL LOOKUP ADDED HERE
              const dtoStepIds = res.recipeStepIds || res.RecipeStepIds || []
              const matchedStepsFromState = recipeSteps.filter((step) => {
                const stepResultId = step.resultId || step.ResultId
                return stepResultId && String(stepResultId).toLowerCase() === String(id).toLowerCase()
              })
              const stepCount = dtoStepIds.length > 0 ? dtoStepIds.length : matchedStepsFromState.length

              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {ingredientName}
                        </Typography>
                        <IconButton size="small" onClick={() => handleDelete(id, deleteResult, 'result')} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Stack spacing={1.5} mt={2}>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={`Method: ${methodName}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>

                        <Box display="flex" gap={1}>
                          <Chip
                            label={`${stepCount} ${stepCount === 1 ? 'Recipe Step' : 'Recipe Steps'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>

                        {res.comment && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              "{res.comment}"
                            </Typography>
                          </>
                        )}
                      </Stack>
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
        <Grid container spacing={3}>
          {variants.map((variant) => {
            // Map strictly to your C# VariantDTO properties (handling both camelCase and PascalCase JSON)
            const id = variant.variantId || variant.VariantId
            const rawType = variant.type ?? variant.Type

            // Format Display Name from the TypeOfDish enum
            let displayName = 'Custom Variant'
            if (typeof rawType === 'number') {
              displayName = getDishTypeLabel(rawType)
            } else if (typeof rawType === 'string' && rawType.trim() !== '') {
              displayName = rawType
            }

            // 1. Get the list of string IDs from the VariantDTO directly
            const variantDishIds = variant.dishes || variant.Dishes || []

            // 2. Cross-reference with the DishDTO state to ensure accuracy
            const matchedDishesFromState = dishes.filter((d) => {
              const dishId = d.dishId || d.DishId
              const dishVariantId = d.variantId || d.VariantId

              // True if the DishDTO's VariantId matches this Variant
              if (dishVariantId && String(dishVariantId).toLowerCase() === String(id).toLowerCase()) {
                return true
              }

              // True if this Dish's ID is sitting inside the VariantDTO.Dishes string list
              if (dishId && variantDishIds.some(vId => String(vId).toLowerCase() === String(dishId).toLowerCase())) {
                return true
              }

              return false
            })

            // Take whichever count is completely loaded
            const dishCount = Math.max(variantDishIds.length, matchedDishesFromState.length)

            return (
              <Grid item xs={12} md={4} lg={3} key={id}>
                <Card elevation={1}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {displayName}
                      </Typography>
                      <IconButton size="small" onClick={() => handleDeleteVariant(id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Associated Dishes: {dishCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
          {variants.length === 0 && (
            <Typography variant="body1" color="text.secondary" p={3}>
              No variants registered in database.
            </Typography>
          )}
        </Grid>
      )}

      {/* EDIT DISH MODAL */}
      <Dialog open={editDishOpen} onClose={() => setEditDishOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Dish</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <TextField label="Name" fullWidth value={dishName} onChange={(e) => setDishName(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDishOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDish} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT INGREDIENT MODAL */}
      <Dialog open={editIngOpen} onClose={() => setEditIngOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <TextField label="Name" fullWidth value={ingValue} onChange={(e) => setIngValue(e.target.value)} />
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