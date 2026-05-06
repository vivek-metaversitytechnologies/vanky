"use client";

import Link from "next/link";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/casino-entry.css";

const CASINO_GAMES = [
    { name: "Andar Bahar", img: "/assets/images/casino/ander-bahar-2.png" },
    { name: "Teen Patti One Day", img: "/assets/images/casino/teenpatti-one-day.png" },
    { name: "Teen Patti T20", img: "/assets/images/casino/teenpatti-t20.png" },
    { name: "32 Cards A", img: "/assets/images/casino/32-card-a.png" },
    { name: "Lucky 7 A", img: "/assets/images/casino/lucky-7.png" },
    { name: "Dragon Tiger T20", img: "/assets/images/casino/dragon-tiger.png" },
    { name: "Amar Akhbar Anthony", img: "/assets/images/casino/aaa.png" },
];

export default function CasinoLobbyPage() {
    return (
        <div className="dashboard-wrapper casino-entry-page">
            <HeaderDesktop />

            <div className="container body">
                <div className="mrq hidden-lg">
                    <div className="marquee">
                        <div className="marquee-wrapper">
                            <div className="announcement-row">
                                <div className="marquee-track">
                                    <ul className="marquee-content">
                                        <li>
                                            <span>
                                                <p>
                                                    <strong id="loginMarquee">--</strong>
                                                </p>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="desktop-wrapper">
                    <div className="desktop-container">
                        <SidebarDesktop />

                        <main className="desktop-main">
                            <div id="sticky" className="main_container">
                                <div role="main" className="right_col">
                                    <div className="row casino-row">
                                        <div className="col-md-12">
                                            <div className="title_new_at">
                                                Live Casino
                                                <div className="pull-right">
                                                    <Link href="/home" className="btn_common">
                                                        Back
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="site-wrapper">
                                                <main className="site-content text-center">
                                                    <div className="site-content__center">
                                                        <div>
                                                            <div className="game-lobby">
                                                                <div className="lobby-inner">
                                                                    <div className="row game-grid-row">
                                                                        {CASINO_GAMES.map((game, index) => (
                                                                            <div
                                                                                key={`${game.name}-${index}`}
                                                                                className="col-lg-3 col-md-3 col-sm-3 col-xs-6 casino-item"
                                                                            >
                                                                                <Link href="/casinoAdda">
                                                                                    <div className="hover ehover4">
                                                                                        <img
                                                                                            src={game.img}
                                                                                            alt={game.name}
                                                                                            className="img-responsive casino-thumb"
                                                                                        />
                                                                                        <p className="casno-name-txt">{game.name}</p>
                                                                                    </div>
                                                                                </Link>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </main>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
