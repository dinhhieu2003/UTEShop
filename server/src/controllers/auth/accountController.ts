import express from "express";
import jwt from "jsonwebtoken";
import * as userService from "../../services/users/userService";

export const fetchAccount = (request: express.Request, response: express.Response) => {
    const authHeader = request.headers["authorization"];
    if(!authHeader) {
        return response.sendStatus(403);
    }
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        console.log("verifying");
        
        if (err) {
            console.log("Error!!");
            return response.sendStatus(403); //invalid token
        }
        let result = await userService.getUserById((decoded as any).id);
        return response.json(result);
      });
}