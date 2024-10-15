import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

export interface IUser extends mongoose.Document {
    fullName: string;
    email: string;
    password: string;
    otp: string;
    address: IAddress;
    isActivated: boolean;
    role: string;
    cart: Cart;
    orders: mongoose.Schema.Types.ObjectId[];
    comparePassword: (password: string) => boolean;
}

interface Cart {
    products: string[];
    totalPrice: number;
}

export interface IAddress {
    address: string;
    city: string;
    country: string;
    telephone: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
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
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        telephone: { type: String, required: true },
    },
    isActivated: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        required: true
    },
    cart: {
        products: { type: [String], required: true },
        totalPrice: { type: Number, required: true },
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ]
})

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

export const UserModel = mongoose.model("User", UserSchema);