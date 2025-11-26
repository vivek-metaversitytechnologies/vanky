"use client"
import { useState } from "react";

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ userId: false, password: false });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError({
            userId: userId === "",
            password: password === ""
        });
        // Handle form logic or API call here
    };

    return (
        <div
            className="flex h-screen items-center justify-center bg-[#494057]"
            style={{
                backgroundImage: "url('/assets/images/bg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: '0.7'
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='681' height='835' viewBox='0 0 681 835' fill='none'><rect x='0.75' y='0.75' width='679.5' height='833.5' rx='58.25' fill='url(%23paint0_linear_5647_240)' stroke='%2389FE43' stroke-width='1.5'/><defs><linearGradient id='paint0_linear_5647_240' x1='340.5' y1='0' x2='340.5' y2='835' gradientUnits='userSpaceOnUse'><stop stop-color='%23001603' stop-opacity='0.93'/><stop offset='1' stop-color='%2306190C' stop-opacity='0.41'/></linearGradient></defs></svg>") no-repeat center center`,
                    borderRadius: "25px",
                    border: "1.5px solid #89FE43",
                    boxShadow: "0 8px 28px 0 rgba(0,0,0,0.35)",
                    display: "flex",
                    flexDirection: "column"
                }}
                className="bg-cover bg-center rounded-2xl p-8 relative lg:pt-[10px] lg:px-[60px]"
            >
                {/* Logo */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-5xl font-bold text-red-600 font-serif pb-4">
                        vanky <span className="inline-block bg-white text-black text-sm px-2 py-0.5 rounded">12</span>
                    </h1>
                </div>

                {/* User ID */}
                <div className="py-6">
                    <label className="flex items-center text-white font-bold mb-1 text-lg">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                        </svg>
                        User ID
                    </label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID....."
                        className="w-full px-4 py-2 mb-1 rounded-md bg-transparent border border-green-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    {error.userId && (
                        <span className="text-red-600 text-xs font-semibold">
                            UserID is required.
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="py-6">
                    <label className="flex items-center text-white font-bold mb-1 text-lg">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 8V6a5 5 0 00-10 0v2H5v14h14V8h-2zm-6 0V6a3 3 0 016 0v2H11z"/>
                        </svg>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 mb-1 rounded-md bg-transparent border border-green-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    {error.password && (
                        <span className="text-red-600 text-xs font-semibold">
                            Password is required.
                        </span>
                    )}
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-transparent border border-green-400 text-white font-semibold text-lg py-2 rounded-md mt-5 mb-0 hover:bg-green-500 hover:text-black transition"
                >
                    Log In Now
                </button>

                {/* Error Note */}
                <div className="mt-4 bg-red-600 text-white text-center text-base font-semibold rounded-md"
                     style={{
                         padding: "4px",
                         marginTop: "50px",
                         background: "#ebdede",
                         borderRadius: "25px",
                         border: "1px solid rgba(255, 255, 255, .1)",
                         textAlign: "center",
                         color: "red",
                         fontWeight: 700,
                         fontSize: "14px",
                         letterSpacing: "normal",
                     }}
                >
                    Note - Only 10 Wrong Password attempts are valid.
                </div>

                <p className="text-xs text-gray-400 text-center mt-6 px-2 container mx-auto pt-6">
                    <span className="text-lg">⚠️</span> Note - This Website is not for Indian Territory.
                </p>
            </form>
        </div>
    );
}
