import React from "react";
import { Link } from "react-router-dom";

import "../../styles/auth.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName?.value ?? "";
    const lastName = e.target.lastName?.value ?? "";
    const email = e.target.email?.value ?? "";
    const password = e.target.password?.value ?? "";

    const response = await axios.post("http://localhost:3000/api/auth/user/register", {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      password,
    },{
      withCredentials:true
    });

    console.log(response.data);

    navigate("/")
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <header className="authHeader">
          <h1 className="authTitle">Create account</h1>
          <p className="authSubtitle">A simple profile to get started.</p>
        </header>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label className="fieldLabel" htmlFor="user-first">
                First name
              </label>
              <input
                id="user-first"
                name="firstName"
                className="input"
                placeholder="Riya"
                autoComplete="given-name"
              />
            </div>
            <div className="field">
              <label className="fieldLabel" htmlFor="user-last">
                Last name
              </label>
              <input
                id="user-last"
                name="lastName"
                className="input"
                placeholder="Kapoor"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="user-register-email">
              Email
            </label>
            <input
              id="user-register-email"
              name="email"
              className="input"
              placeholder="riya.kapoor@example.com"
              inputMode="email"
              autoComplete="email"
              type="email"
            />
          </div>

          <div className="field">
            <label className="fieldLabel" htmlFor="user-new-password">
              Password
            </label>
            <input
              id="user-new-password"
              name="password"
              className="input"
              placeholder="At least 8 characters"
              type="password"
              autoComplete="new-password"
            />
          </div>

          <div className="actions">
            <button className="primaryBtn" type="submit">
              Create account
            </button>
          </div>

          <div className="secondaryLinkRow">
            <span>
              Already have an account?{" "}
              <Link className="link" to="/user/login">
                Log in
              </Link>
            </span>
            <Link className="link" to="/food-partner/register">
              Register as food partner
            </Link>
          </div>

          <div className="divider" />
          <p className="hint">Use a strong password to keep your account safe.</p>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;