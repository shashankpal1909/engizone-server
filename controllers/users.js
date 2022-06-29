import mongoose from "mongoose";
import User from "../models/users.js";

export const signIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
};

export const signUp = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "No User Found (Invalid ID)" });

  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ error: "No User Found (Invalid ID)" });

    const userObject = user.toObject();

    delete userObject.email;
    delete userObject.phoneNumber;
    delete userObject.password;
    delete userObject.tokens;

    res.status(200).json({ user: userObject });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong!" });
  }
};

export const getUserDetails = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const getAvatarById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
};

export const updateUserDetails = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "password",
    "age",
    "phoneNumber",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).json({ error: "Invalid Updates" });

  try {
    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
