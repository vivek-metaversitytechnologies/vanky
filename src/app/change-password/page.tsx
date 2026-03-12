"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { changePassword, resetPasswordChange } from "../../store/actions/passwordChange";
import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/password.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, success, message } = useSelector(
    (state: RootState) => state.passwordChange
  );

  useEffect(() => {
    return () => {
      resetPasswordChange();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    const result = await changePassword({
      currentPassword,
      newPassword,
    });

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const confirmError =
    confirmPassword.length > 0 && newPassword !== confirmPassword
      ? "New password and confirm password must match"
      : null;

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
              <form className="password-form" onSubmit={handleSubmit}>

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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={loading}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                {confirmError && (
                  <div className="form-group">
                    <span className="error-text">{confirmError}</span>
                  </div>
                )}

                {error && (
                  <div className="form-group">
                    <span className="error-text">{error}</span>
                  </div>
                )}

                {success && message && (
                  <div className="form-group">
                    <span className="success-text">{message}</span>
                  </div>
                )}

                {/* Submit */}
                <div className="form-group submit-box">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || !!confirmError}
                  >
                    {loading ? "SUBMITTING..." : "SUBMIT"}
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
