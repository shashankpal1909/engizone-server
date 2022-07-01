import mongoose from "mongoose";
import Solution from "./solutions.js";

const questionSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bookmarks: {
      type: [mongoose.Schema.Types.ObjectId],
      // default: [],
      ref: "User",
    },
    // solutions: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   default: [],
    //   ref: "Solution",
    // },
  },
  { timestamps: true, toJSON: { virtuals: true }, id: false }
);

questionSchema.virtual("solutions", {
  ref: "Solution",
  localField: "_id",
  foreignField: "questionId",
});

questionSchema.virtual("solutionCount", {
  ref: "Solution",
  localField: "_id",
  foreignField: "questionId",
  count: true,
});

questionSchema.pre("remove", async function (next) {
  const question = this;

  await Solution.deleteMany({ questionId: question._id });
  next();
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
