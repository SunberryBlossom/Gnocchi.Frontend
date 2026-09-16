import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',

})

const getAllScores = async () => {
    const response = await api.get('scores')
    return response.data
}

const getScoreById = async id => {
    const response = await api.get(`scores/${id}`)
    return response.data
}

const createScore = async score => {
    const response = await api.post('scores', score)
    return response.data
}

const deleteScore = async id => {
    const response = await api.delete(`scores/${id}`)
    return response.data
}

export { getAllScores, getScoreById, createScore, deleteScore };