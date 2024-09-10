import express from "express";
import * as loginController from "../controllers/loginController";

const loginRoute = express.Router();

export default (): express.Router => {
    loginRoute.post("/", loginController.login);
    return loginRoute;
};
