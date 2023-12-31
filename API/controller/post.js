import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getOnePost = (req, res) => {
  const query =
    "select p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar, u.gender from posts as p" +
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
      "SELECT DISTINCT p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.gender, u.avatar FROM posts as p LEFT JOIN users as u ON p.userID = u.id " +
      "LEFT JOIN relationships AS r ON (p.userID = r.followedUserID) WHERE r.followerUserID = ? OR p.userID = ? ORDER BY p.createTime DESC;";

    db.query(query, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPostsImages = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "select url from post_images where postID = ?;";
    db.query(query, [req.query.postID], (err, data) => {
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
      "SELECT DISTINCT p.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.gender,u.avatar FROM posts as p LEFT JOIN users as u ON p.userID = u.id " +
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

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const { content, postTypeID } = req.body;

    db.query(
      "INSERT INTO posts (content, userID, createTime, postTypeID) VALUES (?, ?, ?, ?)",
      [
        content,
        userInfo.id,
        moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
        postTypeID,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting post:", err);
          return res.status(500).json({
            message: "An error occurred while inserting the post.",
          });
        }

        const file = req.body.image;

        const postId = result.insertId;

        if (file !== "") {
          const imageUrls = file.map((file) => file.filename); // Map uploaded files to image URLs

          for (const imageUrl of imageUrls) {
            db.query(
              "INSERT INTO post_images (postID, url) VALUES (?, ?)",
              [postId, imageUrl],
              (err) => {
                if (err) {
                  console.error("Error inserting an image:", err);
                  return res.status(500).json({
                    message: "An error occurred while inserting an image.",
                  });
                }
              }
            );
          }
        }
      }
    );
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "DELETE FROM posts WHERE id = ? AND userID = ?; ";

    db.query(query, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        db.query(
          "ALTER TABLE posts AUTO_INCREMENT = ?",
          parseInt(req.params.id)
        );
        return res.status(200).json("Delete post sucessfully");
      }

      return res.status(403).json("You can only delete your post");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "UPDATE posts SET content = ? WHERE id = ?";

    db.query(query, [req.body.content, req.query.postID], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Update post sucessfully");

      return res.status(403).json("You can only update your post");
    });
  });
};

export const updateImages = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query = "DELETE FROM post_images WHERE postID = ?";

    db.query(query, [req.query.postID], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) {
        const file = req.body.image;

        if (file !== undefined) {
          console.log(file);
          const imageUrls = file?.map((file) => file.url); // Map uploaded files to image URLs

          for (const imageUrl of imageUrls) {
            db.query(
              "INSERT INTO post_images (postID, url) VALUES (?, ?)",
              [req.query.postID, imageUrl],
              (err) => {
                if (err) {
                  console.error("Error inserting an image:", err);
                  return res.status(500).json({
                    message: "An error occurred while inserting an image.",
                  });
                }
              }
            );
          }
        }
        return res.status(200).json("Update post sucessfully");
      }

      return res.status(403).json("You can only update your post");
    });
  });
};
