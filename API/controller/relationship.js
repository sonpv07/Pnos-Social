import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRelationships = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT followerUserID FROM relationships WHERE followedUserID = ?";

    db.query(query, [req.query.followedUserID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map((user) => user.followerUserID));
    });
  });
};

export const getFollower = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT r.*, u.firstName, u.lastName, u.avatar FROM relationships as r LEFT JOIN users as u ON (r.followerUserID = u.id)" +
      "WHERE r.followedUserID = ?";
    db.query(query, [req.query.followedUserID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map((user) => user));
    });
  });
};



export const getFollowing = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT r.*, u.firstName, u.lastName, u.avatar FROM relationships as r LEFT JOIN users as u ON (r.followedUserID = u.id)" +
      "WHERE r.followerUserID = ?";
    db.query(query, [req.query.followerUserID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map((user) => user));
    });
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "INSERT INTO relationships (`followerUserID`, `followedUserID`) VALUES (?)";

    const values = [userInfo.id, req.body.currentProfile];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Follow sucessfully");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "DELETE FROM relationships WHERE followerUserID = ? AND followedUserID = ?";

    db.query(query, [userInfo.id, req.query.currentProfile], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Delete post sucessfully");

      return res.status(403).json("You can only delete your post");
    });
  });
};
