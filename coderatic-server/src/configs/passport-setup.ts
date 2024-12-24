import passport from "passport";
import shortId from "shortid";
import User, { IUser } from "../models/user-model.js";
import dotenv from "dotenv";
dotenv.config();

const handleError = (err, cb) => {
	console.log(err);
	return cb(err, false, {
		message: "Something went wrong",
	});
};

//OAuth Strategies
// passport.use(
// 	new GoogleStrategy.Strategy(
// 		{
// 			callbackURL: "/api/oauth/google/redirect",
// 			clientID: process.env.GOOGLE_CLIENT_ID,
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 		},
// 		async function (accessToken, refreshToken, profile, done) {
// 			const user = await User.findOne({
// 				email: profile.emails[0].value,
// 			}).catch((err) => handleError(err, done));
// 			if (!user) {
// 				const OAuthUser = {
// 					username: "user-" + shortId.generate(8),
// 					email: profile.emails[0].value,
// 					oauth_id: profile.id,
// 					authMethod: "oauth",
// 				};
// 				const newUser = new User(OAuthUser);
// 				await newUser.save().catch((err) => handleError(err, done));
// 				done(null, newUser);
// 			} else {
// 				return done(null, user);
// 			}
// 		}
// 	)
// );

import passportJWT from "passport-jwt";
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const cookieExtractor = (req) => {
	let token = null;

	if (req && req.cookies) {
		token = req.cookies["token"];
	}

	return token;
};

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: `${process.env.JWT_SECRET}`,
		},
		async (jwtPayload, done) => {
			try {
				return done(null, jwtPayload);
			} catch (error) {
				console.log(error);
				return done(null, false, {
					statusCode: 401,
					message: "You are not authorized to access this route",
				});
			}
		}
	)
);

//Pre Signup strategy
passport.use(
	"pre-signup",
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromUrlQueryParameter("token"),
			secretOrKey: `${process.env.JWT_ACCOUNT_ACTIVATION}`,
		},
		(jwtPayload, done) => {
			try {
				if (jwtPayload.exp > Date.now()) {
					return done(null, false, {
						message: "Your verification link has expired.",
					});
				}
				return done(null, jwtPayload);
			} catch (error) {
				console.log(error);
				return done(null, false, {
					message: "Your verification link is invalid.",
				});
			}
		}
	)
);

export default passport;
