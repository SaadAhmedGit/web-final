import express from "express";
const router = express.Router();
import {
	preSignUp,
	signup,
	login,
	logout,
	forgotPassword,
	resetPassword,
} from "../controller/auth-controller.js";

import passport from "../configs/passport-setup.js";

// validators
import runValidation from "../validators/index.js";
import {
	userSignupValidator,
	userSigninValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} from "../validators/auth-validator.js";

// if validation is passed, execute the code in signup and signin controllers
router.post("/pre-signup", userSignupValidator, runValidation, preSignUp);
router.post(
	"/signup",
	passport.authenticate("pre-signup", { session: false }),
	signup
);
router.post(
	"/verify-token",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const token = req.cookies["token"];
		const userData = req.user;
		res.json({ user: userData });
	}
);

router.post("/login", userSigninValidator, runValidation, login);
router.post("/logout", logout);
router.put(
	"/forgot-password",
	forgotPasswordValidator,
	runValidation,
	passport.authenticate("jwt", { session: false }),
	forgotPassword
);
router.put(
	"/reset-password",
	resetPasswordValidator,
	runValidation,
	passport.authenticate("jwt", { session: false }),
	resetPassword
);

export default router;
