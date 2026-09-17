import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',
    withCredentials: true,
})

const getAllIngredients = async () => {
    const response = await api.get('ingredients')
    return response.data
}

const getIngredientById = async id => {
    const response = await api.get(`ingredients/${id}`)
    return response.data
}

const createIngredient = async ingredient => {
    const response = await api.post('ingredients', ingredient)
    return response.data
}

const updateIngredient = async (id, newValue, attribute) => {
    const response = await api.put(`ingredients/${id}`, { NewValue: newValue, Attribute: attribute })
    return response.data
}

const deleteIngredient = async id => {
    const response = await api.delete(`ingredients/${id}`)
    return response.data
}

export { getAllIngredients, getIngredientById, createIngredient, updateIngredient, deleteIngredient };