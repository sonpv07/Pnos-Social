import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getFollowRequest = (req, res) => {
  const query = "SELECT * FROM follow_request WHERE followedUserID = ?";

  db.query(query, [req.params.followedUserID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const createFollowRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "INSERT INTO follow_request (followedUserID, followingUserID) VALUES (?)";

    const values = [req.body.followedUserID, req.body.followingUserID];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created comment sucessfully");
    });
  });
};

export const removeFollowRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query =
      "DELETE FROM follow_request WHERE followedUserID = ? AND followingUserID = ?";

    console.log(req.body);

    db.query(
      query,
      [req.body.followedUserID, req.body.followingUserID],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Delete follow request success");
      }
    );
  });
};
