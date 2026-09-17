import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5253/api/',
    withCredentials: true,
})

async function signin(email, password) {
    try {
        const response = await api.post('login?useCookies=true', { email, password })
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Signin failed')
    }
}