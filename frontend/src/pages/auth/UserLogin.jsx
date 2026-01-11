import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email?.value ?? "";
    const password = e.target.password?.value ?? "";

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <header className="authHeader">
          <h1 className="authTitle">Log in</h1>
          <p className="authSubtitle">
            Welcome back. Continue ordering in seconds.
          </p>
        </header>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="fieldLabel" htmlFor="user-email">
              Email or phone
            </label>
            <input
              id="user-email"
              name="email"
              className="input"
              placeholder="you@example.com"
              inputMode="email"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="user-password">
              Password
            </label>
            <input
              id="user-password"
              name="password"
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="actions">
            <button className="primaryBtn" type="submit">
              Log in
            </button>
          </div>

          <div className="secondaryLinkRow">
            <span>
              New here?{" "}
              <Link className="link" to="/user/register">
                Create account
              </Link>
            </span>
            <Link className="link" to="/food-partner/login">
              I’m a food partner
            </Link>
          </div>

          <div className="divider" />
          <p className="hint">
            By continuing, you agree to the app’s Terms & Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
