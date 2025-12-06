"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../styles/casino.css";

const CasinoAdda = () => {

    const [tabClicked, setTabClicked] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        // run animation once on page load
        const timer = setTimeout(() => setInitialLoad(false), 400);
        return () => clearTimeout(timer);
    }, []);

    const games = [
        { name: "20-20 TeenPatti", code: "ODT20", img: "/assets/images/teen20.jpg" },
        { name: "TeenPatti Day", code: "OD1Day", img: "/assets/images/teen.jpg" },
        { name: "32 Cards A", code: "OD32card", img: "/assets/images/card32.jpg" },
        { name: "Lucky 7", code: "ODLucky7", img: "/assets/images/lucky7.jpg" },
        { name: "20-20 Dragon Tiger", code: "ODdt20", img: "/assets/images/dt20.jpg" },
        { name: "Anthony", code: "ODaaa", img: "/assets/images/aaa.jpg" },
        { name: "Andar Bahar 2", code: "ODab20", img: "/assets/images/ab20.jpg" },
        { name: "Dragon Tiger 2", code: "ODDT202", img: "/assets/images/lucky7eu.jpg" },
        { name: "Casino 20-20 DTL", code: "ODDTL20", img: "/assets/images/abj.jpg" },
        { name: "Lucky 7 B", code: "ODLucky7b", img: "/assets/images/dtl20.jpg" },
    ];

    const triggerPopAnimation = () => {
        setTabClicked(true);
        setTimeout(() => setTabClicked(false), 350);
    };

    return (
        <div className="casino-page">

            {/* HEADER */}
            <header className="casino-header">
                <h1 className="casino-title">rolex12</h1>
                <p className="casino-balance">Pts: <span className="bal">1262.00</span></p>
            </header>

            <div className="casino-content">
                {/* Tabs */}
                <ul className="casino-category-bar">
                    <li>
                        <button
                            className="casino-category-btn"
                            onClick={triggerPopAnimation}
                        >
                            <img src="/assets/images/4.png" alt="" className="casino-category-icon" />
                            Casino Hub
                        </button>
                    </li>

                    <li>
                        <button
                            className="casino-category-btn"
                            onClick={triggerPopAnimation}
                        >
                            <img src="/assets/images/4.png" alt="" className="casino-category-icon" />
                            oldDiamond
                        </button>
                    </li>
                </ul>

                {/* Games */}
                <div className="casino-grid-main">
                    {games.map((game, index) => (
                        <motion.div
                            key={index}
                            className="casino-card-main"
                            animate={
                                (initialLoad || tabClicked)
                                    ? { scale: [0, 1] }
                                    : { scale: 1 }
                            }
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="casino-card-inner">
                                <img src={game.img} alt={game.name} className="casino-card-img" />

                                <p className="casino-card-title">{game.code}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CasinoAdda;
