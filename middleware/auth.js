import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token :", token);
    req.userId = jwt.verify(token, process.env.JWT_SECRET)?.id;
    next();
  } catch (error) {
    console.log("Auth-Error :", error);
    res.status(403).json({ message: "Invalid / Expired Credentials" });
  }
};

export default auth;
