import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/questions.js";
import solutionRoutes from "./routes/solutions.js";
import commentsRoutes from "./routes/comments.js";

dotenv.config();

const app = express();

app.use(logger("combined"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send(
    `<div style="display: flex;justify-content: center;height: 100vh;align-items: center;font-size: 5vw;font-family: sans-serif;">
      <h1>Engi-Zone Server</h1>
    </div>`
  );
});

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/solutions", solutionRoutes);
app.use("/comments", commentsRoutes);

const PORT = process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server Up & Running On Port : ${PORT}`))
  )
  .catch((error) => console.log(error));
