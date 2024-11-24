import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as couponController from "../../controllers/coupon/couponController";

const router = express.Router();

export default (): express.Router => {
    router.post("", checkAuth, couponController.createCoupon);
    router.get("", couponController.getAllCoupon);
    return router;
}