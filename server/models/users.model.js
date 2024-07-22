import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", usersSchema);
