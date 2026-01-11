import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/theme.css";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email?.value ?? "";
    const password = e.target.password?.value ?? "";

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      navigate("/food-partner/profile");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <header className="authHeader">
          <h1 className="authTitle">Food partner login</h1>
          <p className="authSubtitle">Manage your menu and orders.</p>
        </header>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="fieldLabel" htmlFor="partner-email">
              Email
            </label>
            <input
              id="partner-email"
              name="email"
              className="input"
              placeholder="partner@restaurant.com"
              inputMode="email"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="partner-password">
              Password
            </label>
            <input
              id="partner-password"
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
              New partner?{" "}
              <Link className="link" to="/food-partner/register">
                Create partner account
              </Link>
            </span>
            <Link className="link" to="/user/login">
              I’m a customer
            </Link>
          </div>

          <div className="divider" />
          <p className="hint">
            Use your partner credentials provided during onboarding.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
