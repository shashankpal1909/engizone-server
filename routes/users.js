import express from "express";

import { signIn, signUp, getUserById, getSelfUserDetails } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

router.get("/me", auth, getSelfUserDetails);
router.get("/:id", auth, getUserById);

export default router;
