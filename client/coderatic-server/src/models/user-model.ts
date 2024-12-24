import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
	first_name?: string;
	last_name?: string;
	username: string;
	email: string;
	hashed_password?: string;
	profile_picture?: string;
	oauth_id?: string;
	resetCode?: string;
	role: number;
	resetPasswordLink?: string;
	authenticate: (plainText: string) => boolean;
	hashPassword: (password: string) => string;

	// Mode of authentication
	authMethod: "local" | "oauth";
}

const UserSchema = new mongoose.Schema<IUser>(
	{
		first_name: String,
		last_name: String,
		username: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true,
			max: 32,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			index: true,
			lowercase: true,
			max: 32,
		},
		hashed_password: {
			type: String,
			required: function () {
				return this.authMethod === "local";
			},
		},
		profile_picture: {
			type: String,
			default: function () {
				return `https://ui-avatars.com/api/?name=${this.username}&background=random&length=1&rounded=true`;
			},
		},
		oauth_id: {
			type: String,
			unique: true,
			required: function () {
				return this.authMethod === "oauth";
			},
		},
		resetCode: {
			type: String,
			default: "",
		},
		role: {
			type: Number,
			default: 0,
		},
		resetPasswordLink: {
			type: String,
			default: "",
		},
		authMethod: {
			type: String,
			enum: ["local", "oauth"],
			required: true,
		},
	},
	{ timestamps: true, collection: "user" }
);

UserSchema.methods = {
	authenticate: function (plainText: string) {
		const salt = this.hashed_password.slice(0, 29); // Get the first 29 characters (the salt) from the hashed password
		const hash = bcrypt.hashSync(plainText, salt); // Hash the plain text password using the salt
		return hash === this.hashed_password;
	},

	hashPassword: function (password: string) {
		if (!password) return "";
		try {
			const salt = bcrypt.genSaltSync(12); // Generate a salt
			const hash = bcrypt.hashSync(password, salt); // Generate a hashed password
			return hash;
		} catch (error) {
			console.error(error);
			return "";
		}
	},
};

UserSchema.virtual("password")
	.set(function (password: string) {
		this.hashed_password = this.hashPassword(password);
	})
	.get(function () {
		return this.hashed_password;
	});
export default mongoose.model<IUser>("User", UserSchema);
export { IUser };
