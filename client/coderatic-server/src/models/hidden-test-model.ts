import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IProblem } from "./problem-model.js";

interface IHiddenTest extends Document {
	problem_id: mongoose.Schema.Types.ObjectId;
	input_file_path: string;
	output_file_path: string;
	time_lim?: number;
	mem_lim?: number;
}

const HiddenTestSchema = new mongoose.Schema<IHiddenTest>(
	{
		problem_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		} as IProblem["_id"],
		input_file_path: {
			type: String,
			default: uuidv4 + ".in",
			required: true,
		},
		output_file_path: {
			type: String,
			default: uuidv4 + ".out",
			required: true,
		},
		time_lim: {
			type: Number,
			required: false,
		},
		mem_lim: {
			type: Number,
			required: false,
		},
	},
	{ collection: "hiddenTest" }
);

export default mongoose.model<IHiddenTest>("HiddenTest", HiddenTestSchema);
export { IHiddenTest };
