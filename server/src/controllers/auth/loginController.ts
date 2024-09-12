import express from "express";
import * as loginService from "../../services/auth/loginService";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const loginResponse = await loginService.login(email, password);
        res.json(loginResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

}