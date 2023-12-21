import express from "express";
import {
  getLatestMessage,
  getMessages,
  getUnreadMessages,
  markAsReadMessage,
  sendMessage,
} from "../controller/messages.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/:boxchatID", getMessages);
router.get("/getLatest/:boxchatID", getLatestMessage);
router.get("/getUnread/:receiverID", getUnreadMessages);
router.put("/markAsRead", markAsReadMessage);

export default router;
