import express from "express";

import * as userService from "../../services/users/userService";
import * as tokenUtils from "../../utils/tokenUtils";


// Controller to fetch the account details of the authenticated user
export const fetchAccount = async (request: express.Request, response: express.Response) => {
    const token = tokenUtils.extractToken(request.headers["authorization"]);
    
    if (!token) {
        return response.sendStatus(403); // Forbidden if no token is provided
    }

    try {
        const decoded = await tokenUtils.verifyToken(token);
        const result = await userService.getUserById((decoded as any).id);
        return response.json(result);
    } catch (error) {
        console.error("Token verification error:", error);
        return response.sendStatus(403); // Forbidden if token verification fails
    }
};

// Utility function to get the current user's ID from the token
export const getCurrentId = async (request: express.Request): Promise<string | null> => {
    const token = tokenUtils.extractToken(request.headers["authorization"]);
    
    if (!token) {
        return null;
    }

    try {
        const decoded = await tokenUtils.verifyToken(token);
        return (decoded as any).id;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
};