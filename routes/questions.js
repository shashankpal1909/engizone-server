import express from "express";

import { addQuestion, deleteQuestionById, getQuestionById } from "../controllers/questions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addQuestion);

router.get("/:id", getQuestionById);
router.delete("/:id", deleteQuestionById);

export default router;
