import mongoose from "mongoose";

export interface Review extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    content: string;
    images: string[];
    rate: number;
}

const ReviewSchema = new mongoose.Schema<Review>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5  
    }
});

export const ReviewModel = mongoose.model<Review>("Review", ReviewSchema);