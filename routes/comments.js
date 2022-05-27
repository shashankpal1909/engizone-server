import express from "express";
import { addComment } from "../controllers/comments.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addComment);

export default router;
