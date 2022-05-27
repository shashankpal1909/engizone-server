import Comments from "../models/comments.js";

export const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const comment = await Comments.create({
      text,
      author: req.userId,
    });
    res.status(200).json({ result: comment });
  } catch (error) {
    console.log("🚀 ~ file: comments.js ~ line 12 ~ addComment ~ error", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
