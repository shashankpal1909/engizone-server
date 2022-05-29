import mongoose from "mongoose";

const tagSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    questions: { type: [mongoose.Schema.Types.ObjectId] },
    type: { type: String },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Tags", tagSchema);
