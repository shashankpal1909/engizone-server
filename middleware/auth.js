import jwt from "jsonwebtoken";
import chalk from "chalk";

import User from "../models/users.js";

export default async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    console.log(chalk.greenBright(`[LOGGER] [${user._id}] Auth Success`));
    next();
  } catch (error) {
    console.log(chalk.redBright(`[LOGGER] Auth Failed`));
    res.status(401).send({ error: "Invalid/Expired Credentials" });
  }
};
