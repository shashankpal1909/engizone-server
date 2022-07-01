import express from "express";

import { addMessage } from "../controllers/messages.js";

const router = express.Router();

router.post("/", addMessage);

export default router;
