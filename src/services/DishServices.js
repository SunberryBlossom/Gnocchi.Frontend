import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5253/api/',
  withCredentials: true
})

export async function getAllDishes() {
  const response = await api.get('Dishes')
  return response.data
}

export async function createDish(dto) {
  const response = await api.post('Dishes', dto)
  return response.data
}

export async function updateDish(dishId, newName) {
  const response = await api.patch('Dishes', {
    DishId: dishId,
    Attribute: 'name',
    NewValue: newName
  })
  return response.data
}

export async function deleteDish(id) {
  await api.delete('Dishes', {
    data: { DishId: id }
  })
}