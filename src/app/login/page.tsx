"use client";
import { useState } from "react";
import Image from "next/image";
import "../../styles/login.css"; // ← YOUR CSS FILE

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ userId: false, password: false });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setError({
            userId: userId === "",
            password: password === ""
        });
    };

    return (
        <div className="login-wrapper">

            <form onSubmit={handleSubmit} className="login-box">

                {/* LOGO */}
                <div className="login-logo">
                    <Image
                        src="/assets/images/vanky-red.svg"
                        alt="logo"
                        width={90}
                        height={32}
                        className="logo-img"
                    />
                </div>

                {/* USER ID */}
                <div className="login-field">
                    <label className="login-label">
                        <i className="fa-solid fa-user icon"></i>
                        User id
                    </label>

                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID"
                        className="login-input"
                    />

                    {error.userId && <span className="error-text">User ID is required.</span>}
                </div>

                {/* PASSWORD */}
                <div className="login-field">
                    <label className="login-label">
                        <i className="fa-solid fa-lock icon"></i>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="login-input"
                    />

                    {error.password && <span className="error-text">Password is required.</span>}
                </div>

                {/* LOGIN BUTTON */}
                <button className="login-btn">Log In Now</button>

                {/* WARNING */}
                <div className="login-warning">
                    Note - Only 10 Wrong Password attempts are valid.
                </div>

                <p className="footer-note">
                    ⚠️ Note - This Website is not for Indian Territory.
                </p>

            </form>
        </div>
    );
}
