import mongoose, { Document } from "mongoose";
import shortId from "shortid";

interface IContest extends Document {
	name: string;
	slug: string;
	starting_time: Date;
	ending_time: Date;
	participants: [
		{
			user_id: {
				type: mongoose.Schema.Types.ObjectId;
				ref: "User";
			};
			score: number;
			penalty: number;
		}
	];
	submissions: [
		{
			submission_id: {
				type: mongoose.Schema.Types.ObjectId;
				ref: "Submission";
			};
		}
	];
}

const ContestSchema = new mongoose.Schema<IContest>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
			default: function () {
				return this.name.toLowerCase().replace(/ /g, "-");
			},
		},
		starting_time: {
			type: Date,
			required: true,
		},
		ending_time: {
			type: Date,
			required: true,
		},
		participants: [
			{
				user_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				score: {
					type: Number,
					default: 0,
				},
				penalty: {
					type: Number,
					default: 0,
				},
			},
		],
		submissions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Submission",
			},
		],
	},

	{ collection: "contest", timestamps: true }
);

export default mongoose.model<IContest>("Contest", ContestSchema);
export { IContest };
