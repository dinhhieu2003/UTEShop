import mongoose from "mongoose";

export interface Category extends mongoose.Document {
    name: string;
    isActivated: boolean;
    products: mongoose.Schema.Types.ObjectId[];
}

const CategorySchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: true, // Default value for activation
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product"
        }
    ]
});

export const CategoryModel = mongoose.model<Category>("Category", CategorySchema);