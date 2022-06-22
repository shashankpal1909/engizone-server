import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import Users from "../models/users.js";
import * as path from "path";
import * as fs from "fs";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ error: "User Doesn't Exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid Credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7 days",
      }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, age, phoneNumber } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User Already Exist" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      phoneNumber,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7 days",
      }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    console.log("🚀 ~ file: users.js ~ line 54 ~ signUp ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No User Found (Invalid ID)");

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).send("No User Found (Invalid ID)");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const getUserDetails = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No User Found (Invalid ID)");

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).send("No User Found (Invalid ID)");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const addAvatarById = async (req, res) => {
  const id = req.userId;
  const { filename: image } = req.file;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No User Found (Invalid ID)");

  try {
    const user = await Users.findById(id);

    if (!user) res.status(404).json({ error: "User Not Found" });

    // console.log(req.file, "controllers-users.js");
    await sharp(req.file.path)
      .resize(400, 400)
      .png()
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);
    // const buffer = await sharp(req.file.buffer)
    // 	.png()
    // 	.resize(400, 400)
    // 	.toBuffer();

    user.avatar = `http://localhost:5000/images/resized/${req.userId}.png`;
    const updatedUser = await Users.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(error, "117-users.js");
    res.status(400).send({ error: error.message });
  }
};

export const getAvatarById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    if (!user || !user.avatar) {
      throw new Error("");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
};

export const updateUserDetails = async (req, res) => {
  const id = req.userId;
  const { firstName, lastName, age, phoneNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No User Found (Invalid ID)");

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).send("No User Found (Invalid ID)");

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { firstName, lastName, age, phoneNumber },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(
      "🚀 ~ file: users.js ~ line 98 ~ updateUserDetails ~ error",
      error
    );
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

export const updateUserPassword = async (req, res) => {
  const id = req.userId;
  const { oldPassword, newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No User Found (Invalid ID)");

  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).send("No User Found (Invalid ID)");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid Credentials" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(
      "🚀 ~ file: users.js ~ line 117 ~ updateUserPassword ~ error",
      error
    );
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
