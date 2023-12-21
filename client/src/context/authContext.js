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

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Check if the page is being reloaded
  //     const isReloading = event.clientY < 0; // Negative clientY indicates a reload

  //     if (!isReloading) {
  //       // Clear the localStorage if the tab is being closed
  //       localStorage.removeItem("user");
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     // Remove the event listener when the component unmounts
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

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
