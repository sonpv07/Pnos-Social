import express from "express";
const app = express();

import userRoutes from "./routes/users.js";
import storyRoutes from "./routes/stories.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationships.js";
import activityRoutes from "./routes/activites.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/messages.js";
import followRequestRoutes from "./routes/followRequest.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

const uploadMultiple = multer({ storage: storage }).array("files", 12);

app.post("/api/uploadMultiple", (req, res) => {
  uploadMultiple(req, res, function (err) {
    const file = req.files;
    res.status(200).json(file);
    // console.log("multipleFile", file);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/followRequest", followRequestRoutes);

app.listen(8800, () => {
  console.log("API working!!");
});
