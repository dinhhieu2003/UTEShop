import express from "express";
import * as loginService from "../services/loginService";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const jwtResponse = await loginService.login(email, password);
        res.json(jwtResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}