import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router'
import { LoginPage } from './pages/LoginPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MissingPage } from './pages/MissingPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='*' element={<MissingPage />} />
    </Routes>
  )
}

export default App