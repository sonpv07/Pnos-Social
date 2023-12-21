import express from "express";
import {
  createFollowRequest,
  getFollowRequest,
  removeFollowRequest,
} from "../controller/followRequest.js";

const router = express.Router();

router.get("/:followedUserID", getFollowRequest);
router.post("/", createFollowRequest);
router.delete("/remove", removeFollowRequest);

export default router;
