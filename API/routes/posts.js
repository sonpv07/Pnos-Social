import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getProfilePosts,
  updatePost,
} from "../controller/post.js";

const router = express.Router();

router.get("/profilePosts", getProfilePosts);
router.get("/", getPosts);
router.post("/", addPost);
router.put("/", updatePost);
router.delete("/:id", deletePost);

export default router;
