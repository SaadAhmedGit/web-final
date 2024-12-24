import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { expressjwt as expressJwt } from "express-jwt";

// sendgrid
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import {
	CLIENT_URI,
	PRE_SIGNUP_TOKEN_AGE,
	TOKEN_AGE,
	COOKIE_AGE,
	COOKIE_SECURE,
	COOKIE_SAME_SITE,
	COOKIE_HTTP_ONLY,
} from "../configs/runtime-envs.config.js";

const preSignUp = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (user) {
			return res.status(400).json({
				error: "Username or email is already taken",
			});
		}

		const token = jwt.sign(
			{ username, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{
				expiresIn: PRE_SIGNUP_TOKEN_AGE,
			}
		);

		const emailData = {
			to: email,
			from: process.env.EMAIL_FROM,
			subject: "Welcome to Coderatic! - Account Activation Link",
			html: `
	  <h4>Please use the following link to activate your account:</h4>
	  <p>${CLIENT_URI}/auth/account/activate/${token}</p>

	  <hr/>
	  <p>This email may contain sensitive information</p>
	  <a href="${CLIENT_URI}">${CLIENT_URI}</a>`,
		};

		sgMail.send(emailData).then((sent) => {
			return res.json({
				message: `
      Email has been sent to ${email}. 
      Follow the instructions to activate your account.`,
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

const signup = async (req, res) => {
	try {
		const { username, email, password } = req.user;

		const user = new User({
			username: username,
			email: email,
			password: password,
			authMethod: "local",
		});
		await user.save();
		return res.json({
			message: "Signup sucessful! Please log in.",
		});
	} catch (err) {
		return res.status(401).json({
			message: err,
		});
	}
};
const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username: username });
		if (!user) {
			return res.status(401).json({
				message: "This username does not exist. Please signup.",
			});
		}
		if (!user.authenticate(password)) {
			return res.status(401).json({
				message: "Username and password do not match.",
			});
		}

		const { _id, email, first_name, last_name, profile_picture, role } =
			user;
		const userData = {
			_id,
			username,
			email,
			first_name,
			last_name,
			profile_picture,
			role,
		};

		const token = jwt.sign(
			{
				_id: userData._id,
				user: {
					username: userData.username,
					email: userData.email,
					profile_picture: userData.profile_picture,
					first_name: userData.first_name,
					last_name: userData.last_name,
					role: userData.role,
				},
			},
			process.env.JWT_SECRET,
			{
				expiresIn: TOKEN_AGE,
			}
		);
		res.cookie("token", token, {
			maxAge: COOKIE_AGE,
			httpOnly: COOKIE_HTTP_ONLY,
			secure: COOKIE_SECURE,
			sameSite: COOKIE_SAME_SITE,
		});

		res.cookie("token_set", true, {
			maxAge: COOKIE_AGE,
			httpOnly: false,
			secure: COOKIE_SECURE,
			sameSite: COOKIE_SAME_SITE,
		});

		return res.json({
			user: userData,
		});
	} catch (err) {
		console.log(err);
	}
};

const logout = (req, res) => {
	try {
		res.clearCookie("token_set");
		res.clearCookie("token");
		res.json({
			message: "Signout success",
		});
	} catch (err) {
		console.log(err);
	}
};

const requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"],
});

const authMiddleWare = (req, res, next) => {
	try {
		const authUserId = req.user._id;
		// based on the user id, query the database and find user
		// then make it available in the request.profile object
		User.findById({ _id: authUserId })
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(400).json({
						error: "User not found",
					});
				}
				req.profile = user;
				// execute callback function so it can be used as a middleware
				next();
			});
	} catch (err) {
		console.log(err);
	}
};

const adminMiddleWare = (req, res, next) => {
	try {
		const adminUserId = req.user._id;
		// based on the user id, query the database and find user
		// then make it available in the request.profile object
		User.findById({ _id: adminUserId })
			.exec()
			.then((user) => {
				if (!user) {
					return res.status(400).json({
						error: "User not found",
					});
				}
				// check if admin
				if (user.role !== 1) {
					return res.status(400).json({
						error: "Admin resource. Access denied",
					});
				}

				req.profile = user;
				next();
			});
	} catch (err) {
		console.log(err);
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		User.findOne({ email }, (err, user) => {
			if (err || !user) {
				return res.status(401).json({
					error: "User with that email does not exist",
				});
			}

			const token = jwt.sign(
				{ _id: user._id },
				process.env.JWT_RESET_PASSWORD,
				{
					expiresIn: "10m",
				}
			);

			const emailData = {
				to: email,
				from: process.env.EMAIL_FROM,
				subject: "Password reset link",
				html: `
          <h4>Please use the following link to reset your password:</h4>
          <p>${CLIENT_URI}/auth/password/reset/${token}</p>
  
          <hr/>
          <p>This email may contain sensitive information</p>
          <a href="${CLIENT_URI}">${CLIENT_URI}</a>
      `,
			};

			return user.updateOne(
				{ resetPasswordLink: token },
				(err, success) => {
					if (err) {
						return res.status(400).json({
							error: err,
						});
					} else {
						sgMail.send(emailData).then((sent) =>
							res.json({
								message: `
                Email has been sent to ${email}. 
                Follow the instructions to reset your password. 
                Link expires in 10min
                `,
							})
						);
					}
				}
			);
		});
	} catch (err) {
		console.log(err);
	}
};

const resetPassword = async (req, res) => {
	try {
		const { resetPasswordLink, newPassword } = req.body;

		// check if you have the reset password
		if (resetPasswordLink) {
			jwt.verify(
				// verify if the token has expired
				resetPasswordLink,
				process.env.JWT_RESET_PASSWORD,
				(err, decoded) => {
					if (err) {
						return res.status(401).json({
							error: "Expired link. Try again",
						});
					}

					// find the user based on reset password link
					User.findOne({ resetPasswordLink }, (err, user) => {
						if (err || !user) {
							return res.status(401).json({
								error: "Something went wrong. Try later",
							});
						}

						// update user fields
						const updatedFields = {
							password: newPassword,
							resetPasswordLink: "",
						};

						user = _.extend(user, updatedFields); // update fields that have changed

						// save user with updated information
						user.save((err, result) => {
							if (err) {
								return res.status(401).json({
									error: err,
								});
							}

							res.json({
								message: `Great! Now you can login with your new password`,
							});
						});
					});
				}
			);
		}
	} catch (err) {
		console.log(err);
	}
};

export {
	preSignUp,
	signup,
	login,
	logout,
	requireSignin,
	authMiddleWare,
	adminMiddleWare,
	forgotPassword,
	resetPassword,
};
