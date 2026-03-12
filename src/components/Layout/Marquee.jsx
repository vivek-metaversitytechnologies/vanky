// components/Layout/Marquee.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchMessage } from "../../store/actions/message";

export default function Marquee({ text } = {}) {
    const { text: messageText } = useSelector((state) => state.message);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchMessage();
    }, []);

    const message = mounted ? String(messageText || "").trim() : "";

    if (!message) {
        return null;
    }

    return (
        <div className="marquee-track">
            <div className="marquee-item">{message}</div>
            <div className="marquee-item" aria-hidden="true">{message}</div>
        </div>
    );
}
