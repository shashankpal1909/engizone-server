import mongoose from "mongoose";

import Question from "../models/questions.js";
import User from "../models/users.js";

export const addQuestion = async (req, res) => {
  const { title, text, tags } = req.body;
  try {
    const question = new Question({
      title,
      text,
      tags,
      author: req.user._id,
    });
    await question.save();
    await question.populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "solutions",
        populate: [
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
        ],
      },
    ]);

    res.status(201).json({ question });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Question.distinct("tags");
    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const filter = {};

    const skip = req.query.skip;
    const limit = req.query.limit;
    const search = req.query.search;

    if (search)
      filter.$or = [
        { text: { $regex: ".*" + search + ".*", $options: "i" } },
        { title: { $regex: ".*" + search + ".*", $options: "i" } },
      ];

    const count = await Question.count(filter);
    const questions = await Question.find(filter)
      .populate([
        {
          path: "author",
          select: "-email -phoneNumber -age",
        },
        {
          path: "solutionCount",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ questions, count });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Question Found (Invalid ID)" });

  try {
    const question = await Question.findById(id).populate([
      { path: "author", select: "-email -phoneNumber -age" },
      {
        path: "solutions",
        populate: [
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
        ],
      },
    ]);

    if (!question)
      return res.status(404).json({ error: "No Question Found (Invalid ID)" });

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const getQuestionsByAuthorId = async (req, res) => {
  const { id } = req.params;
  const limit = req.query.limit;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Question Found (Invalid ID)" });

  try {
    const user = await User.findById(id).populate({
      path: "questions",
      options: { limit, sort: { createdAt: -1 } },
    });

    if (!user)
      return res.status(404).json({ error: "No User Found (Invalid ID)" });

    res.status(200).json({ questions: user.questions });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateQuestionById = async (req, res) => {
  const { id } = req.params;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "text", "tags"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).json({ error: "Invalid Updates" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Question Found (Invalid ID)" });

  try {
    const question = await Question.findById(id);

    if (!question)
      return res.status(404).json({ error: "No Question Found (Invalid ID)" });

    if (String(question.author) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    updates.forEach((update) => (question[update] = req.body[update]));

    await question.save();

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const deleteQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Question Found (Invalid ID)" });

  try {
    const question = await Question.findById(id);

    if (!question)
      return res.status(404).json({ error: "No Question Found (Invalid ID)" });

    await question.remove();

    res.status(200).json({ message: "Question Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
