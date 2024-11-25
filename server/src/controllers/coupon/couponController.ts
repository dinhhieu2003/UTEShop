import express from "express";
import * as couponService from "../../services/coupon/couponService";
import { broadcast } from "../../services/notification/notification";
import { UserModel } from "../../models/user";
import { sendEmail } from "../../utils/sendEmail";

export const createCoupon = async(request: express.Request, response: express.Response) => {
    try {
        const coupon = request.body;
        const couponResponse = await couponService.createCoupon(coupon);
        if(coupon.statusCode == 201) {
            broadcast(null, {
                type: "COUPON NOTIFICATION",
                payload: `Có một mã giảm giá mới nè: ${couponResponse.data.name}`
            });
            const users = await UserModel.find({ role: "customer" });
            users.forEach(async (user) => {
                await sendEmail(user.email, "NEW COUPON !!", "", `Vừa có coupon mới tên ${couponResponse.data.name}`);
            });
        }
        response.json(couponResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const getAllCoupon = async(request: express.Request, response: express.Response) => {
    try {
        const couponResponse = await couponService.getAllCoupon();
        response.json(couponResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}