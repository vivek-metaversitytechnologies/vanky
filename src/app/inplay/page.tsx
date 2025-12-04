"use client";

import { useState } from "react";
import "../../styles/inplay.css";

import SidebarDesktop from "../../components/layout/SidebarDesktop";
import HeaderDesktop from "../../components/layout/HeaderDesktop";
import Marquee from "../../components/layout/Marquee";

import {
    CricketSection,
    SoccerSection,
    TennisSection,
} from "../../components/home/sections";

export default function InPlayPage() {
    const [activeTab, setActiveTab] = useState("cricket");

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
                        <div className="inplay-wrapper">

                            <div className="inplay-left">
                                <div className="inplay-tabs">
                                    <div
                                        className={`inplay-tab ${activeTab === "cricket" ? "active" : ""}`}
                                        onClick={() => setActiveTab("cricket")}
                                    >
                                        <img src="/assets/images/inplay/cricket-ball.png" alt="Cricket" />
                                        <span>Cricket</span>
                                    </div>

                                    <div
                                        className={`inplay-tab ${activeTab === "soccer" ? "active" : ""}`}
                                        onClick={() => setActiveTab("soccer")}
                                    >
                                        <img src="/assets/images/inplay/football.png" alt="Soccer" />
                                        <span>Soccer</span>
                                    </div>

                                    <div
                                        className={`inplay-tab ${activeTab === "tennis" ? "active" : ""}`}
                                        onClick={() => setActiveTab("tennis")}
                                    >
                                        <img src="/assets/images/inplay/tennis-ball.png" alt="Tennis" />
                                        <span>Tennis</span>
                                    </div>

                                    <a href="/casino" className="inplay-tab">
                                        <img src="/assets/images/casino.png" alt="Casino" />
                                        <span>Casino</span>
                                    </a>
                                </div>
                                <div className="inplay-matches-box">
                                    {activeTab === "cricket" && <CricketSection />}
                                    {activeTab === "soccer" && <SoccerSection />}
                                    {activeTab === "tennis" && <TennisSection />}
                                </div>
                            </div>
                            <div className="inplay-right">
                                <div  className="matchBox">
                                    <h3  className="bal-title">Mini Games <i className="fa-solid fa-chevron-down"></i></h3>
                                    <div  className="balance-panel-body"></div>
                                </div>
                            </div>
                        </div>
                    </main>

                </div >
            </div >

        </div >
    );
}
