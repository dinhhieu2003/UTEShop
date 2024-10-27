import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as cartController from "../../controllers/cart/cartController";

const router = express.Router();

export default (): express.Router => {
    router.post("", checkAuth, cartController.addToCart);
    return router;
}