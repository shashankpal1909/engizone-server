import Questions from "../models/questions.js";

export const addQuestion = async (req, res) => {
  const { text, tags } = req.body;
  try {
    const question = await Questions.create({
      text,
      tags,
      author: req.userId,
    });
    res.status(200).json({ result: question });
  } catch (error) {
    console.log(
      "🚀 ~ file: questions.js ~ line 13 ~ addQuestion ~ error",
      error
    );
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
