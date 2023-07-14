import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getOnePost = (req, res) => {
  const query =
    "select p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar from posts as p" +
    " LEFT JOIN users as u ON (p.userID = u.id) WHERE p.id = ?";
  db.query(query, [req.query.ID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getAllPosts = (req, res) => {
  const query = "select id from posts ORDER BY id DESC LIMIT 1";
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT DISTINCT p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar FROM posts as p LEFT JOIN users as u ON p.userID = u.id " +
      "LEFT JOIN relationships AS r ON (p.userID = r.followedUserID) WHERE r.followerUserID = ? OR p.userID = ? ORDER BY p.createTime DESC;";

    db.query(query, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getProfilePosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT DISTINCT p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar FROM posts as p LEFT JOIN users as u ON p.userID = u.id " +
      "WHERE p.userID = ? ORDER BY p.createTime DESC;";

    db.query(query, [req.query.currentProfile], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "INSERT INTO posts (`image`, `content`, `createTime`, `userID` ) VALUES (?)";

    const values = [
      req.body.image,
      req.body.content,
      moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created post sucessfully");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "DELETE FROM posts WHERE id = ? AND userID = ?";

    db.query(query, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Delete post sucessfully");

      return res.status(403).json("You can only delete your post");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "UPDATE posts SET content = ?, image = ? WHERE id = ?";

    db.query(
      query,
      [req.body.content, req.body.image, req.query.postID],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Update post sucessfully");

        return res.status(403).json("You can only delete your post");
      }
    );
  });
};
