import { Coupon, CouponModel } from "../../models/coupon";
import { ApiResponse } from "../../dto/response/apiResponse";

export const createCoupon = async (coupon: Coupon) => {
    let response: ApiResponse<Coupon>;

    try {
        const existingCoupon = await CouponModel.findOne({ name: coupon.name });
        if (existingCoupon) {
            return {
                statusCode: 400,
                message: `Coupon with name ${coupon.name} already exists`,
                data: null,
                error: `Duplicate coupon name: ${coupon.name}`,
            };
        }

        // Tạo mới coupon
        const newCoupon = new CouponModel({
            name: coupon.name,
            price: coupon.price,
            isActivated: coupon.isActivated ?? true,
        });

        await newCoupon.save();

        response = {
            statusCode: 201,
            message: 'Coupon created successfully',
            data: newCoupon,
            error: null,
        };
    } catch (error) {
        console.error('Error creating coupon:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};


export const getAllCoupon = async () => {
    let response: ApiResponse<Coupon[]>;

    try {
        const coupons = await CouponModel.find();

        response = {
            statusCode: 200,
            message: 'Coupons retrieved successfully',
            data: coupons,
            error: null,
        };
    } catch (error) {
        console.error('Error retrieving coupons:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};
