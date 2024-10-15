import mongoose from "mongoose";

export interface Order extends mongoose.Document {
    products: { productId: mongoose.Schema.Types.ObjectId, quantity: number }[]; // List of products with quantity
    totalPrice: number;
    status: string; // Enum status
    createdAt: Date;
}

// Define the OrderSchema
const OrderSchema = new mongoose.Schema<Order>({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            "place order", 
            "confirmed", 
            "packaging", 
            "delivering", 
            "success delivery", 
            "cancel order"
        ],
        default: "place order", // Default status when creating a new order
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
        required: true
    }
});

// Middleware to restrict cancellation within 30 minutes of order placement
OrderSchema.pre('save', function (next) {
    const order = this;

    // If the order is being canceled, check if it's within 30 minutes of creation
    if (order.isModified('status') && order.status === 'cancel order') {
        const now = new Date();
        const timeDifference = now.getTime() - order.createdAt.getTime();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

        if (timeDifference > thirtyMinutes) {
            return next(new Error('Orders can only be canceled within 30 minutes of placement.'));
        }
    }

    next();
});

export const OrderModel = mongoose.model<Order>("Order", OrderSchema);