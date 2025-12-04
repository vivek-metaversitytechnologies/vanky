// components/layout/Marquee.jsx
"use client";

import React from "react";

export default function Marquee({ text } = {}) {
    const message = text || "2025-11-28 10:13:20 - WELCOME TO VANKY12.COM ( Adelaide Strikers Women vs Sydney Thunder Women 5 over par side due to rain )";

    return (
        <div className="marquee-track">
            <div className="marquee-item">{message}</div>
            <div className="marquee-item" aria-hidden="true">{message}</div>
        </div>
    );
}
