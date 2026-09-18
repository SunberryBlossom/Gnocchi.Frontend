import './App.css'
import { Routes, Route } from 'react-router'
import { DishesPage } from './pages/DishesPage.jsx'
import { AddLogPage } from './pages/AddLogPage.jsx'
import { SigninPage } from './pages/SigninPage.jsx'
import { SignupPage } from './pages/SignupPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MissingPage } from './pages/MissingPage.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

function App() {
  return (
    <Routes>
      <Route path='/' element={<SigninPage />} />
      <Route path='/signup' element={<SignupPage />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/add-log' element={<AddLogPage />} />
        <Route path='/dishes' element={<DishesPage />} />
      </Route>
      <Route path='*' element={<MissingPage />} />
    </Routes>
  )
}

export { App }