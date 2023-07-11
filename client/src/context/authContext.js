import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../googleSignIn/firebase";
import { Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [APIData, setAPIData] = useState([]);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    console.log(typeof res.data);
    setUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const logoutGoogle = () => {
    signOut(auth);
  };

  const logout = async () => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    localStorage.removeItem("user");
  };


  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        login,
        logoutGoogle,
        logout,
        user,
        APIData,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const UserAuth = () => {
  return useContext(AuthContext);
};
