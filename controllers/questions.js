import mongoose from "mongoose";

import Questions from "../models/questions.js";
import Solutions from "../models/solutions.js";

export const addQuestion = async (req, res) => {
  const { text, tags } = req.body;
  try {
    const question = await Questions.create({ text, tags, author: req.userId });
    res.status(200).json({ question });
  } catch (error) {
    console.log("🚀 ~ file: questions.js ~ line 12 ~ addQuestion ~ error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Question Found (Invalid ID)");

  try {
    const question = await Questions.findById(id);
    if (!question) return res.status(404).json({ error: "No Question Found (Invalid ID)" });

    res.status(200).json(question);
  } catch (error) {
    console.log("🚀 ~ file: questions.js ~ line 27 ~ getQuestionById ~ error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const deleteQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: "Invalid Question ID" });

  try {
    const question = await Questions.findById(id);
    if (!question) return res.status(404).json({ error: "Invalid Question ID" });

    question.solutions.map(async (solutionId) => {
      const solution = await Solutions.findById(solutionId);
      await solution.deleteCommentsAndReplies(solution);
      await Solutions.findByIdAndDelete(solution._id);
    });

    await Questions.findByIdAndDelete(id);

    res.status(200).json({ message: "Question Deleted" });
  } catch (error) {
    console.log("🚀 ~ file: questions.js ~ line 51 ~ deleteQuestionById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateQuestionById = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: "Invalid Question ID" });

  try {
    const question = await Questions.findById(id);
    if (!question) return res.status(404).json({ error: "Invalid Question ID" });

    if (String(question.author) !== String(req.userId)) return res.status(403).json({ error: "Unauthorized" });

    question.text = text;
    const updatedQuestion = await Questions.findByIdAndUpdate(id, question, { new: true });

    res.status(200).json({ question: updatedQuestion });
  } catch (error) {
    console.log("🚀 ~ file: questions.js ~ line 74 ~ updateQuestionById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
