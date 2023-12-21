import express from "express";
import {
  createBoxChat,
  getAllBoxChat,
  getBoxChat,
  getUserBoxChat,
} from "../controller/chat.js";

const router = express.Router();

router.get("/getOneChat/:firstUserID/:secondUserID", getBoxChat);
router.get("/userChat/:userID", getUserBoxChat);
router.post("/createChat", createBoxChat);
router.get("/:firstUserID/:secondUserID", getAllBoxChat);

export default router;
