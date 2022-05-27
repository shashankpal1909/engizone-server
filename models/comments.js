import mongoose from "mongoose";

const commentsSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    replies: { type: [mongoose.Schema.Types.ObjectId] },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Comments", commentsSchema);
