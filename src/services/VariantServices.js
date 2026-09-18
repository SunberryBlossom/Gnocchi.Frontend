import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5253/api/',
  withCredentials: true
})

export async function getAllVariants() {
  const response = await api.get('variants')
  return response.data
}

export async function getVariantById(id) {
  const response = await api.get(`variants/${id}`)
  return response.data
}

export async function createVariant(variant) {
  const response = await api.post('variants', variant)
  return response.data
}

export async function deleteVariant(id) {
  await api.delete('variants', {
    data: { VariantId: id }
  })
}