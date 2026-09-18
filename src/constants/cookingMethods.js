export const COOKING_METHODS = [
  { value: 0, label: 'Sotad / Stekt (Seared)' },
  { value: 1, label: 'Kokt (Boiled)' },
  { value: 2, label: 'Grillad (Grilled)' },
  { value: 3, label: 'Rå (Raw)' },
  { value: 4, label: 'Bakad (Baked)' },
  { value: 5, label: 'Rostad (Roasted)' },
  { value: 6, label: 'Ångkokt (Steamed)' },
  { value: 7, label: 'Friterad / Stekt (Fried)' },
  { value: 8, label: 'Sous Vide' },
  { value: 9, label: 'Bräserad (Braised)' },
  { value: 10, label: 'Sjuden / Poscherad (Poached)' },
  { value: 11, label: 'Rökt (Smoked)' }
]

export const getMethodLabel = (enumValue) => {
  const match = COOKING_METHODS.find((m) => m.value === enumValue)
  return match ? match.label : `Metod #${enumValue}`
}