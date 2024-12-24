//CONSTANTS
const TEN_MINUTES = 1000 * 60 * 15;
const ONE_DAY = 1000 * 60 * 60 * 24;

// URIs
const CLIENT_URI =
	process.env.NODE_ENV === "production"
		? process.env.PROD_CLIENT_URL
		: process.env.DEV_CLIENT_URL;
const SERVER_URI =
	process.env.NODE_ENV === "production"
		? process.env.PROD_SERVER_URL
		: process.env.DEV_SERVER_URL;

//DB related
const CONNECTION_STRING =
	process.env.NODE_ENV === "production"
		? process.env.PROD_CONNECTION_STRING
		: process.env.DEV_CONNECTION_STRING;
const DB_NAME =
	process.env.NODE_ENV === "production" ? "coderatic-prod" : "coderatic-dev";

//Redis
const REDIS_HOST =
	process.env.NODE_ENV === "production"
		? process.env.PROD_REDIS_HOST
		: process.env.DEV_REDIS_HOST;
const REDIS_PORT: number =
	process.env.NODE_ENV === "production"
		? Number(process.env.PROD_REDIS_PORT)
		: Number(process.env.DEV_REDIS_PORT);
const REDIS_PASSWORD =
	process.env.NODE_ENV === "production"
		? process.env.PROD_REDIS_PASSWORD
		: process.env.DEV_REDIS_PASSWORD;
const REDIS_CONNECTION_STRING =
	process.env.NODE_ENV === "production"
		? process.env.PROD_REDIS_CONNECTION_STRING
		: process.env.DEV_REDIS_CONNECTION_STRING;

// Expiration times
const PRE_SIGNUP_TOKEN_AGE =
	process.env.NODE_ENV === "production" ? "10m" : "1d";
const TOKEN_AGE = process.env.NODE_ENV === "production" ? "10m" : "24h";
const COOKIE_AGE =
	process.env.NODE_ENV === "production" ? TEN_MINUTES : ONE_DAY;

//Cookie settings
const COOKIE_SECURE = process.env.NODE_ENV === "production" ? true : false;
const COOKIE_SAME_SITE = process.env.NODE_ENV === "production" ? "none" : "lax";
const COOKIE_HTTP_ONLY = true;

export {
	CLIENT_URI,
	SERVER_URI,
	CONNECTION_STRING,
	DB_NAME,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASSWORD,
	REDIS_CONNECTION_STRING,
	PRE_SIGNUP_TOKEN_AGE,
	TOKEN_AGE,
	COOKIE_AGE,
	COOKIE_SECURE,
	COOKIE_SAME_SITE,
	COOKIE_HTTP_ONLY,
};
