import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5253/api/',
  withCredentials: true
})

export async function getAllCookingMethods() {
  const response = await api.get('CookingMethods')
  return response.data
}

export async function createCookingMethod(dto) {
  const response = await api.post('CookingMethods', {
    Method: dto.method,
    ScoreId: dto.scoreId
  })
  return response.data
}

export async function deleteCookingMethod(id) {
  await api.delete('CookingMethods', {
    data: { CookingMethodId: id }
  })
}