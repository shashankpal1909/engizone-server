import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    tags: { type: [String] },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    solutions: { type: [mongoose.Schema.Types.ObjectId] },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Questions", questionSchema);
