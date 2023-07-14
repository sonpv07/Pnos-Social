import express from "express";

import {
  getComments,
  addComment,
  removeComment,
  updateComment,
} from "../controller/comment.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.put("/", updateComment);
router.delete("/", removeComment);

export default router;
