import mongoose from "mongoose";
import Comment from "./comments.js";

const solutionSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // comments: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   default: [],
    //   ref: "Comment",
    // },
    upVotes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User",
    },
    downVotes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User",
    },
    isMarkedCorrect: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, id: false }
);

solutionSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "solutionId",
});

solutionSchema.pre("remove", async function (next) {
  const solution = this;

  await Comment.deleteMany({ solutionId: solution._id });
  next();
});

solutionSchema.methods.deleteCommentsAndReplies = async (solution) => {
  solution.comments.map(async (commentId) => {
    const comment = await Comment.findById(commentId);

    comment.replies.map(async (replyId) => {
      await Comment.findByIdAndDelete(replyId);
    });

    await Comment.findByIdAndDelete(commentId);
  });
};

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
