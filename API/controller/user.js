import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userID = req.params.userID;
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [userID], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const searchUser = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "SELECT CONCAT(firstName, ' ' , lastName) as name, avatar, id FROM users where (firstName like ? OR lastName like ?)" +
      " and id != ?";

    db.query(
      query,
      [req.query.userName, req.query.userName, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "UPDATE users SET username = ?, firstName = ?, lastName = ?, email = ?, avatar = ?, coverPic = ?, gender = ? WHERE id = ?";

    db.query(
      query,
      [
        req.body.username,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.avatar,
        req.body.coverPic,
        req.body.gender,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Update profile sucessfully");

        return res.status(403).json("You can only edit your profile");
      }
    );
  });
};
