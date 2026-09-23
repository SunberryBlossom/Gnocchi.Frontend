export const DISH_TYPES = [
  { value: 0, label: 'Vegetarian' },
  { value: 1, label: 'Vegan' },
  { value: 2, label: 'Pescetarian' },
  { value: 3, label: 'LCHF' },
  { value: 4, label: 'No onions' },
  { value: 5, label: 'Gluten free' },
  { value: 6, label: 'Lactose free' },
  { value: 7, label: 'Keto' }
]

export const getDishTypeLabel = (value) => {
  const match = DISH_TYPES.find((t) => t.value === value)
  return match ? match.label : `Typ #${value}`
}