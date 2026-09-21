import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

export async function getAllRecipeSteps() {
  const response = await api.get('RecipeStep')
  return response.data
}

export async function getRecipeStepById(id) {
  const response = await api.get(`RecipeStep/${id}`)
  return response.data
}

export async function createRecipeStep(dto) {
  const response = await api.post('RecipeStep', {
    DishId: dto.dishId || dto.DishId,
    ResultId: dto.resultId || dto.ResultId
  })
  return response.data
}

export async function deleteRecipeStep(id) {
  await api.delete('RecipeStep', {
    data: { RecipeStepId: id }
  })
}