import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});
// import passport from "passport";
// import strategy from "passport-google-oauth2";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// const clientid="847560179692-s0l5bjb6ambekram6bf2dhm5appodfiv.apps.googleusercontent.com"
// const secretid="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"
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    
  })
);

// app.use(session({ secret: "asdfghjkl", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new strategy(
//     {
//       clientID: clientid,
//       clientSecret: secretid,
//       callbackURL: "http://localhost:3001/api/auth/google/callback",
//       scope: ["email", "profile"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  family: 4,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB", process.env.DATABASE_URL);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Routes
import authRouter from"./routes/auth.js";
app.use("/api/auth", authRouter);
import tasksRouter from"./routes/tasks.js";
app.use("/api", tasksRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port " + port);
});
