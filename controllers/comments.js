import mongoose from "mongoose";

import Comment from "../models/comments.js";
import Solution from "../models/solutions.js";

export const addComment = async (req, res) => {
  const { solutionId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(solutionId))
    return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

  try {
    const solution = await Solution.findById(solutionId);

    if (!solution)
      return res.status(404).json({ error: "No Solution Found (Invalid ID)" });

    const comment = new Comment({ text, solutionId, author: req.user._id });
    await comment.save();

    await comment.populate([
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
    ]);

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

  try {
    const comment = await Comment.findById(id);
    if (!comment)
      return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

    await comment.populate([
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
    ]);

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const addReply = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

  try {
    const comment = await Comment.findById(id);

    if (!comment)
      return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

    const reply = new Comment({
      text,
      author: req.user._id,
      parentCommentId: id,
    });

    await reply.save();

    await reply.populate([
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
    ]);

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

  const updates = Object.keys(req.body);
  const allowedUpdates = ["text"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    const comment = await Comment.findById(id);
    if (!comment)
      return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

    if (String(comment.author) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    updates.forEach((update) => (comment[update] = req.body[update]));

    await comment.save();
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const deleteCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Comment ID" });

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Invalid Comment ID" });

    if (String(comment.author) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    await comment.remove();
    res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
