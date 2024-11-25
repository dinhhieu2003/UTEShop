import { ICartItem } from "../../dto/response/types";
import express from "express";
import * as orderService from "../../services/order/orderService";
import { getCurrentId } from "../../controllers/auth/accountController";
import { UserModel } from "../../models/user";
import { sendEmail } from "../../utils/sendEmail";
import { broadcast } from "../../services/notification/notification";

export const createOrder = async(request: express.Request, response: express.Response) => {
    try {
        const {cartItems, totalPrice} = request.body;
        const userId = await getCurrentId(request);
        const orderResponse = await orderService.createOrder(userId, cartItems, totalPrice);
        if(orderResponse.statusCode == 201) {
            // Send notification to email userId and all admin
            const user = await UserModel.findById(userId);
            const userEmail = user.email;
            const orderId = orderResponse.data._id || "Unknown Order";
            
            const adminUsers = await UserModel.find({ role: "admin" });
            adminUsers.forEach((admin) => {
                broadcast(admin.email.toString(), {
                    type: "ORDER NOTIFICATION",
                    payload: `${userEmail} vừa đặt một đơn hàng có tổng giá ${totalPrice}`,
                });
            });
            await sendEmail(userEmail, "ORDER UTEShop", "", `Bạn vừa order một đơn hàng có tổng giá ${totalPrice}`);
        }
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

export const getOrder = async(request: express.Request, response: express.Response) => {
    try {
        const {orderId} = request.params;
        const orderResponse = await orderService.getOrder(orderId);
        response.json(orderResponse);
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
