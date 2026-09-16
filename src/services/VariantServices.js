import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',

})

const getAllVariants = async () => {
    const response = await api.get('variants')
    return response.data
}

const getVariantById = async id => {
    const response = await api.get(`variants/${id}`)
    return response.data
}

const createVariant = async variant => {
    const response = await api.post('variants', variant)
    return response.data
}

const deleteVariant = async id => {
    const response = await api.delete(`variants/${id}`)
    return response.data
}

export { getAllVariants, getVariantById, createVariant, deleteVariant };