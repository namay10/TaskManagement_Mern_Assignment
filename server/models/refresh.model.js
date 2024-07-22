import mongoose from "mongoose";

const RefreshTokenshema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export const RefreshTokens = mongoose.model("RefreshTokens", RefreshTokenshema);
