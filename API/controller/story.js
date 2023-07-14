import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "select s.*, CONCAT(u.firstName, ' ' , u.lastname) as name from stories as s left join users as u " +
      "ON (u.id = s.storyUserID) WHERE storyUserID != ? ORDER BY s.createTime DESC";

    db.query(query, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getStoryID = (req, res) => {
  const query = "select id from stories ORDER BY id DESC LIMIT 1";
  db.query(query, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getOneStory = (req, res) => {
  const query =
    "select s.*, CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar from stories as s" +
    " LEFT JOIN users as u ON (s.storyUserID = u.id) WHERE s.id = ?";
  db.query(query, [req.query.ID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const createStory = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "INSERT INTO stories (`image`, `storyUserID`, `createTime`) VALUES (?)";

    const values = [
      req.body.image,
      userInfo.id,
      moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created stories sucessfully");
    });
  });
};
