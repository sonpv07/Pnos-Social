import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getFollower,
  getFollowing,
  removeFollow,
  getSuggestList,
  getCommonFollower,
  getFriendList,
} from "../controller/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/friendList", getFriendList);
router.get("/find/", getFollower);
router.get("/findFollowing/", getFollowing);
router.get("/getSuggest/", getSuggestList);
router.get("/getSuggestCommon/", getCommonFollower);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);
router.delete("/removeFollower", removeFollow);

export default router;
