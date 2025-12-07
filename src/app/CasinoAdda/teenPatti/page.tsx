"use client";

import React, { useState } from "react";
import "../../../styles/casino-live.css";
import "../../../styles/casino.css";
import Image from "next/image";
import Link from "next/link";
import CasinoRules from "../casino-rule";

const GamePage = () => {
    const [stake, setStake] = useState(0);
    const [cardsOpen, setCardsOpen] = useState(true);
    const [showRules, setShowRules] = useState(false);

    const odds = 0.96;
    const [selectedOdds, setSelectedOdds] = useState(odds);

    const results = ["A", "A", "B", "A", "B", "B", "A", "A", "B", "A"];
    const stakeButtons = [1, 5, 10, 50, 100, 500, 1000, 5000];

    return (
        <>
            {/* ===========================
                RULES MODAL
            ============================ */}
            <CasinoRules visible={showRules} onClose={() => setShowRules(false)} />

            <div className="casino-page live">

                {/* HEADER */}
                <header className="casino-header flex justify-between items-center px-4 py-3">
                     <Link href="/CasinoAdda">  
                    <h1 className="casino-title">HOME</h1>
                     </Link>

                    <div className="live-right flex items-center gap-4">
                        <p className="balance">
                            <span>Pts:</span> <span className="bal">1262.00</span>
                        </p>

                        <div className="live-user flex items-center gap-2">
                            <span className="icon">
                                <i className="fa-solid fa-user casino-user-icon"></i>
                            </span>
                            <span className="casino-username">c360348</span>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <div className="casino-main live-main">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                        {/* LEFT SECTION */}
                        <div className="lg:col-span-9">
                            <div className="casino-left">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

                                    {/* CARDS BLOCK */}
                                    <div className="md:col-span-3">
                                        <div className="min-wrapper">

                                            <div className="casino-left-header">
                                                <span className="casino-game-title">TEENPATTI 1-DAY</span>
                                                <span className="casino-round-id">Round ID: 101251207194631</span>
                                            </div>

                                            <div className={`casino-cards-box ${cardsOpen ? "open" : "closed"}`}>

                                                {/* Row 1 */}
                                                <div className="cards-row">
                                                    {[1, 2, 3].map((x, i) => (
                                                        <Image
                                                            key={i}
                                                            src="/assets/images/card-close.png"
                                                            alt="card"
                                                            width={30}
                                                            height={30}
                                                            className="card-img"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Row 2 */}
                                                <div className="cards-row">
                                                    {[4, 5, 6].map((x, i) => (
                                                        <Image
                                                            key={i}
                                                            src="/assets/images/card-close.png"
                                                            alt="card"
                                                            width={30}
                                                            height={30}
                                                            className="card-img"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Toggle */}
                                                <span className="cards-toggle" onClick={() => setCardsOpen(!cardsOpen)}>
                                                    <i className="fa-solid fa-grip-lines"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VIDEO BLOCK */}
                                    <div className="md:col-span-9">
                                        <div className="casino-video-box relative">

                                            <div className="casino-video-icons absolute">
                                                {/* HOME ICON */}
                                                <Link href="/CasinoAdda">
                                                    <div className="video-icon-circle">
                                                        <i className="fa-solid fa-house"></i>
                                                    </div>
                                                </Link>

                                                {/* INFO ICON (OPEN MODAL) */}
                                                <div
                                                    className="video-icon-circle"
                                                    onClick={() => setShowRules(true)}
                                                >
                                                    <i className="fa-solid fa-circle-info"></i>
                                                </div>
                                            </div>

                                            <div className="casino-video-frame relative">
                                                {/* <iframe src="YOUR_VIDEO_URL"></iframe> */}
                                            </div>

                                            <div className="video-loader"></div>

                                            <div className="countdown-circle">19</div>
                                        </div>
                                    </div>

                                    {/* ODDS PANEL */}
                                    <div className="md:col-span-12">
                                        <div className="live-casino-odds-panel">
                                            <ul className="panel-header">
                                                <li><b className="text-sm">Main</b></li>
                                                <li><b className="text-sm">Back</b></li>
                                                <li><b className="text-sm">Lay</b></li>
                                            </ul>

                                            <ul className="player-row">
                                                <li>
                                                    <span className="player-name">Player A</span>
                                                    <div className="player-score">0.00</div>
                                                </li>

                                                <li className="bet-btn bet-back-btn">
                                                    <button className="back">64</button>
                                                </li>

                                                <li className="bet-btn bet-lay-btn">
                                                    <button className="lay">68</button>
                                                </li>
                                            </ul>

                                            <ul className="player-row player-b">
                                                <li>
                                                    <span className="player-name">Player B</span>
                                                    <div className="player-score">0.00</div>
                                                </li>

                                                <li className="bet-btn bet-back-btn">
                                                    <button className="back">64</button>
                                                    <button className="lay"><i className="fa-solid fa-lock"></i></button>
                                                </li>

                                                <li className="bet-btn bet-lay-btn">
                                                    <button className="lay">68</button>
                                                    <button className="lay"><i className="fa-solid fa-lock"></i></button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="lg:col-span-3">
                            <div className="casino-right flex flex-col gap-4">

                                {/* LAST RESULTS */}
                                <div className="betting-box betting-last-results">
                                    <h2 className="betting-title">LAST RESULTS</h2>

                                    <div className="results-list">
                                        {results.map((r, i) => (
                                            <div key={i} className={`result-item ${r === "A" ? "result-a" : "result-b"}`}>
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* PLACE BET */}
                                <div className="betting-box betting-placebet">

                                    <div className="placebet-header">
                                        <h2 className="betting-title">PLACE BET <span className="bet-range">Range:100-5000</span></h2>
                                    </div>

                                    <div className="bet-info-header">
                                        <span>(Bet for)</span>
                                        <span>Odds</span>
                                        <span>Stake</span>
                                        <span>Profit</span>
                                    </div>

                                    <div className="bet-info grid grid-cols-4 gap-2 items-center">

                                        {/* Player Name */}
                                        <span className="font-semibold text-sm">Player A</span>

                                        {/* SELECT (FIXED ERROR) */}
                                        <select
                                            className="bet-dropdown text-sm"
                                            value={selectedOdds}
                                            onChange={(e) => setSelectedOdds(Number(e.target.value))}
                                        >
                                            <option value="0.64">0.64</option>
                                            <option value="0.70">0.70</option>
                                            <option value="0.80">0.80</option>
                                        </select>

                                        {/* Stake */}
                                        <input
                                            type="number"
                                            value={stake}
                                            onChange={(e) => setStake(Number(e.target.value))}
                                            className="bet-input text-sm"
                                        />

                                        {/* Profit */}
                                        <div className={stake * selectedOdds >= 0 ? "profit-positive" : "profit-negative"}>
                                            {(stake * selectedOdds).toFixed(2)}
                                        </div>
                                    </div>

                                    {/* QUICK STAKE */}
                                    <div className="stake-buttons grid grid-cols-4 gap-1 mt-1">
                                        {stakeButtons.map((val) => (
                                            <button key={val} className="stake-btn" onClick={() => setStake(val)}>
                                                {val}
                                            </button>
                                        ))}
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="bet-actions flex gap-2 mt-1">
                                        <button className="bet-btn reset-btn flex-1" onClick={() => setStake(0)}>Reset</button>
                                        <button className="bet-btn submit-btn flex-1">Submit</button>
                                    </div>
                                </div>

                                {/* MY BETS */}
                                <div className="betting-box betting-mybets">
                                    <h2 className="betting-title">MY BETS</h2>

                                    <div className="mybets-header grid grid-cols-4">
                                        <span>Name</span>
                                        <span>Odds</span>
                                        <span>Stake</span>
                                        <span>P/L</span>
                                    </div>

                                    <div className="mybets-empty">No bets placed yet.</div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default GamePage;
