import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getProfilePosts,
  updatePost,
  getAllPosts,
  getOnePost,
  getPostsImages,
  updateImages,
} from "../controller/post.js";

const router = express.Router();
router.get("/onePost", getOnePost); // select specific post by ID
router.get("/profilePosts", getProfilePosts); // posts of specific user profile
router.get("/allPost", getAllPosts); // all post id of latest post
router.get("/", getPosts); // all posts from following users
router.get("/postImages", getPostsImages);
router.post("/", addPost);
router.put("/", updatePost);
router.put("/updateImages", updateImages);
router.delete("/:id", deletePost);

export default router;
