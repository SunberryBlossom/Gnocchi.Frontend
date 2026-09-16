import './App.css'
import { DishProvider } from './context/DishContext'
import DishList from './components/DishList'
import DishCreate from './components/DishCreate'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <h1>Welcome to the Gnocchi App</h1>
      </header>
      <DishProvider>
        <DishList />
        <DishCreate />
      </DishProvider>
    </>
  )
}

export default App
