import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLikes = (req, res) => {
  const query = "SELECT likeUserID FROM likes WHERE likePostID = ?";

  db.query(query, [req.query.postID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.likeUserID));
  });
};

export const getLikeInfo = (req, res) => {
  const query =
    "SELECT u.id, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar FROM likes as l JOIN users as u ON (u.id = l.likeUserID) " +
    " WHERE l.likePostID = ?";

  db.query(query, [req.query.postID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "INSERT INTO likes (`likeUserID`,`likePostID`) VALUES (?)";

    const values = [userInfo.id, req.body.postID];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Add like success");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "DELETE FROM likes WHERE likeUserID = ? AND likePostID = ?";

    db.query(query, [userInfo.id, req.query.postID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Delete Likes success");
    });
  });
};
