import { useState, useEffect } from 'react'
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
    CircularProgress
} from '@mui/material'

import { createIngredient, getAllIngredients } from '../services/IngredientServices'
import { createCookingMethod, getAllCookingMethods } from '../services/CookingMethodServices'
import { createResult } from '../services/ResultServices'
import { createDish } from '../services/DishServices'

export function AddLogPage() {
    const [category, setCategory] = useState('result')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [ingredients, setIngredients] = useState([])
    const [methods, setMethods] = useState([])

    const [ingredientName, setIngredientName] = useState('')
    const [methodName, setMethodName] = useState('')
    const [dishName, setDishName] = useState('')

    const [selectedIngredient, setSelectedIngredient] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('')
    const [variationNotes, setVariationNotes] = useState('')
    const [rating, setRating] = useState(3)

    useEffect(() => {
        fetchDropdownData()
    }, [])

    const fetchDropdownData = async () => {
        try {
            const [ingData, methodData] = await Promise.all([
                getAllIngredients(),
                getAllCookingMethods()
            ])
            setIngredients(ingData || [])
            setMethods(methodData || [])
        } catch (err) {
            console.error('Failed to fetch dropdown options:', err)
        }
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

        try {
            if (category === 'ingredient') {
                await createIngredient({ name: ingredientName })
                setIngredientName('')
            } else if (category === 'method') {
                await createCookingMethod({ name: methodName })
                setMethodName('')
            } else if (category === 'dish') {
                await createDish({ name: dishName })
                setDishName('')
            } else if (category === 'result') {
                await createResult({
                    ingredientId: selectedIngredient,
                    cookingMethodId: selectedMethod,
                    notes: variationNotes,
                    score: rating
                })
                setVariationNotes('')
                setSelectedIngredient('')
                setSelectedMethod('')
                setRating(3)
            }

            setMessage({ type: 'success', text: `Successfully saved new ${category}!` })
            fetchDropdownData()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box py={2}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Add to Your Kitchen
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>
                What would you like to create?
            </Typography>

            <ToggleButtonGroup
                value={category}
                exclusive
                onChange={handleCategoryChange}
                fullWidth
                size="small"
                color="primary"
                sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}
            >
                <ToggleButton value="result">Result</ToggleButton>
                <ToggleButton value="ingredient">Ingredient</ToggleButton>
                <ToggleButton value="method">Method</ToggleButton>
                <ToggleButton value="dish">Dish</ToggleButton>
            </ToggleButtonGroup>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {category === 'ingredient' && (
                            <TextField
                                required
                                fullWidth
                                label="Ingredient Name"
                                placeholder="e.g. San Marzano Tomatoes, Guanciale"
                                value={ingredientName}
                                onChange={(e) => setIngredientName(e.target.value)}
                            />
                        )}

                        {category === 'method' && (
                            <TextField
                                required
                                fullWidth
                                label="Cooking Method"
                                placeholder="e.g. Sous-vide, Pan Sear, Roasting"
                                value={methodName}
                                onChange={(e) => setMethodName(e.target.value)}
                            />
                        )}

                        {category === 'dish' && (
                            <TextField
                                required
                                fullWidth
                                label="Dish Name"
                                placeholder="e.g. Potato Gnocchi with Sage Butter"
                                value={dishName}
                                onChange={(e) => setDishName(e.target.value)}
                            />
                        )}

                        {category === 'result' && (
                            <>
                                <FormControl fullWidth required>
                                    <InputLabel>Select Ingredient</InputLabel>
                                    <Select
                                        value={selectedIngredient}
                                        label="Select Ingredient"
                                        onChange={(e) => setSelectedIngredient(e.target.value)}
                                    >
                                        {ingredients.map((ing) => (
                                            <MenuItem key={ing.id} value={ing.id}>
                                                {ing.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required>
                                    <InputLabel>Select Cooking Method</InputLabel>
                                    <Select
                                        value={selectedMethod}
                                        label="Select Cooking Method"
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                    >
                                        {methods.map((method) => (
                                            <MenuItem key={method.id} value={method.id}>
                                                {method.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Variation / Outcome Notes"
                                    placeholder="How did this combination turn out? (e.g. Baked potatoes gave way less moisture)"
                                    value={variationNotes}
                                    onChange={(e) => setVariationNotes(e.target.value)}
                                />

                                <Box>
                                    <Typography component="legend" variant="body2" color="text.secondary">
                                        Outcome Score
                                    </Typography>
                                    <Rating
                                        size="large"
                                        value={rating}
                                        onChange={(e, val) => setRating(val)}
                                    />
                                </Box>
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 1 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : `Save ${category}`}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}