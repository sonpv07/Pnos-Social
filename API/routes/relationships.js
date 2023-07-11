import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getFollower,
  getFollowing
} from "../controller/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/find/", getFollower);
router.get("/findFollowing/", getFollowing);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);

export default router;
