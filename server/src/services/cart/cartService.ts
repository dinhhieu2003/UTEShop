import mongoose from "mongoose";
import { ApiResponse } from "../../dto/response/apiResponse";
import { ProductModel } from "../../models/product";
import { IUser, UserModel } from "../../models/user"
import { ICartItem, IGetCart } from "dto/response/types";

export const addToCart = async (userId: string, product: any) => {
    let response: ApiResponse<any>;
    try {
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
                error: 'User not found'
            };
        }

        const currentProduct = await ProductModel.findById(product.productId);
        if (!currentProduct) {
            return {
                statusCode: 404,
                message: 'Product not found',
                data: null,
                error: 'Product not found'
            };
        }

        const cartProduct = currentUser.cart.products.find(
            (item: any) => item.product._id.toString() === product.productId
        );

        if (cartProduct) {
            cartProduct.quantity += product.quantity;
        } else {
            const productInCart = { product: currentProduct, quantity: product.quantity };
            currentUser.cart.products.push(productInCart);
        }

        currentUser.cart.totalPrice += currentProduct.price * product.quantity;

        await currentUser.save();

        response = {
            statusCode: 200,
            message: 'Product added to cart successfully',
            data: currentUser.cart,
            error: null
        };

    } catch (error) {
        console.error('Error adding product to cart:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }

    return response;
};

export const updateCart = async (userId: string, cartItems: ICartItem[]) => {
    let response: ApiResponse<any>;

    try {
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
                error: 'User not found'
            };
        }

        let totalPrice = 0;

        const updatedProducts = [];
        for (const item of cartItems) {
            const currentProduct = await ProductModel.findById(item.id);

            if (!currentProduct) {
                return {
                    statusCode: 404,
                    message: `Product not found for id: ${item.id}`,
                    data: null,
                    error: `Product with id: ${item.id} not found`
                };
            }

            if (item.quantity > currentProduct.stock) {
                return {
                    statusCode: 400,
                    message: `Quantity exceeds available stock for product: ${currentProduct.name}`,
                    data: null,
                    error: `Requested quantity exceeds available stock for product: ${currentProduct.name}`
                };
            }

            updatedProducts.push({
                product: currentProduct,
                quantity: item.quantity
            });

            totalPrice += currentProduct.price * item.quantity;
        }

        currentUser.cart.products = updatedProducts;
        currentUser.cart.totalPrice = totalPrice;

        await currentUser.save();

        response = {
            statusCode: 200,
            message: 'Cart updated successfully',
            data: currentUser.cart,
            error: null
        };
    } catch (error) {
        console.error('Error updating cart:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }

    return response;
};

export const getCarts = async(userId: string) => {
    let response: ApiResponse<any>;
    try {
        const currentUser = await UserModel.findById(userId);
        const currentCart = currentUser.cart;
        let cartItems: ICartItem[] = [];
        currentCart.products.forEach((iProduct) => {
            if (iProduct.quantity <= iProduct.product.stock) {  // Only add if quantity is less than or equal to available stock
                let cartItem: ICartItem = {
                    id: iProduct.product.id,
                    image: iProduct.product.images[0],
                    name: iProduct.product.name,
                    quantity: iProduct.quantity,
                    available: iProduct.product.stock,
                    price: iProduct.product.price
                };
                cartItems.push(cartItem);
            }
        })
        const cartData: IGetCart = {
            cartItems: cartItems
        }
        response = {
            statusCode: 200,
            message: 'Get cart successfully',
            data: cartData,
            error: null
        }
    } catch(error) {
        console.error('Error get cart:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }
    return response;
}