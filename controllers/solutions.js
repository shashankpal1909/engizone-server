import mongoose from "mongoose";

import Questions from "../models/questions.js";
import Solutions from "../models/solutions.js";

export const addSolution = async (req, res) => {
  const { text, questionId } = req.body;
  try {
    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ error: "Invalid Question ID" });

    const solution = await Solutions.create({ text, author: req.userId });

    const updatedQuestion = await Questions.findByIdAndUpdate(
      question._id,
      { solutions: question.solutions.concat(solution._id) },
      { new: true }
    );

    res.status(200).json({ question: updatedQuestion, solution });
  } catch (error) {
    console.log("🚀 ~ file: solutions.js ~ line 22 ~ addSolution ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getSolutionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Solution Found (Invalid ID)");

  try {
    const solution = await Solutions.findById(id);
    if (!solution) return res.status(404).send("No Solution Found (Invalid ID)");

    res.status(200).json(solution);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const voteSolution = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Solution Found (Invalid ID)");

  const solution = await Solutions.findById(id);

  try {
    if (type === 1) updateUpVote();
    else if (type == -1) updateDownVote();
    else return res.status(404).json({ error: "Invalid Vote Type" });

    const updatedSolution = await Solutions.findByIdAndUpdate(solution._id, solution, {
      new: true,
    });
    res.status(200).json(updatedSolution);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }

  function updateDownVote() {
    const index = solution.downVotes.findIndex((id) => String(id) === String(req.userId));

    if (index === -1) solution.downVotes.push(req.userId);
    else solution.downVotes = solution.downVotes.filter((id) => String(id) !== String(req.userId));

    toggleUpVote();
  }

  function updateUpVote() {
    const index = solution.upVotes.findIndex((id) => String(id) === String(req.userId));

    if (index === -1) solution.upVotes.push(req.userId);
    else solution.upVotes = solution.upVotes.filter((id) => String(id) !== String(req.userId));

    toggleDownVote();
  }

  function toggleUpVote() {
    solution.upVotes = solution.upVotes.filter((id) => String(id) !== String(req.userId));
  }

  function toggleDownVote() {
    solution.downVotes = solution.downVotes.filter((id) => String(id) !== String(req.userId));
  }
};

export const deleteSolutionById = async (req, res) => {
  const { id } = req.params;
  const { questionId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Solution ID" });
  if (!mongoose.Types.ObjectId.isValid(questionId))
    return res.status(404).json({ error: "Invalid Question ID" });

  try {
    const solution = await Solutions.findById(id);
    if (!solution) return res.status(404).json({ error: "Invalid Solution ID" });

    const question = await Questions.findById(questionId);
    if (!question) return res.status(404).json({ error: "Invalid Question ID" });

    const solutionIndex = question.solutions.findIndex(
      (solutionId) => String(solutionId) === String(id)
    );
    if (solutionIndex === -1)
      return res.status(404).json({ error: "Solution Not Found For This Question" });
    else {
      question.solutions = question.solutions.filter(
        (solutionId) => String(solutionId) !== String(id)
      );
      await Questions.findByIdAndUpdate(questionId, question, { new: true });
    }

    if (String(solution.author) !== String(req.userId))
      return res.status(403).json({ error: "Unauthorized" });

    await solution.deleteCommentsAndReplies(solution);
    await Solutions.findByIdAndDelete(id);

    res.status(200).json({ message: "Solution Deleted" });
  } catch (error) {
    console.log("🚀 ~ file: solutions.js ~ line 177 ~ deleteSolutionById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateSolutionById = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Question ID" });

  try {
    const solution = await Solutions.findById(id);
    if (!solution) return res.status(404).json({ error: "Invalid Solution ID" });

    if (String(solution.author) !== String(req.userId))
      return res.status(403).json({ error: "Unauthorized" });

    solution.text = text;
    const updatedSolution = await Solutions.findByIdAndUpdate(id, solution, { new: true });

    res.status(200).json({ solution: updatedSolution });
  } catch (error) {
    console.log("🚀 ~ file: solutions.js ~ line 138 ~ updateSolutionById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
