import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    phoneNumber: { type: String, required: true },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
