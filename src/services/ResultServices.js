import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',

})

const getAllResults = async () => {
    const response = await api.get('results')
    return response.data
}

const getResultById = async id => {
    const response = await api.get(`results/${id}`)
    return response.data
}

const createResult = async result => {
    const response = await api.post('results', result)
    return response.data
}

const deleteResult = async id => {
    const response = await api.delete(`results/${id}`)
    return response.data
}

export { getAllResults, getResultById, createResult, deleteResult };