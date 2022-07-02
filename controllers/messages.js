import Message from "../models/messages.js";

export const addMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ message: "Message Added!" });
  } catch (error) {
    console.log("🚀 ~ file: messages.js ~ line 9 ~ addMessage ~ error", error);
    res.status(500).json({ error: "Something Went Wrong" });
  }
};
