import express from "express";

import {
  addQuestion,
  deleteQuestionById,
  getAllTags,
  getBookmarkedQuestionsByUserId,
  getQuestionById,
  getQuestions,
  getQuestionsByAuthorId,
  toggleBookMark,
  updateQuestionById,
} from "../controllers/questions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addQuestion);
router.post("/:id/bookmark", auth, toggleBookMark);
router.get("/", getQuestions);
router.get("/tags", getAllTags);
router.get("/author/:id", getQuestionsByAuthorId);
router.get("/bookmarks/:id", getBookmarkedQuestionsByUserId);
router.get("/:id", getQuestionById);
router.patch("/:id", auth, updateQuestionById);
router.delete("/:id", auth, deleteQuestionById);

export default router;
