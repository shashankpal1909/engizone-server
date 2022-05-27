import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Users from "../models/users.js";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User Doesn't Exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.send(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7 days" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, age, phoneNumber } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User Already Exist" });

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
        expiresIn: "1h",
      }
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
