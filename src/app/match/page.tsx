"use client";

import { useState } from "react";
import "../../styles/match.css";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

export default function MatchPage() {
    const [matches] = useState([
        { id: 1, name: "Desert Vipers v Gulf Giants" },
        { id: 2, name: "South Africa W v Ireland W" },
        { id: 3, name: "New Zealand v West Indies" },
        { id: 4, name: "India v South Africa" },
        { id: 5, name: "Perth Scorchers W v Melbourne Stars W" },
    ]);

    const [selectedMatch, setSelectedMatch] = useState(matches[0]);
    const [favorite, setFavorite] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [showLiveTV, setShowLiveTV] = useState(false);

    const [bookmakers] = useState([
        { id: 1, team: "Desert Vipers", bookMakerPrice: -500, lagai: 222, khai: 285, status: "SUSPENDED" },
        { id: 2, team: "Gulf Giants", bookMakerPrice: 190, lagai: 35, khai: 45, status: "SUSPENDED" },
    ]);

    const [activeBetTab, setActiveBetTab] = useState("matched");

    const [matchedBets] = useState([
        {
            id: 1,
            no: 1,
            runner: "Gulf Giants",
            odds: 0.38,
            stack: 500,
            betType: "Lagai",
            placeTime: "Mon Dec 08 23:19:42 IST 2025",
            matchedTime: "Mon Dec 08 23:19:42 IST 2025",
        },
    ]);

    const toggleFavorite = () => setFavorite((s) => !s);
    const toggleLiveTV = () => setShowLiveTV((s) => !s);

    const truncateText = (text, maxLength = 25) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
    };

    return (
        <div className="dashboard-wrapper">
            <HeaderDesktop />

            <div className="marquee-wrap mobile">
                <Marquee />
            </div>

            <div className="desktop-wrapper">
                <div className="desktop-container flex">
                    <SidebarDesktop />

                    {/* MAIN CONTENT */}
                    <main className="desktop-main commission-wrap w-full p-2">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
                            {/* LEFT 7 cols */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* LEFT SIDE WRAPPER */}
                                <div className="w-full ">
                                    {/* ========== TOP HEADER (MATCH + LIVE TV + MATCHES) ========== */}
                                    <div className="w-full bg-white shadow border border-gray-300 ">
                                        <table className="w-full">
                                            <tbody>
                                                <tr className="h-12">
                                                    {/* MATCH NAME */}
                                                    <th className="bg-[#255f00] text-white px-3 py-2 relative w-[65%]">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis w-[55%] font-medium">
                                                            <i
                                                                className={`fa ${favorite ? 'fa-star' : 'fa-star-o'}`}
                                                                onClick={toggleFavorite}
                                                                style={{ cursor: 'pointer' }}
                                                            ></i>
                                                            {truncateText(selectedMatch.name)}
                                                        </span>
                                                    </th>

                                                    {/* LIVE TV */}
                                                    <th className="bg-[#ffdf1a] text-black text-center w-[18%] border-none">
                                                        <span
                                                            className="font-semibold cursor-pointer click-tv"
                                                            style={{ color: '#000' }}
                                                            onClick={toggleLiveTV}
                                                        >
                                                            <span className="tvformobile">Live TV</span>
                                                        </span>
                                                    </th>

                                                    {/* MATCHES DROPDOWN */}
                                                    <th
                                                        className="bg-[#8b0000] text-white text-center relative w-[17%] border-none cursor-pointer"
                                                        onClick={() => setDropdown(!dropdown)}
                                                    >
                                                        <div className="dropdown relative">
                                                            <button
                                                                className="w-full py-2 font-bold flex items-center justify-center gap-1"
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    lineHeight: '25px',
                                                                    padding: '0',
                                                                    color: '#fff',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Matches
                                                            </button>

                                                            {/* dropdown list */}
                                                            {dropdown && (
                                                                <ul className="match-dd">
                                                                    {matches.map((m, i) => (
                                                                        <li key={i} className={`match-dd-item ${selectedMatch.id === m.id ? "active" : ""}`}>
                                                                            <a
                                                                                onClick={() => {
                                                                                    setSelectedMatch(m);
                                                                                    setDropdown(false);
                                                                                }}
                                                                                className="match-dd-link"
                                                                            >
                                                                                {m.name}
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}


                                                        </div>
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ========== SCORE AREA + TV IFRAME ========== */}
                                    <div className="score_area  overflow-hidden">
                                        {/* Hidden animscore iframe */}
                                        <iframe
                                            id="animscore"
                                            width="100%"
                                            title="Match Score"
                                            className="iframestyle"
                                            style={{ display: 'none' }}
                                        ></iframe>

                                        {/* Main score iframe */}
                                        <iframe
                                            id="cricketScore"
                                            title="Match Score"
                                            className="iframestyle iframeheightControll border border-gray-700"
                                            style={{ width: '100%', background: '#fff', marginBottom: '10px' }}
                                            src="https://score.newbsf.com/#/score7/35036901?v=3643"
                                        ></iframe>

                                        {/* TV Frame for mobile - Only shown when Live TV is clicked */}
                                        {showLiveTV && (
                                            <div className="col-lg-12 col-xs-12 tvformobilediv border border-gray-700" style={{ padding: '0px' }}>
                                                <iframe
                                                    id="tvFrame"
                                                    style={{ width: '100%', height: '250px' }}
                                                    src="https://livetv.apnatv.shop/livetv.php?eventId=35036901"
                                                ></iframe>
                                            </div>
                                        )}
                                    </div>

                                    {/* ========== BOOKMAKER TABLE ========== */}
                                    <div className="w-full border border-gray-300 rounded-md overflow-hidden sportrow-4">
                                        <table className="w-full matchTable214087">
                                            <tbody>
                                                {/* HEADER */}
                                                <tr className="headings mobile_heading">
                                                    <th className="p-2 bg-white text-left font-semibold fix_heading" style={{ color: '#000' }}>
                                                        Bookmaker
                                                        <span className="minmax ml-2 text-xs font-medium">Min/Max - 100 / 100000</span>
                                                    </th>
                                                    <th className="p-2 text-center font-semibold back_heading_color" style={{ background: '#ffdf1a !important' }}>Lagai</th>
                                                    <th className="p-2 text-center font-semibold lay_heading_color" style={{ background: '#8b0000 !important', color: '#fff' }}>Khai</th>
                                                </tr>

                                                {/* ROWS */}
                                                {bookmakers.map(bm => (
                                                    <tr key={bm.id} className="back_lay_color runner-row-1 ball_running-message border-b border-black">
                                                        {/* TEAM + PRICE */}
                                                        <td className="p-2">
                                                            <p className="runner_text font-semibold">{bm.team}</p>
                                                            <p className={`teamBook2954263 ${bm.bookMakerPrice < 0 ? 'text-danger' : 'text-success'} font-bold`}>
                                                                {bm.bookMakerPrice}
                                                            </p>
                                                        </td>

                                                        {/* LAGAI */}
                                                        <td className="mark-back p-0 border-l border-black relative" style={{ color: 'inherit' }}>
                                                            <div className="w-full text-center py-4" style={{ background: '#3b6f8f', color: '#fff', position: 'relative' }}>
                                                                <span className="text-2xl">{bm.lagai}</span>
                                                                <span style={{ display: 'none' }}> 0 </span>

                                                                {/* SUSPENDED Overlay - EXACTLY like Angular */}
                                                                {bm.status === "SUSPENDED" && (
                                                                    <h6
                                                                        className="absolute inset-0 flex items-center justify-center"
                                                                        style={{
                                                                            color: 'rgb(255, 255, 255)',
                                                                            background: 'rgba(0, 0, 0, 0.7)',
                                                                            margin: 0,
                                                                            fontSize: '1rem',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    >
                                                                        SUSPENDED
                                                                    </h6>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* KHAI */}
                                                        <td className="mark-lay p-0 border-l border-black relative" style={{ color: 'inherit' }}>
                                                            <div className="w-full text-center py-4" style={{ background: '#8b5c63', color: '#fff', position: 'relative' }}>
                                                                <span className="text-2xl">{bm.khai}</span>
                                                                <span style={{ display: 'none' }}> 0 </span>

                                                                {/* SUSPENDED Overlay - EXACTLY like Angular */}
                                                                {bm.status === "SUSPENDED" && (
                                                                    <h6
                                                                        className="absolute inset-0 flex items-center justify-center"
                                                                        style={{
                                                                            color: 'rgb(255, 255, 255)',
                                                                            background: 'rgba(0, 0, 0, 0.7)',
                                                                            margin: 0,
                                                                            fontSize: '1rem',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    >
                                                                        SUSPENDED
                                                                    </h6>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {/* EMPTY ROW WITH BORDER (SAME AS ANGULAR) */}
                                                <tr style={{ border: '0.5px solid #000' }}>
                                                    <td colSpan="3" id="betSlipBooKMaker67868736" className="modal_book_design" style={{ display: 'none' }}></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT 5 cols - Bet Slip */}
                            <div className="lg:col-span-4">
                                <div className="betSlipBox">
                                    {/* Bet slip header */}
                                    <div className="betslip-head flex justify-between items-center bg-[#0b7d36] text-white px-4 py-3 rounded-t-md">
                                        <span id="tital_change" className="item font-semibold">Bet Slip</span>
                                        <a
                                            className="text-white"
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            data-toggle="modal"
                                            data-target="#chipsetting"
                                            data-backdrop="static"
                                            data-keyboard="false"
                                        >
                                            Edit Stake
                                        </a>
                                    </div>

                                    {/* Tabs */}
                                    <div className="tab_bets">
                                        <ul id="pills-tab" role="tablist" className="flex m-0 p-0">
                                            <li
                                                className={`nav-item betdata ${activeBetTab === "matched" ? "active-all" : ""}`}
                                                style={{ background: "#0b7d36", listStyle: "none" }}
                                            >
                                                <button
                                                    className="allbet text-white px-4 py-2 flex items-center gap-1"
                                                    onClick={() => setActiveBetTab("matched")}
                                                    style={{ padding: '9px 15px', color: '#fff', border: 'none !important' }}
                                                >
                                                    <span className="bet-label">Matched Bet</span>
                                                    <span id="matchBetsCount">({matchedBets.length})</span>
                                                </button>
                                            </li>

                                            <li
                                                className={`nav-item betdata ${activeBetTab === "fancy" ? "active-all" : ""}`}
                                                style={{ background: "#417e92", listStyle: "none" }}
                                            >
                                                <button
                                                    className="unmatchbet text-white px-4 py-2 flex items-center gap-1"
                                                    onClick={() => setActiveBetTab("fancy")}
                                                    style={{ padding: '9px 15px', color: '#fff', border: 'none !important' }}
                                                >
                                                    <span className="bet-label">Fancy Bet</span>
                                                    <span id="fancyBetsCount">(0)</span>
                                                </button>
                                            </li>

                                            <li
                                                className="nav-item betdata"
                                                style={{ background: "darkred", listStyle: "none" }}
                                            >
                                                <button
                                                    className="unmatchbet text-white px-4 py-2"
                                                    onClick={() => setActiveBetTab("completed")}
                                                    style={{ padding: '9px 5px', color: '#fff', border: 'none !important' }}
                                                >
                                                    <span className="bet-label">Completed Fancy</span>
                                                </button>
                                            </li>

                                            <li
                                                className="nav-item active-position ml-auto"
                                                style={{
                                                    float: 'right',
                                                    cursor: 'pointer',
                                                    textAlign: 'right',
                                                    width: '10%',
                                                    listStyle: 'none'
                                                }}
                                            >
                                                <button
                                                    id="togdiv"
                                                    className="px-3 py-2"
                                                    style={{ padding: '5px' }}
                                                >
                                                    <i className="fa fa-caret-down" style={{ fontSize: '25px' }}></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Tab contents */}
                                    <div id="MatchUnMatchBetaData" className="mt-3">
                                        {activeBetTab === "matched" && (
                                            <div id="allbetss" className="match_bets MachShowHide tab-pane fade in active">
                                                <table className="w-full table-striped jambo_table bulk_action wspace">
                                                    <thead>
                                                        <tr className="headings">
                                                            <td style={{ width: "4%" }}>No.</td>
                                                            <td style={{ width: "18%" }}>Runner</td>
                                                            <td style={{ width: "6%" }}>Odds</td>
                                                            <td style={{ width: "10%" }}>Stack</td>
                                                            <td style={{ width: "8%" }}>Bet Type</td>
                                                            <td style={{ width: "21%" }}>Place Time</td>
                                                            <td>Matched Time</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="matchBets">
                                                        {matchedBets.map((b) => (
                                                            <tr key={b.id} className="content_user_table mark-back">
                                                                <td>{b.no}</td>
                                                                <td>{b.runner}</td>
                                                                <td className="text-center">{b.odds}</td>
                                                                <td className="text-center">{b.stack}</td>
                                                                <td className="text-center">{b.betType}</td>
                                                                <td className="text-center">{b.placeTime}</td>
                                                                <td className="text-center">{b.matchedTime}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {activeBetTab === "fancy" && (
                                            <div id="fbets" className="match_bets MachShowHide tab-pane fade">
                                                <table className="w-full table-striped jambo_table bulk_action wspace">
                                                    <thead>
                                                        <tr className="headings">
                                                            <td style={{ width: "4%" }}>No.</td>
                                                            <td style={{ width: "18%" }}>Runner</td>
                                                            <td style={{ width: "8%" }}>Bet Type</td>
                                                            <td style={{ width: "8%" }}>Odds</td>
                                                            <td style={{ width: "8%" }}>Stack</td>
                                                            <td style={{ width: "21%" }}>Place Time</td>
                                                            <td>Matched Time</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="fancybets">
                                                        <tr>
                                                            <td colSpan="7" className="text-center">No placed bet found !</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {activeBetTab === "completed" && (
                                            <div className="match_bets">
                                                {/* You can add Completed Fancy content here if needed */}
                                                <div className="text-center py-6">No completed fancy bets</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Fancy Position Modal (Hidden by default) */}
                                <div id="fancypositionmodal" role="dialog" className="modal fade" style={{ display: 'none' }}>
                                    <div className="modal-dialog modal-xs">
                                        <div className="modal-content">
                                            <header className="modal-header">
                                                <h5 id="fancyBookName" className="modal-title" style={{ width: '90%', float: 'left' }}>Run Position</h5>
                                                <button type="button" aria-label="Close" data-dismiss="modal" className="close">x</button>
                                            </header>
                                            <div className="modal-body" style={{ maxHeight: 'calc(96vh - 47px)', padding: '0 !important', overflow: 'auto' }}>
                                                <table className="table table-bordered" style={{ margin: '0' }}>
                                                    <thead>
                                                        <tr style={{ background: '#272e41' }}>
                                                            <th width="50%" className="text-center" style={{ color: '#fff' }}>Run</th>
                                                            <th width="50%" className="text-center" style={{ color: '#fff' }}>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="fancyLengthBook">
                                                        <tr>
                                                            <td className="text-center">00</td>
                                                            <td className="text-center">00</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}