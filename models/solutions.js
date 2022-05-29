import mongoose from "mongoose";

import Comments from "./comments.js";

const solutionSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    comments: { type: [mongoose.Schema.Types.ObjectId] },
    upVotes: { type: [mongoose.Schema.Types.ObjectId] },
    downVotes: { type: [mongoose.Schema.Types.ObjectId] },
    isMarkedCorrect: { type: Boolean, default: false },
    id: { type: String },
  },
  { timestamps: true }
);

solutionSchema.methods.deleteCommentsAndReplies = async (solution) => {
  solution.comments.map(async (commentId) => {
    const comment = await Comments.findById(commentId);

    comment.replies.map(async (replyId) => {
      await Comments.findByIdAndDelete(replyId);
    });

    await Comments.findByIdAndDelete(commentId);
  });
};

export default mongoose.model("Solutions", solutionSchema);
