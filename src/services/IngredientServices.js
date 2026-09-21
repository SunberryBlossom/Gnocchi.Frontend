import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

export async function getAllIngredients() {
  const response = await api.get('Ingredients')
  return response.data
}

export async function createIngredient(dto) {
  const response = await api.post('Ingredients', {
    Name: dto.name,
    ScoreId: dto.scoreId,
    EdibleRaw: dto.edibleRaw || false
  })
  return response.data
}

export async function updateIngredient(ingredientId, newName) {
  const response = await api.patch('Ingredients', {
    IngredientId: ingredientId,
    Attribute: 'name',
    NewValue: newName
  })
  return response.data
}

export async function deleteIngredient(ingredientId) {
  await api.delete('Ingredients', {
    data: { IngredientId: ingredientId }
  })
}