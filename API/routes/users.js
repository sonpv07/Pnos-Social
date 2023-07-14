import express from "express";
import { getUser, updateUser, searchUser } from "../controller/user.js";

const router = express.Router();

router.get("/find/:userID", getUser);
router.get("/search", searchUser);
router.put("/", updateUser);

export default router;
