import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLatestMessage = (req, res) => {
  const query =
    "SELECT * FROM messages WHERE boxchatID = ? ORDER BY createTime DESC LIMIT 1;";

  db.query(query, [req.params.boxchatID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getUnreadMessages = (req, res) => {
  const query =
    "select distinct a.* from messages as a join chat_box_members as b on (a.boxchatID = b.boxchatID) where a.isRead = 0 and a.receiverID = ?;  ";

  db.query(query, [req.params.receiverID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getMessages = (req, res) => {
  const query = "SELECT * from messages WHERE boxchatID = ?";

  db.query(query, req.params.boxchatID, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const sendMessage = (req, res) => {
  const query =
    "INSERT into messages (text, senderID, receiverID, boxchatID, createTime, isRead) VALUES (?)";

  const values = [
    req.body.text,
    req.body.senderID,
    req.body.receiverID,
    req.body.boxchatID,
    moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
    req.body.isRead,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Send message successfully");
  });
};

export const markAsReadMessage = (req, res) => {
  const query = "UPDATE messages SET isRead = 1 WHERE boxchatID = ?";

  db.query(query, [req.body.boxchatID], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows > 0)
      return res.status(200).json("Update message sucessfully");
  });
};
