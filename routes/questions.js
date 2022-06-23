import express from "express";

import {
  addQuestion,
  deleteQuestionById,
  getAllTags,
  getQuestionById,
  getQuestions,
  getQuestionsByAuthorId,
  getQuestionsByQuery,
  updateQuestionById,
} from "../controllers/questions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addQuestion);

router.get("/", getQuestions);
router.get("/search/", getQuestionsByQuery);
router.get("/author/:id", getQuestionsByAuthorId);

router.get("/tags", getAllTags);

router.get("/:id", getQuestionById);
router.patch("/:id", auth, updateQuestionById);
router.delete("/:id", auth, deleteQuestionById);

export default router;
