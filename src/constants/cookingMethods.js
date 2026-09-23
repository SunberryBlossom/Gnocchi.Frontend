export const COOKING_METHODS = [
  { value: 0, label: 'Seared' },
  { value: 1, label: 'Boiled' },
  { value: 2, label: 'Grilled' },
  { value: 3, label: 'Raw' },
  { value: 4, label: 'Baked' },
  { value: 5, label: 'Roasted' },
  { value: 6, label: 'Steamed' },
  { value: 7, label: 'Fried' },
  { value: 8, label: 'Sous Vide' },
  { value: 9, label: 'Braised' },
  { value: 10, label: 'Poached' },
  { value: 11, label: 'Smoked' }
]

export const getMethodLabel = (enumValue) => {
  const match = COOKING_METHODS.find((m) => m.value === enumValue)
  return match ? match.label : `Method #${enumValue}`
}