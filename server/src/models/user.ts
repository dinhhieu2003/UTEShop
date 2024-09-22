import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

interface IUser extends mongoose.Document {
    fullName: string;
    email: string;
    password: string;
    otp: string;
    address: string;
    isActivated: boolean;
    role: string;
    comparePassword: (password: string) => boolean;
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
        expires: 60 * 5
    },
    address: {
        type: String,
        required: false
    },
    isActivated: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
      },
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
