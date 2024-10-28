import express from "express";
import * as cartService from "../../services/cart/cartService"
import { getCurrentId } from "../../controllers/auth/accountController";
import mongoose from "mongoose";

export const addToCart = async (request: express.Request, response: express.Response) => {
    try {
        const { productId, quantity } = request.body;
        const product = {productId: productId, quantity: quantity};

        const userId = await getCurrentId(request);
        const cartResponse = await cartService.addToCart(userId, product);
        response.json(cartResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}