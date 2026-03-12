"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/inplay.css";
import type { RootState } from "../../store/store";

import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import Marquee from "../../components/Layout/Marquee";

import {
    CricketSection,
    SoccerSection,
    TennisSection,
} from "../../components/home/sections";
import { fetchMatches } from "../../store/actions/matches";

export default function InPlayPage() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState("cricket");
    const { list: matches } = useSelector((state: RootState) => state.matches);
    const hydratedMatches = isHydrated ? matches : [];

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        fetchMatches();
    }, []);

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

                                    <a href="/CasinoAdda" className="inplay-tab">
                                        <img src="/assets/images/casino.png" alt="Casino" />
                                        <span>Casino</span>
                                    </a>
                                </div>
                                <div className="inplay-matches-box">
                                    {activeTab === "cricket" && (
                                        <CricketSection
                                            matches={hydratedMatches}
                                            enableMatchLink
                                            useApiOnly
                                        />
                                    )}
                                    {activeTab === "soccer" && <SoccerSection matches={hydratedMatches} />}
                                    {activeTab === "tennis" && <TennisSection matches={hydratedMatches} />}
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
