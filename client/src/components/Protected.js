import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, UserAuth } from "../context/authContext";

export default function Protected({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
