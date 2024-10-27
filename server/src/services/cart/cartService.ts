import { ApiResponse } from "../../dto/response/apiResponse";
import { ProductModel } from "../../models/product";
import { IUser, UserModel } from "../../models/user"

export const addToCart = async (userId: string, productId: string) => {
    let response: ApiResponse<any>;
    try {
        const currentUser = await UserModel.findById(userId);
        const product = await ProductModel.findById(productId);
        if (!currentUser.cart) {
            currentUser.cart = { products: [], totalPrice: 0 };
        }
        currentUser.cart.products.push(productId);
        currentUser.cart.totalPrice += product.price;
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