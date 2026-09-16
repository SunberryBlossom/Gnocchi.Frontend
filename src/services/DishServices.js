import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',

})

const getAllDishes = async () => {
    const response = await api.get('dishes')
    return response.data
}

const getDishById = async id => {
    const response = await api.get(`dishes/${id}`)
    return response.data
}

const createDish = async dish => {
    const response = await api.post('dishes', dish)
    return response.data
}

const updateDish = async (id, newValue) => {
    const response = await api.put(`dishes/${id}`, newValue)
    return response.data
}

const deleteDish = async id => {
    const response = await api.delete(`dishes/${id}`)
    return response.data
}

export { getAllDishes, getDishById, createDish, updateDish, deleteDish };