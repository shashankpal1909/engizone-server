import mongoose from "mongoose";
import validator from "validator";

const messageSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email Address");
    },
  },
  message: { type: String, required: true, trim: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
