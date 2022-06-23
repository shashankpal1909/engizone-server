import express from "express";
import multer from "multer";
import {
  signIn,
  signUp,
  getUserById,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
  addAvatarById,
  getAvatarById,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";
import * as path from "path";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname /* req.userId + path.extname(file.originalname) */
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
    cb(
      new Error("Invalid File (Upload a JPG/PNG/JPEG file with size < 1 MB!)")
    );
  }
  cb(undefined, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

router.post("/me/avatar", auth, upload.single("avatar"), addAvatarById);
router.get("/:id/avatar", getAvatarById);

router.get("/me", auth, getUserDetails);
router.get("/:id", getUserById);

router.patch("/me", auth, updateUserDetails);
router.patch("/me/password", auth, updateUserPassword);

export default router;
