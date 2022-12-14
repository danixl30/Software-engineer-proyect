export type GetProductDetailResponse = {
    id: string
    name: string
    description: string
    price: number
    currency: string
    existence: number
    categories: string[]
    franchise: {
        name: string
        id: string
    }
    image: string
}
