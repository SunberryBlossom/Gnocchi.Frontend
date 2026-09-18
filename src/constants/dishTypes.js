export const DISH_TYPES = [
  { value: 0, label: 'Vegetarisk' },
  { value: 1, label: 'Vegansk' },
  { value: 2, label: 'Pescetarisk' },
  { value: 3, label: 'LCHF' },
  { value: 4, label: 'Utan lök' },
  { value: 5, label: 'Glutenfri' },
  { value: 6, label: 'Laktosfri' },
  { value: 7, label: 'Keto' }
]

export const getDishTypeLabel = (value) => {
  const match = DISH_TYPES.find((t) => t.value === value)
  return match ? match.label : `Typ #${value}`
}