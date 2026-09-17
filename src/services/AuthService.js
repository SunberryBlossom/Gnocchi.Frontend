import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5253/',
    withCredentials: true,
})

async function Signin(email, password) {
        await api.post('login?useCookies=true', { email, password,})
}

async function CheckAuth() {
    try {
        await api.get('manage/info')
        return true
    } catch (error) {
        if (error.response.status === 401) {
            return false
        }
    }
}
export { Signin, CheckAuth }