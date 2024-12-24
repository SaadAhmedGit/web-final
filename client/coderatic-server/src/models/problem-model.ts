import mongoose, { Document } from "mongoose";
import { IHiddenTest } from "./hidden-test-model.js";
import { ISampleTest } from "./sample-test-model.js";
import shortId from "shortid";

interface IProblem extends Document {
	name: string;
	short_id: string;
	slug: string;
	time_lim?: number;
	mem_lim?: number;
	statement: string;
	input_format: string;
	output_format: string;
	constraints: string;
	difficulty?: "Easy" | "Medium" | "Hard";
	sample_tests?: ISampleTest["_id"];
	hidden_tests: IHiddenTest["_id"];
}

const ProblemSchema = new mongoose.Schema<IProblem>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 50,
		},
		short_id: {
			type: String,
			unique: true,
			index: true,
			default: shortId.generate,
		},
		slug: {
			type: String,
			unique: true,
			index: true,
			required: true,
			default: function () {
				return (
					this.name.toLowerCase().replace(/ /g, "-") +
					"-" +
					this.short_id
				);
			},
			maxlength: 50,
		},
		time_lim: {
			type: Number,
			required: true,
			min: 1,
			max: 10,
		},
		mem_lim: {
			type: Number,
			required: true,
			min: 16,
			max: 1024,
		},
		statement: {
			type: String,
			trim: true,
			required: true,
			maxlength: 10000,
		},
		input_format: {
			type: String,
			trim: true,
			required: true,
			maxlength: 1000,
		},
		output_format: {
			type: String,
			trim: true,
			required: true,
			maxlength: 1000,
		},
		constraints: {
			type: String,
			trim: true,
			required: true,
			maxlength: 1000,
		},
		difficulty: {
			type: String,
			enum: ["Easy", "Medium", "Hard"],
			required: false,
		},
		sample_tests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "SampleTest",
			} as ISampleTest["_id"],
		],
		hidden_tests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "HiddenTest",
				required: true,
			} as IHiddenTest["_id"],
		],
	},
	{ collection: "problem", timestamps: true }
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);
export { IProblem };
