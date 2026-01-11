import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        {
          name: businessName,
          contactName,
          phone,
          email,
          password,
          address,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Food partner registered:", response.data);
      navigate("/food-partner/profile");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed. Check console for details.");
    }
  };

  return (
    <div className="authPage">
      <div className="authCard" role="region" aria-labelledby="partner-register-title">
        <header className="authHeader">
          <h1 id="partner-register-title" className="authTitle">
            Partner sign up
          </h1>
          <p className="authSubtitle">Grow your business with our platform.</p>
        </header>

        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="fieldLabel" htmlFor="businessName">
              Business Name
            </label>
            <input
              id="businessName"
              name="businessName"
              className="input"
              placeholder="Spice Route Kitchen"
              autoComplete="organization"
              required
            />
          </div>

          <div className="row">
            <div className="field">
              <label className="fieldLabel" htmlFor="contactName">
                Contact Name
              </label>
              <input
                id="contactName"
                name="contactName"
                className="input"
                placeholder="Ananya Iyer"
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label className="fieldLabel" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                className="input"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              placeholder="partner@spiceroute.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              className="input"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              className="input"
              placeholder="22 Park View Road, Bengaluru"
              autoComplete="street-address"
              required
            />
            <p className="hint">Full address helps customers find you faster.</p>
          </div>

          <div className="actions">
            <button className="primaryBtn" type="submit">
              Create Partner Account
            </button>
          </div>

          <div className="secondaryLinkRow">
            <span>
              Already a partner?{" "}
              <Link className="link" to="/food-partner/login">
                Sign in
              </Link>
            </span>
            <Link className="link" to="/user/register">
              Create user account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
