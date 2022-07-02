import express from "express";
import multer from "multer";
import sharp from "sharp";
import {
  signIn,
  signUp,
  getUserById,
  getUserDetails,
  updateUserDetails,
  getAvatarById,
  signOut,
  signOutAll,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/sign-out", auth, signOut);
router.post("/sign-out-all", auth, signOutAll);
router.get("/me", auth, getUserDetails);
router.get("/:id", getUserById);
router.patch("/me", auth, updateUserDetails);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      cb(
        new Error("Invalid File (Upload a JPG/PNG/JPEG file with size < 1 MB!)")
      );
    }
    cb(undefined, true);
  },
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 400, height: 400 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.status(201).json({ user: req.user });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/:id/avatar", getAvatarById);

export default router;
