import mongoose from "mongoose";

import Comments from "../models/comments.js";
import Solutions from "../models/solutions.js";

export const addComment = async (req, res) => {
  const { solutionId, text } = req.body;
  try {
    const solution = await Solutions.findById(solutionId);
    if (!solution) return res.status(404).json({ error: "Invalid Solution ID" });

    const comment = await Comments.create({ text, author: req.userId });
    const updatedSolution = await Solutions.findByIdAndUpdate(
      solutionId,
      { comments: solution.comments.concat(comment._id) },
      { new: true }
    );

    res.status(200).json({ solution: updatedSolution, comment });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 21 ~ addComment ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getCommentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Comment Found (Invalid ID)");

  try {
    const comment = await Comments.findById(id);
    if (!comment) return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

    res.status(200).json(comment);
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 37 ~ getCommentById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const addReply = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Comment Found (Invalid ID)");

  try {
    const comment = await Comments.findById(id);
    if (!comment) return res.status(404).json({ error: "No Comment Found (Invalid ID)" });

    const reply = await Comments.create({ text, author: req.userId });
    const updatedComment = await Comments.findByIdAndUpdate(
      comment._id,
      { replies: comment.replies.concat(reply._id) },
      { new: true }
    );

    res.status(200).json({ comment: updatedComment, reply });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 61 ~ addReply ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  const { solutionId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Comment ID" });
  if (!mongoose.Types.ObjectId.isValid(solutionId))
    return res.status(404).json({ error: "Invalid Solution ID" });

  try {
    const solution = await Solutions.findById(solutionId);
    if (!solution) return res.status(404).json({ error: "Invalid Solution ID" });

    const comment = await Comments.findById(id);
    if (!comment) return res.status(404).json({ error: "Invalid Comment ID" });

    if (String(comment.author) !== String(req.userId))
      return res.status(403).json({ error: "Unauthorized" });

    const commentIndex = solution.comments.findIndex(
      (commentId) => String(commentId) === String(id)
    );
    if (commentIndex === -1)
      return res.status(404).json({ error: "Comment Not Found For This Question" });

    solution.comments = solution.comments.filter((commentId) => String(commentId) !== String(id));
    await Solutions.findByIdAndUpdate(solutionId, solution, { new: true });

    comment.replies.map(async (replyId) => {
      await Comments.findByIdAndDelete(replyId);
    });

    await Comments.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 96 ~ deleteCommentById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const deleteReplyById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Comment ID" });

  try {
    const comment = await Comments.findById(id);
    if (!comment) return res.status(404).json({ error: "Invalid Comment ID" });

    if (String(comment.author) !== String(req.userId))
      return res.status(403).json({ error: "Unauthorized" });

    await Comments.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 107 ~ deleteReplyById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateCommentById = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Invalid Comment ID" });

  try {
    const comment = await Comments.findById(id);
    if (!comment) return res.status(404).json({ error: "Invalid Comment ID" });

    if (String(comment.author) !== String(req.userId))
      return res.status(403).json({ error: "Unauthorized" });

    comment.text = text;
    const updatedComment = await Comments.findByIdAndUpdate(id, comment, { new: true });

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 127 ~ updateCommentById ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
