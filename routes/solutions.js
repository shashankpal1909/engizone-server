import express from "express";

import {
  addSolution,
  deleteSolutionById,
  getSolutionById,
  updateSolutionById,
  voteSolution,
} from "../controllers/solutions.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addSolution);

router.post("/:id/vote", auth, voteSolution);

router.get("/:id", getSolutionById);
router.patch("/:id", auth, updateSolutionById);
router.delete("/:id", auth, deleteSolutionById);

export default router;
