import express from "express";

import {
  addComment,
  addReply,
  deleteCommentById,
  deleteReplyById,
  getCommentById,
  updateCommentById,
} from "../controllers/comments.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addComment);

router.post("/:id/reply", auth, addReply);
router.delete("/:id/reply", auth, deleteReplyById);

router.get("/:id", getCommentById);
router.patch("/:id", auth, updateCommentById);
router.delete("/:id", auth, deleteCommentById);

export default router;
