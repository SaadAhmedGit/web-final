import express from "express";
const router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";

// Runtime Envs
import {
	CLIENT_URI,
	TOKEN_AGE,
	COOKIE_AGE,
	COOKIE_HTTP_ONLY,
	COOKIE_SAME_SITE,
	COOKIE_SECURE,
} from "../configs/runtime-envs.config.js";

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/google/redirect",
	passport.authenticate("google", { session: false }),
	async (req: any, res) => {
		const token = jwt.sign(
			{
				_id: req.user._id,
				user: {
					username: req.user.username,
					profile_picture: req.user.profile_picture,
					email: req.user.email,
					first_name: req.user.first_name,
					last_name: req.user.last_name,
					role: req.user.role,
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: TOKEN_AGE }
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
		return res.redirect(`${CLIENT_URI}/auth/account/OAuth/${token}`);
	}
);

export default router;
