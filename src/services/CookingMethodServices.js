import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',

})

const getAllCookingMethods = async () => {
    const response = await api.get('cookingmethods')
    return response.data
}

const getCookingMethodById = async id => {
    const response = await api.get(`cookingmethods/${id}`)
    return response.data
}

const createCookingMethod = async cookingMethod => {
    const response = await api.post('cookingmethods', cookingMethod)
    return response.data
}

const updateCookingMethod = async (id, scoreId) => {
    const response = await api.put(`cookingmethods/${id}`, scoreId)
    return response.data
}

const deleteCookingMethod = async id => {
    const response = await api.delete(`cookingmethods/${id}`)
    return response.data
}

export { getAllCookingMethods, getCookingMethodById, createCookingMethod, updateCookingMethod, deleteCookingMethod };