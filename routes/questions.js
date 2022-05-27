import express from "express";
import { addQuestion } from "../controllers/questions.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addQuestion);

export default router;
