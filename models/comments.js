import mongoose from "mongoose";

const commentsSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    solutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution",
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // replies: { type: [mongoose.Schema.Types.ObjectId] },
  },
  { timestamps: true, toJSON: { virtuals: true }, id: false }
);

commentsSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentCommentId",
});

commentsSchema.pre("remove", async function (next) {
  const comment = this;

  await Comment.deleteMany({ parentCommentId: comment._id });
  next();
});

const Comment = mongoose.model("Comment", commentsSchema);

export default Comment;
