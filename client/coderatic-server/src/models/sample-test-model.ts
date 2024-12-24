import mongoose, { Document } from "mongoose";
interface ISampleTest extends Document {
	test_input: string;
	test_output: string;
	explanation?: string;
}

const SampleTestSchema = new mongoose.Schema<ISampleTest>(
	{
		test_input: {
			type: String,
			required: true,
			maxlength: 1000,
		},
		test_output: {
			type: String,
			required: true,
			maxlength: 1000,
		},
		explanation: {
			type: String,
			required: false,
			maxlength: 500,
		},
	},
	{ collection: "sampleTest" }
);

export default mongoose.model<ISampleTest>("SampleTest", SampleTestSchema);
export { ISampleTest };
