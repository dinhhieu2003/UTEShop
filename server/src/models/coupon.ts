import mongoose from "mongoose";

export interface Coupon extends mongoose.Document {
    name: string;
    price: number;
    isActivated: boolean;
}

const CouponSchema = new mongoose.Schema<Coupon>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: true,
        required: true
    }
});

export const CouponModel = mongoose.model<Coupon>("Coupon", CouponSchema);