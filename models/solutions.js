import mongoose from "mongoose";
import questions from "./questions.js";

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

solutionSchema.methods.addSolutionForQuestion = async (quesId, solId) => {
  const question = await questions.findById(quesId);
  const updatedQuestion = await questions.findByIdAndUpdate(
    question._id,
    {
      solutions: question.solutions.concat(solId),
    },
    { new: true }
  );
  return updatedQuestion;
};

export default mongoose.model("Solutions", solutionSchema);
