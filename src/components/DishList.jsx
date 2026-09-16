import { getScoreById } from '../services/ScoreServices'
import { getVariantById } from '../services/VariantServices'
import { getAllDishes, deleteDish } from '../services/DishServices'
import { useContext, useState } from 'react'
import { DishContext } from '../context/DishContext'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Button from '@mui/material/Button';

export default function DishList() {
    const { getDishList, dishes } = useContext(DishContext)


    const handleDelete = async (id) => {
        try {
            await deleteDish(id)
            await getDishList()
        } catch (error) {
            console.error('Error deleting dish:', error)
        }
    }

    return (
        <>
            <h1>Your Dish List</h1>
            <ul>
                {dishes.map(dish => (
                    <li key={dish.id}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {dish.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {getVariantById(dish.variantId).then(variant => variant.Type).catch(() => 'Unknown Variant')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {getScoreById(dish.scoreId).then(score => score.Rating).catch(() => 'Unknown Score')}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <Button variant="contained" color="primary" onClick={() => handleDelete(dish.DishId)}>
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    )
}