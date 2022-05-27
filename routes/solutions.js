import express from "express";
import { addSolution } from "../controllers/solutions.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addSolution);

export default router;
