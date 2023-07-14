import express from "express";
import {
  createStory,
  getStoryID,
  getOneStory,
  getStories,
} from "../controller/story.js";

const router = express.Router();

router.get("/getStoryID", getStoryID);
router.get("/oneStory", getOneStory);
router.get("/", getStories);
router.post("/", createStory);

export default router;
