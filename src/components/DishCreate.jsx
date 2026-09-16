import { useState, useContext } from 'react'
import { createDish } from '../services/DishServices'
import { DishContext } from '../context/DishContext'

export default function DishCreate() {
    const [name, setName] = useState('')
    const [variantId, setVariantId] = useState('')
    const [scoreId, setScoreId] = useState('')
    const { getDishList } = useContext(DishContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newDish = { name, variantId, scoreId }
        try {
            await createDish(newDish)
            setName('')
            setVariantId('')
            setScoreId('')
            await getDishList()
        } catch (error) {
            console.error('Error creating dish:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Variant ID:</label>
                <input type="text" value={variantId} onChange={(e) => setVariantId(e.target.value)} required />
            </div>
            <div>
                <label>Score ID:</label>
                <input type="text" value={scoreId} onChange={(e) => setScoreId(e.target.value)} required />
            </div>
            <button type="submit">Create Dish</button>
        </form>
    )
}