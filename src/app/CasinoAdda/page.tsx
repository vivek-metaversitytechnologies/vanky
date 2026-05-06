"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchBalance } from "../../store/actions/balance";
import { fetchCasinoList } from "../../store/actions/casinoLive";
import { CASINO_GAME_BY_CODE } from "../../config/casinoGames";
import "../../styles/casino.css";

const CasinoAdda = () => {
    const router = useRouter();
    const [tabClicked, setTabClicked] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const { balance } = useSelector((state: any) => state.balance || {});
    const { casinoList } = useSelector((state: any) => state.casinoLive || {});

    const ptsValue = isHydrated ? Number(balance || 0).toFixed(2) : "0.00";

    useEffect(() => {
        const timer = setTimeout(() => setInitialLoad(false), 400);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setIsHydrated(true);
        fetchBalance();
        fetchCasinoList();
    }, []);

    const games = [
        { name: "20-20 TeenPatti", code: "teenPatti", img: "/assets/images/teen20.jpg" },
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

    const handleGameClick = (gameCode: string) => {
        const config = CASINO_GAME_BY_CODE[gameCode];
        const isUiReady = !!config?.isUiReady;

        const isGameActive = !!casinoList?.find(
            (item: any) =>
                String(item?.name || "").toLowerCase() ===
                String(config?.casinoListName || "").toLowerCase()
        );

        if (!isUiReady || !isGameActive) {
            toast.info("Coming Soon");
            return;
        }

        router.push(`/CasinoAdda/${gameCode}`);
    };

    return (
        <div className="casino-page">

            {/* HEADER */}
            <header className="casino-header">
                <Link href="/home">  
                <h1 className="casino-title">rolex12</h1>
                     </Link>
                <p className="casino-balance">
                    Pts:
                    <img src="/assets/images/wallet-icons.png" alt="coins" style={{ width: "16px", height: "16px" }} />
                    <span className="bal">{ptsValue}</span>
                </p>
            </header>

            <div className="casino-content">

                {/* Tabs */}
                <ul className="casino-category-bar">
                    <li>
                        <button className="casino-category-btn" onClick={triggerPopAnimation}>
                            <img src="/assets/images/4.png" alt="" className="casino-category-icon" />
                            Casino Hub
                        </button>
                    </li>

                    <li>
                        <button className="casino-category-btn" onClick={triggerPopAnimation}>
                            <img src="/assets/images/4.png" alt="" className="casino-category-icon" />
                            oldDiamond
                        </button>
                    </li>
                </ul>

                {/* Games */}
                <div className="casino-grid-main">
                    {games.map((game, index) => (
                        <button
                            key={index}
                            type="button"
                            className="casino-card-link"
                            onClick={() => handleGameClick(game.code)}
                        >
                            <motion.div
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
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CasinoAdda;
