import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
  Paper,
  ListItemText
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import RateReviewIcon from '@mui/icons-material/RateReview'
import CategoryIcon from '@mui/icons-material/Category'

import { createIngredient, getAllIngredients } from '../services/IngredientServices'
import { createCookingMethod, getAllCookingMethods } from '../services/CookingMethodServices'
import { createResult, getAllResults } from '../services/ResultServices'
import { createDish } from '../services/DishServices'
import { createVariant, getAllVariants } from '../services/VariantServices'
import { createRecipeStep } from '../services/RecipeStepServices'
import { COOKING_METHODS, getMethodLabel } from '../constants/cookingMethods'
import { DISH_TYPES, getDishTypeLabel } from '../constants/dishTypes'
import { getScoreId } from '../constants/scores'

export function AddLogPage() {
  const navigate = useNavigate()

  const [category, setCategory] = useState('result')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Dropdown & Fetch states
  const [ingredients, setIngredients] = useState([])
  const [methods, setMethods] = useState([])
  const [variants, setVariants] = useState([])
  const [resultsList, setResultsList] = useState([])

  // Dynamic Form states matching backend DTOs
  const [ingredientName, setIngredientName] = useState('')
  const [edibleRaw, setEdibleRaw] = useState(false)

  const [methodEnum, setMethodEnum] = useState(0)

  // Variant state
  const [variantName, setVariantName] = useState('')
  const [variantType, setVariantType] = useState(0)

  // Dish state
  const [dishName, setDishName] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  const [selectedResults, setSelectedResults] = useState([]) // Valda ResultId-strängar

  // Result state
  const [selectedIngredient, setSelectedIngredient] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(3)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true)
      const [ingData, methodData, variantData, resultData] = await Promise.allSettled([
        getAllIngredients(),
        getAllCookingMethods(),
        getAllVariants(),
        getAllResults()
      ])

      setIngredients(ingData.status === 'fulfilled' ? ingData.value || [] : [])
      setMethods(methodData.status === 'fulfilled' ? methodData.value || [] : [])
      setVariants(variantData.status === 'fulfilled' ? variantData.value || [] : [])
      setResultsList(resultData.status === 'fulfilled' ? resultData.value || [] : [])

      console.log('Jämförelse av första elementen:', {
        resultat: resultData.value?.[0],
        ingrediens: ingData.value?.[0],
        method: methodData.value?.[0]
      })
    } catch (err) {
      console.error('Kunde inte hämta data:', err)
    } finally {
      setInitialLoading(false)

    }
  }

  const getIngredientName = (resultOrId) => {
    if (!resultOrId) return 'Unknown ingredient'

    const targetId = typeof resultOrId === 'object'
      ? (resultOrId.ingredientId || resultOrId.IngredientId)
      : resultOrId

    if (!targetId) return 'Unknown ingredient'

    const targetStr = String(targetId).trim().toLowerCase()

    const found = ingredients.find((i) => {
      const id = i.ingredientId || i.IngredientId || i.id
      return id && String(id).trim().toLowerCase() === targetStr
    })

    return found ? (found.name || found.Name) : 'Unknown ingredient'
  }

  const getMethodText = (resultOrId) => {
    if (!resultOrId) return 'Unknown method'

    const targetId = typeof resultOrId === 'object'
      ? (resultOrId.cookingMethodId || resultOrId.CookingMethodId)
      : resultOrId

    if (!targetId) return 'Unknown method'

    const targetStr = String(targetId).trim().toLowerCase()

    const found = methods.find((m) => {
      const id = m.cookingMethodId || m.CookingMethodId || m.id
      return id && String(id).trim().toLowerCase() === targetStr
    })

    if (!found) return 'Unknown method'

    const methodEnumValue = found.method !== undefined ? found.method : found.Method
    return getMethodLabel(methodEnumValue)
  }

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory)
      setMessage({ type: '', text: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const scoreId = getScoreId(rating)

    try {
      if (category === 'ingredient') {
        await createIngredient({
          name: ingredientName,
          edibleRaw: edibleRaw,
          scoreId: scoreId
        })
        setIngredientName('')
        setEdibleRaw(false)
      } else if (category === 'method') {
        await createCookingMethod({
          method: Number(methodEnum),
          scoreId: scoreId,
          resultIds: []
        })
      } else if (category === 'variant') {
        await createVariant({
          name: variantName,
          type: Number(variantType),
          dishIds: []
        })
        setVariantName('')
        setVariantType(0)
      } else if (category === 'dish') {
        if (!selectedVariant) throw new Error('You must pick a variant for the dish.')

        const createdDish = await createDish({
          name: dishName,
          variantId: selectedVariant,
          scoreId: scoreId,
          recipeStepIds: []
        })

        const newDishId = createdDish?.dishId || createdDish?.DishId || createdDish?.id

        if (selectedResults.length > 0 && newDishId) {
          await Promise.all(
            selectedResults.map((resId) =>
              createRecipeStep({
                dishId: newDishId,
                resultId: resId
              })
            )
          )
        }

        setDishName('')
        setSelectedVariant('')
        setSelectedResults([])
      } else if (category === 'result') {
        await createResult({
          comment: comment,
          cookingMethodId: selectedMethod,
          ingredientId: selectedIngredient
        })
        setComment('')
        setSelectedIngredient('')
        setSelectedMethod('')
      }

      setMessage({ type: 'success', text: `Created ${category} successfully!` })
      await fetchInitialData()
    } catch (err) {
      console.error('Error saving:', err)

      const validationErrors = err.response?.data?.errors
      let errorText = err.response?.data?.title || err.message || 'There was an error saving the data.'

      if (validationErrors) {
        const details = Object.entries(validationErrors)
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join(' | ')
        errorText = `Valideringsfel: ${details}`
      }

      setMessage({
        type: 'error',
        text: errorText
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box maxWidth="650px" mx="auto" py={3} px={2}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Food logger - Add new data
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Register new ingredients, cooking methods, dishes, variants, or log results. Use the tabs below to select what you want to add.
      </Typography>

      <Paper elevation={0} sx={{ p: 0.5, bgcolor: 'background.default', mb: 3 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          fullWidth
          color="primary"
          size="small"
        >
          <ToggleButton value="result">
            <RateReviewIcon sx={{ mr: 0.5 }} /> Result
          </ToggleButton>
          <ToggleButton value="ingredient">
            <LocalGroceryStoreIcon sx={{ mr: 0.5 }} /> Ingredient
          </ToggleButton>
          <ToggleButton value="method">
            <OutdoorGrillIcon sx={{ mr: 0.5 }} /> Method
          </ToggleButton>
          <ToggleButton value="variant">
            <CategoryIcon sx={{ mr: 0.5 }} /> Variant
          </ToggleButton>
          <ToggleButton value="dish">
            <RestaurantMenuIcon sx={{ mr: 0.5 }} /> Dish
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* INGREDIENT FORM */}
              {category === 'ingredient' && (
                <>
                  <Typography variant="h6" fontWeight="600">
                    Add ingredient
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label="Ingredient name"
                    placeholder="e.g. Rotten eggs"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={edibleRaw}
                        onChange={(e) => setEdibleRaw(e.target.checked)}
                      />
                    }
                    label="Edible raw"
                  />
                  <Divider />
                  <Box>
                    <Typography component="legend" variant="body2" color="text.secondary" mb={1}>
                      Score
                    </Typography>
                    <Rating
                      size="large"
                      value={rating}
                      onChange={(e, val) => setRating(val || 1)}
                    />
                  </Box>
                </>
              )}

              {/* METHOD FORM */}
              {category === 'method' && (
                <>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      Create a cooking method
                    </Typography>
                  </Box>

                  <FormControl fullWidth required>
                    <InputLabel id="method-enum-label">Type of cooking method</InputLabel>
                    <Select
                      labelId="method-enum-label"
                      value={methodEnum}
                      label="Type-of-cooking-method"
                      onChange={(e) => setMethodEnum(e.target.value)}
                    >
                      {COOKING_METHODS.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                          {m.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider />

                  <Box>
                    <Typography component="legend" variant="body2" color="text.secondary" mb={1}>
                      Score
                    </Typography>
                    <Rating
                      size="large"
                      value={rating}
                      onChange={(e, val) => setRating(val || 1)}
                    />
                  </Box>
                </>
              )}

              {/* VARIANT FORM */}
              {category === 'variant' && (
                <>
                  <Typography variant="h6" fontWeight="600">
                    Add variant
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label="Variant name"
                    placeholder="t.ex. Vegan gluten free"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    inputProps={{ maxLength: 150 }}
                  />

                  <FormControl fullWidth required>
                    <InputLabel id="variant-type-label">Dish type</InputLabel>
                    <Select
                      labelId="variant-type-label"
                      value={variantType}
                      label="Dish type"
                      onChange={(e) => setVariantType(e.target.value)}
                    >
                      {DISH_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {/* DISH FORM */}
              {category === 'dish' && (
                <>
                  <Typography variant="h6" fontWeight="600">
                    Add dish
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    label="Dish Name"
                    placeholder="e.g. Cacio e Pepe"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                  />

                  {/* VARIANT DROPDOWN */}
                  <FormControl fullWidth required>
                    <InputLabel id="variant-select-label">Choose Variant</InputLabel>
                    <Select
                      labelId="variant-select-label"
                      value={selectedVariant}
                      label="Pick a Variant"
                      onChange={(e) => setSelectedVariant(e.target.value)}
                    >
                      {variants.map((v) => {
                        const vId = v.variantId || v.VariantId || v.id
                        const vName = v.name || v.Name
                        const vType = v.type !== undefined ? v.type : v.Type
                        const typeLabel = vType !== undefined ? getDishTypeLabel(vType) : 'Unknown type'

                        return (
                          <MenuItem key={vId} value={vId}>
                            {vName ? `${vName} (${typeLabel})` : typeLabel}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>

                  {/* RECIPESTEPS (RESULTAT) DROPDOWN */}
                  <FormControl fullWidth>
                    <InputLabel id="results-select-label">Recipe steps</InputLabel>
                    <Select
                      labelId="results-select-label"
                      multiple
                      value={selectedResults}
                      onChange={(e) => setSelectedResults(e.target.value)}
                      label="Recipe steps"
                      renderValue={(selected) =>
                        resultsList
                          .filter((r) => selected.includes(r.resultId || r.ResultId || r.id))
                          .map((r) => getIngredientName(r))
                          .join(', ')
                      }
                    >
                      {resultsList.map((res) => {
                        const resId = res.resultId || res.ResultId || res.id
                        const isChecked = selectedResults.includes(resId)

                        const ingName = getIngredientName(res)
                        const methLabel = getMethodText(res)
                        const resComment = res.comment || res.Comment || ''

                        return (
                          <MenuItem key={resId} value={resId}>
                            <Checkbox checked={isChecked} />
                            <ListItemText
                              primary={ingName}
                              secondary={`Method: ${methLabel}${resComment ? ` - "${resComment}"` : ''}`}
                            />
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>

                  <Divider />

                  <Box>
                    <Typography component="legend" variant="body2" color="text.secondary" mb={1}>
                      Score
                    </Typography>
                    <Rating
                      size="large"
                      value={rating}
                      onChange={(e, val) => setRating(val || 1)}
                    />
                  </Box>
                </>
              )}

              {/* RESULT FORM */}
              {category === 'result' && (
                <>
                  <Typography variant="h6" fontWeight="600">
                    Log Result
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Select the ingredient and cooking method used, then add any comments or notes about the result.
                  </Typography>
                  <FormControl fullWidth required>
                    <InputLabel id="ing-select-label">Pick ingredient</InputLabel>
                    <Select
                      labelId="ing-select-label"
                      value={selectedIngredient}
                      label="Pick ingredient"
                      onChange={(e) => setSelectedIngredient(e.target.value)}
                    >
                      {ingredients.map((ing) => {
                        const ingId = ing.ingredientId || ing.IngredientId || ing.id
                        const ingName = ing.name || ing.Name
                        return (
                          <MenuItem key={ingId} value={ingId}>
                            {ingName}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel id="method-select-label">Pick cooking method</InputLabel>
                    <Select
                      labelId="method-select-label"
                      value={selectedMethod}
                      label="Pick cooking method"
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    >
                      {methods.map((m) => {
                        const mId = m.cookingMethodId || m.CookingMethodId || m.id
                        const mEnum = m.method !== undefined ? m.method : m.Method
                        return (
                          <MenuItem key={mId} value={mId}>
                            {getMethodLabel(mEnum)}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>

                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Comment / Notes"
                    placeholder="Describe the result, consistency, taste etc."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : `Save ${category}`}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}