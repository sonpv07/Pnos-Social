import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getAllBoxChat = (req, res) => {
  const query = "select * from chat_box_members where userID = ? OR userID = ?";

  const values = [req.params.firstUserID, req.params.secondUserID];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getBoxChat = (req, res) => {
  const query =
    "SELECT * from boxchat WHERE firstUserID = ? and secondUserID = ?";

  db.query(
    query,
    [req.params.firstUserID, req.params.secondUserID],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};

export const getUserBoxChat = (req, res) => {
  const query =
    "WITH RankedMessages AS ( " +
    "SELECT " +
    "i.boxchatID, " +
    "i.name, " +
    "i.firstName, " +
    "i.avatar, " +
    "i.id, " +
    "l.createTime," +
    " ROW_NUMBER() OVER (PARTITION BY i.name ORDER BY l.createTime DESC) AS RowNum" +
    " FROM (" +
    "  SELECT g.boxchatID, CONCAT(h.firstName, ' ', h.lastname) AS name, h.firstName, h.avatar, h.id " +
    "  FROM (" +
    "    SELECT f.* " +
    " FROM ( " +
    "      (SELECT boxchatID, userID " +
    "     FROM (" +
    "      SELECT a.* " +
    "   FROM chat_box_members AS a " +
    "   JOIN users AS b ON (a.userID = b.id) " +
    "  WHERE userID = ?" +
    "  ) AS d)" +
    "  ) AS e " +
    " JOIN chat_box_members AS f ON (e.boxchatID = f.boxchatID) " +
    " WHERE f.userID != ?" +
    " ) AS g " +
    "JOIN users AS h ON (g.userID = h.id)" +
    " ) AS i " +
    "JOIN messages AS l ON (i.boxchatID = l.boxchatID)" +
    ")" +
    " SELECT boxchatID, name, firstName, avatar, id, createTime" +
    " FROM RankedMessages" +
    " WHERE RowNum = 1 " +
    "	ORDER BY createTime DESC;";

  db.query(query, [req.params.userID, req.params.userID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const createBoxChat = (req, res) => {
  const query = "INSERT INTO boxchat VALUES ();";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error create box chat:", err);
      return res.status(500).json({
        message: "An error occurred while creating a box chat",
      });
    }

    const values = [req.body.firstUserID, req.body.secondUserID];
    const boxchatID = result.insertId;

    // Use a counter to keep track of completed queries
    let completedQueries = 0;

    for (const value of values) {
      db.query(
        "INSERT INTO chat_box_members (boxchatID, userID) VALUES (?, ?)",
        [boxchatID, value],
        (err) => {
          if (err) {
            console.error("Error while adding to chat:", err);
            // Consider rolling back the transaction here or handling errors appropriately
          }

          // Increment the counter
          completedQueries++;

          // Check if all queries are completed before sending the response
          if (completedQueries === values.length) {
            return res.status(200).json("Success");
          }
        }
      );
    }
  });
};
