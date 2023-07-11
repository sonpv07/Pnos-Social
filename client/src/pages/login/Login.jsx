import React, { useContext, useEffect, useState } from "react";
import "./Login.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { UserAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(input);
    } catch (error) {
      setErr(error.response.data);
    }
  };

  console.log(input);

  const { googleSignIn, user } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div className="login">
      <div className="card">
        <h1>Login</h1>
        <div className="content">
          <form>
            <div className="row">
              <p>Username</p>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Type your username"
                onChange={handleChange}
              />
              <label htmlFor="username">
                <i className="fa-solid fa-user"></i>
              </label>
            </div>
            <div className="row">
              <p>Password</p>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Type your password"
                onChange={handleChange}
              />
              <label htmlFor="password">
                <i className="fa-solid fa-lock"></i>
              </label>
            </div>

            {err ? <p style={{ margin: 0, color: "red" }}>{err}</p> : ""}
            <div className="forgot-password">
              <p>
                Don't Have Account?{" "}
                <Link to="/register">
                  <span>Sign Up</span>
                </Link>
              </p>
              <p>
                <span>Forgot Password?</span>
              </p>
            </div>

            <button onClick={handleLogin}>LOGIN</button>

            <div className="alternative-signup">
              <p>Or Sign In Using</p>
              <div className="social-media">
                <div className="facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div className="twitter">
                  <i className="fa-brands fa-twitter"></i>
                </div>
                <div className="google" onClick={handleGoogleSignIn}>
                  <i className="fa-brands fa-google"></i>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
