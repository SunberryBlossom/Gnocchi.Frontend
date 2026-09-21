import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

export async function getAllResults() {
  const response = await api.get('Results')
  return response.data
}

export async function createResult(dto) {
  const response = await api.post('Results', {
    Comment: dto.comment || dto.notes,
    CookingMethodId: dto.cookingMethodId,
    IngredientId: dto.ingredientId
  })
  return response.data
}

export async function deleteResult(resultId) {
  await api.delete('Results', {
    data: { ResultId: resultId }
  })
}