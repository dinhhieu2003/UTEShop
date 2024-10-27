import express from "express";
import * as cartService from "../../services/cart/cartService"
import { getCurrentId } from "../../controllers/auth/accountController";

export const addToCart = async (request: express.Request, response: express.Response) => {
    try {
        const { productId } = request.body;
        console.log(productId);
        const userId = await getCurrentId(request);
        const cartResponse = await cartService.addToCart(userId, productId);
        response.json(cartResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}