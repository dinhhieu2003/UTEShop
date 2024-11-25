import mongoose from "mongoose";

export interface Product extends mongoose.Document {
    categoryId: mongoose.Schema.Types.ObjectId;  // Reference to Category model
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    isActivated: boolean;
    information: string;
    reviews: IReview[];
}

export interface IReview {
    userId: mongoose.Schema.Types.ObjectId;
    content: string;
    images: string[];
    rate: number;
}

export const ProductSchema = new mongoose.Schema<Product>({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: true,
        required: true
    },
    information: {
        type: String,
        required: false
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            images: {
                type: [String],
                required: false,
            },
            rate: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
        },
    ],
});
  
export const ProductModel = mongoose.model<Product>("Product", ProductSchema);