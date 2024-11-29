import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import { Product, ProductModel, ProductSchema } from "../models/product";

export interface IUser extends mongoose.Document {
    fullName: string;
    email: string;
    password: string;
    otp: string;
    address: IAddress;
    isActivated: boolean;
    createdAt: Date;
    role: string;
    cart: ICart;
    orders: mongoose.Schema.Types.ObjectId[];
    comparePassword: (password: string) => boolean;
}

interface ICart {
    products: IProduct[];
    totalPrice: number;
}

interface IProduct {
    product: Product;
    quantity: number;
}

export interface IAddress {
    address: string;
    city: string;
    country: string;
    telephone: string;
}

const IProductSchema = new mongoose.Schema<IProduct>({
    product: {
        type: ProductSchema,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const CartSchema = new mongoose.Schema<ICart>({
    products: {
        type: [IProductSchema],
        required: true,
        default: []
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, { _id: false });

const UserSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false,
        expires: '5m'
    },
    address: {
        address: { type: String, required: false },
        city: { type: String, required: false },
        country: { type: String, required: false },
        telephone: { type: String, required: false },
    },
    isActivated: {
        type: Boolean,
        required: false,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        required: true,
    },
    cart: {
        type: CartSchema,
        required: false,
        default: () => ({ products: [], totalPrice: 0 })
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ]
});

//hash the password before the user is saved
UserSchema.pre('save', function(next) {
    const user = this;

    // Hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.password);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);