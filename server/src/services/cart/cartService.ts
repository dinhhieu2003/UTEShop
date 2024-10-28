import mongoose from "mongoose";
import { ApiResponse } from "../../dto/response/apiResponse";
import { ProductModel } from "../../models/product";
import { IUser, UserModel } from "../../models/user"

export const addToCart = async (userId: string, product: any) => {
    let response: ApiResponse<any>;
    try {
        const currentUser = await UserModel.findById(userId);
        const currentProduct = await ProductModel.findById(product.productId);
        const productInCart = {product: currentProduct, quantity: product.quantity};
        currentUser.cart.products.push(productInCart);
        currentUser.cart.totalPrice += currentProduct.price * product.quantity;
        await currentUser.save();
        response = {
            statusCode: 200,
            message: 'Product added to cart successfully',
            data: currentUser.cart,
            error: null
        }
        
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
    
}