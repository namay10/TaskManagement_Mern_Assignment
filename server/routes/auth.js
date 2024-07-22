import express from 'express';
import Router from 'express';
import {RefreshTokens}from "../models/refresh.model.js";
import {User} from"../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { generateAccessToken } from "../utils/index.js";
import { OAuth2Client } from 'google-auth-library';

const router = Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET_ID);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

const authUrl = client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

router.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    // Check if the user already exists in your database
    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({ username: name, email: email, password: name});
      await user.save();
    }

    // Generate a session token (e.g., JWT)
    const jwtToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    // Return user data and token
    res.json({ user, token: jwtToken });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token', error });
  }
});

// register new user
router.post("/register", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password)
      return res
        .status(400)
        .send({ msg: "Username and password are required" });
    const username = req.body.username;
    if (
      await User.findOne({
        username: username,
      })
    )
      return res.status(400).send({ msg: "Username already exists" });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userClient = { username: username, password: hashedPassword };
    const newUser = new User(userClient);
    await newUser.save();
    res.status(201).json({ msg: "User created" });
  } catch (e) {
    res.status(500);
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const userClient = {
      username: req.body.username,
      password: req.body.password,
    };
    if (!userClient.username || !userClient.password)
      return res
        .status(400)
        .send({ msg: "Username and password are required" });
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(400).send({ msg: "Username does not exist" });
    }
    const realPassword = await bcrypt.compare(req.body.password, user.password);
    if (!realPassword) {
      return res.status(400).send({ msg: "Incorrect password" });
    }
    const accessToken = generateAccessToken({
      username: userClient.username,
      userId: user._id,
    });
    const refreshToken = jwt.sign(
      { username: userClient.username },
      process.env.REFRESH_TOKEN_SECRET
    );
    const newRefreshToken = new RefreshTokens({
      username: userClient.username,
      refreshToken: refreshToken,
    });
    await newRefreshToken.save();
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (e) {
    res.status(500);
  }
});

// refresh access token
router.post("/refresh_token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const user = await RefreshTokens.findOne({ refreshToken: refreshToken });
    if (!user._id) return res.sendStatus(403);
    const myUser = await User.findOne({ username: user.username });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({
        username: user.username,
      });
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    });
  } catch (e) {
    res.status(500);
  }
});

// delete refresh token from database
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await RefreshTokens.deleteOne({ refreshToken: refreshToken });
    res.status(200).json({ msg: "Logged out" });
  } catch (e) {
    res.status(500);
  }
});

export default router;
