"use client";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/password.css"; // <-- create this file for styling

import HeaderDesktop from "../../components/layout/HeaderDesktop";
import SidebarDesktop from "../../components/layout/SidebarDesktop";
import Marquee from "../../components/layout/Marquee";

export default function PasswordPage() {
  return (
    <div className="dashboard-wrapper">

      <HeaderDesktop />

      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">

          <SidebarDesktop />

          <main className="desktop-main">

            <div className="password-form-wrapper">
              <form className="password-form">

                {/* Logo */}
                <div className="form-logo">
                  <img src="/assets/images/vanky-form-logo.png" alt="Logo" />
                </div>

                {/* OLD PASSWORD */}
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Old Password"
                    maxLength={25}
                    className="form-input"
                    required
                  />
                </div>

                {/* NEW PASSWORD */}
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="New Password"
                    maxLength={25}
                    className="form-input"
                    required
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Retype Password"
                    maxLength={25}
                    className="form-input"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="form-group submit-box">
                  <button type="submit" className="submit-btn">
                    SUBMIT
                  </button>
                </div>

              </form>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
