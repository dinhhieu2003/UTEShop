import mongoose from "mongoose";

export interface Product extends mongoose.Document {
    categoryId: mongoose.Schema.Types.ObjectId;  // Reference to Category model
    name: string;
    description: string;
    price: string;
    images: string[];
    stock: number;
    isActivated: boolean;
    information: string;
    reviews: mongoose.Schema.Types.ObjectId[];
}

const ProductSchema = new mongoose.Schema<Product>({
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
        required: true
    },
    price: {
        type: String,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"  
        }
    ]
});

export const ProductModel = mongoose.model<Product>("Product", ProductSchema);