import express from "express";
import * as orderController from "../../controllers/order/orderController";
import { checkAuth } from "../../middlewares/auth";

const router = express.Router();

export default (): express.Router => {
    router.post("", checkAuth, orderController.createOrder);
    router.get("/items/:orderId", checkAuth, orderController.getOrderItems);
    router.get("/history", checkAuth, orderController.getOrderHistory);
    return router;
}