import { ICartItem } from "../../dto/response/types";
import { ApiResponse } from "../../dto/response/apiResponse";
import { UserModel } from "../../models/user";
import { ProductModel } from "../../models/product";
import mongoose from "mongoose";
import { OrderModel } from "../../models/order";

export const createOrder = async (userId: string, cartItems: ICartItem[]) => {
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

        const products = [];
        let totalPrice = 0;

        for (const item of cartItems) {
            const product = await ProductModel.findById(item.id);
            if (!product) {
                return {
                    statusCode: 404,
                    message: `Product with id ${item.id} not found`,
                    data: null,
                    error: `Product with id ${item.id} not found`
                };
            }

            totalPrice += item.price * item.quantity;
            products.push({
                productId: new mongoose.Types.ObjectId(item.id),
                quantity: item.quantity
            });
        }

        const newOrder = new OrderModel({
            products: products,
            totalPrice: totalPrice,
            status: "place order",
            createdAt: new Date()
        });

        await newOrder.save();

        response = {
            statusCode: 201,
            message: 'Order created successfully',
            data: newOrder,
            error: null
        };

    } catch (error) {
        console.error('Error creating order:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }

    return response;
};