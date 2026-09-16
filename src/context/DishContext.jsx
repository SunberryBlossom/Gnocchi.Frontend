

export const DishContext = createContext()

export const DishProvider = ({ children }) => {
    const [dishes, setDishes] = useState([])

    async function getDishList() {
        try {
            const response = await getAllDishes()
            setDishes(response.data)
        } catch (error) {
            console.error('Error fetching dishes:', error)
        }
    }

    useEffect(() => {
        getDishList()
    }, [])

    return (
        <DishContext.Provider value={{ dishes, getDishList }}>
            {children}
        </DishContext.Provider>
    )
}



