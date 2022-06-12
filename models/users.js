import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // username - String - unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    phoneNumber: { type: String },
    id: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
