import { ICartItem } from "../../dto/response/types";
import express from "express";
import * as orderService from "../../services/order/orderService";
import { getCurrentId } from "../../controllers/auth/accountController";

export const createOrder = async(request: express.Request, response: express.Response) => {
    try {
        const {cartItems, totalPrice} = request.body;
        const userId = await getCurrentId(request);
        const orderResponse = await orderService.createOrder(userId, cartItems, totalPrice);
        response.json(orderResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const getOrderItems = async(request: express.Request, response: express.Response) => {
    try {
        const {orderId} = request.params;
        const orderItemsResponse = await orderService.getOrderItems(orderId);
        response.json(orderItemsResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const getOrderHistory = async(request: express.Request, response: express.Response) => {
    try {
        const userId = await getCurrentId(request);
        const orderHistoryResponse = await orderService.getOrderHistory(userId);
        response.json(orderHistoryResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const getAllOrdersController = async (request: express.Request, response: express.Response) => {
    try {
        const ordersResponse = await orderService.getAllOrders();
        response.json(ordersResponse); 
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
};
