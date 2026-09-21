import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

async function Signin(email, password) {
        await api.post('login?useCookies=true', { email, password,})
}

async function Signout() {
    await api.post('api/auth/logout')
}

async function Signup(email, password) {
  const response = await api.post('register', { email, password })
  
  await Signin(email, password)
  
  return response
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
export { Signin, CheckAuth, Signup, Signout }