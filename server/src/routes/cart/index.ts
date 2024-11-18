import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as cartController from "../../controllers/cart/cartController";

const router = express.Router();

export default (): express.Router => {
    router.get("", checkAuth, cartController.getCarts);
    router.post("", checkAuth, cartController.addToCart);
    router.put("/update", checkAuth, cartController.updateCart);
    return router;
}