
import mongoose, { Document } from "mongoose";
import shortId from "shortid";

interface IBook extends Document {
	title: string;
  reader: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  status: string;
  total_pages: number;
  pages_read: number;
}

const BookSchema = new mongoose.Schema<IBook>(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
		status: {
			type: String,
			trim: true,
			required: true,
		},
    total_pages: {
      type: Number,
      default: 0,
    },
    pages_read: {
      type: Number,
      default: 0,
    },
	},

	{ collection: "book", timestamps: true }
);

export default mongoose.model<IBook>("Book", BookSchema);
export { IBook as IBook };
