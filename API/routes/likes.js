import express from "express";
import {
  getLikes,
  addLike,
  deleteLike,
  getLikeInfo,
} from "../controller/like.js";

const router = express.Router();

router.get("/", getLikes);
router.get("/likeInfo", getLikeInfo);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
