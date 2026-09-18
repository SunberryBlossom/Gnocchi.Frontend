import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5253/api/',
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