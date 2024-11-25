import express from "express";
import { getCurrentId } from "../../controllers/auth/accountController";
import * as userService from "../../services/users/userService";

export const getAllUsers = async (request: express.Request, response: express.Response) => {
    try {
        const result = await userService.getAllUsers();
        return response.json(result);
    } catch (error) {
        console.error("Token verification error:", error);
        return response.sendStatus(403);
    }
};

export const getAddress = async (request: express.Request, response: express.Response) => {
    try {
        const userId = await getCurrentId(request);
        const addressResponse = await userService.getAddress(userId);
        response.json(addressResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const updateUser = async (request: express.Request, response: express.Response) => {
    try {
        const user = request.body;
        const userResponse = await userService.updateUser(user);
        response.json(userResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}