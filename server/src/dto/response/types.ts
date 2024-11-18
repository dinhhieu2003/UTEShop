export interface IGetProduct {
    id: string,
    categoryName: string,
    name: string,
    image: string,
    price: number,
    inventoryStatus: string,
    rating: number;
}

export type IGetOneProduct = {
    id: string,
    categoryName: string,
    description: string,
    name: string,
    images: string[],
    price: number,
    inventoryStatus: string,
    rating: number,
    stock: number;
}

export type ICartItem = {
    id: string,
    image: string,
    name: string,
    quantity: number,
    available: number,
    price: number
}

export type IGetCart = {
    cartItems: ICartItem[],
}