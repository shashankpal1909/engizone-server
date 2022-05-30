import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.userId = jwt.verify(token, process.env.JWT_SECRET)?.id;
    console.log("User Authorized | id :", req.userId);
    next();
  } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 10 ~ auth ~ error", error);
    res.status(403).json({ message: "Invalid / Expired Credentials" });
  }
};

export default auth;
