import Solutions from "../models/solutions.js";

export const addSolution = async (req, res) => {
  const { text } = req.body;
  try {
    const solution = await Solutions.create({
      text,
      author: req.userId,
    });
    const question = await solution.addSolutionForQuestion(
      req.body.quesId,
      solution._id
    );
    res.status(200).json({ question, solution });
  } catch (error) {
    console.log(
      "🚀 ~ file: solutions.js ~ line 13 ~ addSolution ~ error",
      error
    );
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
