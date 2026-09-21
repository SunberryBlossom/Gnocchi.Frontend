import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

export async function getAllScores() {
  const response = await api.get('scores')
  return response.data
}

export async function getScoreById(id) {
  const response = await api.get(`scores/${id}`)
  return response.data
}

export async function createScore(score) {
  const response = await api.post('scores', score)
  return response.data
}

export async function deleteScore(id) {
  await api.delete('scores', {
    data: { ScoreId: id }
  })
}