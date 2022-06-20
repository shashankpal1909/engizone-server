import express from "express";

import {
  addQuestion,
  deleteQuestionById,
  getQuestionById,
  getQuestions,
  getQuestionsByQuery,
  updateQuestionById,
} from "../controllers/questions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addQuestion);

router.get("/", getQuestions);
router.get("/search/", getQuestionsByQuery);

router.get("/:id", getQuestionById);
router.patch("/:id", auth, updateQuestionById);
router.delete("/:id", auth, deleteQuestionById);

export default router;
