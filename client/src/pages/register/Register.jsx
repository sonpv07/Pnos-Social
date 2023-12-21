import React, { useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    avatar:
      "https://img.mensxp.com/media/content/2015/Jan/kindsoffacebookprofilephotoswearesickofseeing1_1420801169.jpg",
  });

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", input);
      navigate("/login");
    } catch (err) {
      setErr(err);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <h1>Register</h1>
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
            <div className="row">
              <p>First Name</p>
              <input
                type="firstName"
                name="firstName"
                id="firstName"
                placeholder="Type your first name"
                onChange={handleChange}
              />
              <label htmlFor="email">
                <i className="fa-solid fa-signature"></i>
              </label>
            </div>
            <div className="row">
              <p>Last Name</p>
              <input
                type="lastName"
                name="lastName"
                id="lastName"
                placeholder="Type your last name"
                onChange={handleChange}
              />
              <label htmlFor="email">
                <i className="fa-solid fa-signature"></i>
              </label>
            </div>
            <div className="row">
              <p>Email</p>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Type your email"
                onChange={handleChange}
              />
              <label htmlFor="email">
                <i className="fa-solid fa-envelope"></i>
              </label>
            </div>

            {err ? <p style={{ color: "red", margin: 0 }}>{err}</p> : ""}

            <div className="forgot-password">
              <p>
                Already Have Account?{" "}
                <Link to="/login">
                  <span>Sign In</span>
                </Link>
              </p>
            </div>

            <button onClick={handleSubmit}>REGISTER</button>

            <div className="alternative-signup">
              <p>Or Sign In Using</p>
              <div className="social-media">
                <div className="facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
                <div className="twitter">
                  <i className="fa-brands fa-twitter"></i>
                </div>
                <div className="google">
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
