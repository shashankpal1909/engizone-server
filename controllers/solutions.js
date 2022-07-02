import mongoose from "mongoose";

import Question from "../models/questions.js";
import Solution from "../models/solutions.js";

export const addSolution = async (req, res) => {
  const { text, questionId } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question)
      return res.status(404).json({ error: "No Question Found (Invalid ID)" });

    const solution = new Solution({
      text,
      author: req.user._id,
      questionId,
    });

    await solution.save();
    await solution.populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "comments",
        populate: [
          {
            path: "replies",
            populate: {
              path: "author",
              select: "-email -phoneNumber -age",
            },
          },
          {
            path: "author",
            select: "-email -phoneNumber -age",
          },
        ],
      },
    ]);

    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getSolutionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

  try {
    const solution = await Solution.findById(id);
    if (!solution)
      return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

    await solution.populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "comments",
        populate: [
          {
            path: "replies",
            populate: {
              path: "author",
              select: "-email -phoneNumber -age",
            },
          },
          {
            path: "author",
            select: "-email -phoneNumber -age",
          },
        ],
      },
    ]);

    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const voteSolution = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

  try {
    const solution = await Solution.findById(id);

    if (!solution)
      return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

    if (type === 1) updateUpVote(solution);
    else if (type == -1) updateDownVote(solution);
    else return res.status(404).json({ error: "Invalid Vote Type" });

    await solution.save();
    await solution.populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "comments",
        populate: [
          {
            path: "replies",
            populate: {
              path: "author",
              select: "-email -phoneNumber -age",
            },
          },
          {
            path: "author",
            select: "-email -phoneNumber -age",
          },
        ],
      },
    ]);

    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }

  function updateDownVote(solution) {
    const index = solution.downVotes.findIndex(
      (id) => String(id) === String(req.user._id)
    );

    if (index === -1) solution.downVotes.push(req.user._id);
    else
      solution.downVotes = solution.downVotes.filter(
        (id) => String(id) !== String(req.user._id)
      );

    toggleUpVote(solution);
  }

  function updateUpVote(solution) {
    const index = solution.upVotes.findIndex(
      (id) => String(id) === String(req.user._id)
    );

    if (index === -1) solution.upVotes.push(req.user._id);
    else
      solution.upVotes = solution.upVotes.filter(
        (id) => String(id) !== String(req.user._id)
      );

    toggleDownVote(solution);
  }

  function toggleUpVote(solution) {
    solution.upVotes = solution.upVotes.filter(
      (id) => String(id) !== String(req.user._id)
    );
  }

  function toggleDownVote(solution) {
    solution.downVotes = solution.downVotes.filter(
      (id) => String(id) !== String(req.user._id)
    );
  }
};

export const updateSolutionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

  const updates = Object.keys(req.body);
  const allowedUpdates = ["text"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).json({ error: "Invalid Updates" });

  try {
    const solution = await Solution.findById(id);
    if (!solution)
      return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

    if (String(solution.author) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    updates.forEach((update) => (solution[update] = req.body[update]));

    await solution.save();
    await solution.populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "comments",
        populate: [
          {
            path: "replies",
            populate: {
              path: "author",
              select: "-email -phoneNumber -age",
            },
          },
          {
            path: "author",
            select: "-email -phoneNumber -age",
          },
        ],
      },
    ]);

    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const deleteSolutionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

  try {
    const solution = await Solution.findById(id);
    if (!solution)
      return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

    if (String(solution.author) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    await solution.remove();

    res.status(200).json({ message: "Solution Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
