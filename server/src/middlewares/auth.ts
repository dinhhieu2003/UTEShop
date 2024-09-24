import express from "express";
import jwt from "jsonwebtoken";

export const checkAuth = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const authHeader = request.headers["authorization"];
    if(!authHeader) {
        return response.sendStatus(403);
    }
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log("verifying");
        if (err) {
            return response.sendStatus(403); //invalid token
        } 
        console.log(decoded); //for correct token
        next();
      });
}