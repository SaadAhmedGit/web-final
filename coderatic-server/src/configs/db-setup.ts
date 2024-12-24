import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { CONNECTION_STRING, DB_NAME } from "./runtime-envs.config.js";

const connectDB = async () => {
	try {
		console.log("Connecting to DB...");
		await mongoose.connect(CONNECTION_STRING, {
			dbName: DB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);
		console.log(`DB Connected (${DB_NAME})`);
	} catch (err) {
		console.log("DB Connection Error: ", err);
	}
};

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	console.log("\nDB connection closed through app termination");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await mongoose.connection.close();
	console.log("\nDB connection closed through app termination");
	process.exit(0);
});

export { connectDB };
