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

commentsSchema.methods.addCommentForSolution = async (solution, commentId) => {
  solution.com;
};

export default mongoose.model("Comments", commentsSchema);
