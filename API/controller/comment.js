import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const query =
    "SELECT DISTINCT c.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar FROM comments as c JOIN users as u ON c.userID = u.id " +
    "WHERE postID = ? ORDER BY c.createTime DESC;";

  db.query(query, [req.query.postID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO comments (content, createTime, userID, postID ) VALUES (?)";

    const values = [
      req.body.content,
      moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
      userInfo.id,
      req.body.postID,
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created comment sucessfully");
    });
  });
};
