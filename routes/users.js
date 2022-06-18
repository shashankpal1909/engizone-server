import express from "express";

import {
  signIn,
  signUp,
  getUserById,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

router.get("/me", auth, getUserDetails);
router.get("/:id", getUserById);

router.patch("/me", auth, updateUserDetails);
router.patch("/me/password", auth, updateUserPassword);

export default router;
