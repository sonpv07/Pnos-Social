import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getActivities = (req, res) => {
  const query =
    "SELECT c.*, b.* FROM activity_type as c join ( " +
    "SELECT a.*,  CONCAT(u.firstName, ' ' , u.lastname) as name, u.avatar, u.gender from activities as a left join users as u on (a.activityUserID = u.id) where activityUserID in" +
    "(SELECT followerUserID FROM relationships where followedUserID = ?)) as b ON (c.id = b.activityTypeID)" +
    " WHERE b.activityUserID != ? ORDER BY b.actionTime DESC";

  db.query(query, [req.query.userID, req.query.userID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addActivity = (req, res) => {
  const query =
    "INSERT INTO activities (`activityUserID`, `activityTypeID`, `actionTime`, `activityPostID`, `activityStoryID`) VALUES (?)";

  const values = [
    req.body.activityUserID,
    req.body.activityTypeID,
    moment(Date.now()).format("YYYY/MM/DD HH:mm:ss"),
    req.body.activityPostID,
    req.body.activityStoryID,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Add activites sucessfully");
  });
};
