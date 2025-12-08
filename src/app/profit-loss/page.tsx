"use client";

import { useState, useEffect } from "react";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";
import BackButton from "../../components/Layout/BackButton";

export default function ProfitLossPage() {

    // ⭐ STATE FOR PROFIT LOSS ROWS
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // ✔ YOUR EXACT DATA
        const data = [
            {
                sno: 1,
                event: "Royal Champs v Aspin Stallions",
                market: "Odds",
                pl: 0,
                comm: 0,
                createdOn: "2025-11-26 21:30:00"
            },
            {
                sno: 2,
                event: "Bangladesh v Ireland",
                market: "Odds",
                pl: 0,
                comm: 0,
                createdOn: "2025-11-19 09:00:00"
            },
            {
                sno: 3,
                event: "St. Lucia Kings v Guyana Amazon Warriors",
                market: "Odds",
                pl: 0,
                comm: 0,
                createdOn: "2025-08-27 04:30:00"
            }
        ];

        setRows(data); // ← remove data to test hidden tbody
    }, []);

    const noData = rows.length === 0;

    return (
        <div className="dashboard-wrapper">

            <HeaderDesktop />

            <div className="marquee-wrap mobile">
                <Marquee />
            </div>

            <div className="desktop-wrapper">
                <div className="desktop-container">

                    <SidebarDesktop />

                    <main className="desktop-main commission-wrap">

                        {/* PAGE TITLE */}
                        <div className="casino-heading no-radius uppercase acc-heading">
                            <span className="title-with-select">
                                Profit Loss Listing
                                <select
                                    className="filter-select"
                                    id="pages"
                                    style={{ color: "black" }}
                                    defaultValue="10"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </span>

                            <BackButton />
                        </div>


                     
                        <div className="commission-filters panel-body responsive-filter">

                            <div className="filter-item big-select">
                                <select className=" form-control m-0">
                                    <option value="all">All</option>
                                    <option value="cricket">Cricket</option>
                                    <option value="soccer">Soccer</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="fancy">Fancy</option>
                                    <option value="casino">Live Casino</option>
                                </select>
                            </div>

                          
                            <div className="filter-item">
                                <input type="date" className=" form-control" />
                            </div>

                            <div className="filter-item">
                                <input type="date" className=" form-control" />
                            </div>


                            <div className="filter-btn-area">
                                <button className="btn text-sm btn-yellow">
                                    Filter
                                </button>
                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="panel panel-default table-panel">
                            <div className="table-responsive">

                                <table className="table table-striped jambo_table grey-table alt-table">

                                    <thead>
                                        <tr>
                                            <th className=" text-left">S.No.</th>
                                            <th className=" text-left">Event Name</th>
                                            <th className=" text-left">Market</th>
                                            <th className=" text-left">P/L</th>
                                            <th className=" text-left">Commission</th>
                                            <th className=" text-left">Created On</th>
                                        </tr>
                                    </thead>

                                    {/* ⭐ ONLY SHOW TBODY IF rows > 0 */}
                                    {rows.length > 0 && (
                                        <tbody id="statements">
                                            {rows.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.sno}</td>
                                                    <td>{item.event}</td>
                                                    <td>{item.market}</td>

                                                    <td>
                                                        {item.pl}
                                                    </td>

                                                    <td>{item.comm}</td>
                                                    <td>{item.createdOn}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}

                                </table>

                            </div>

                            {/* PAGINATION */}
                            <div className="pagination-wrap  left-pagination">
                                <p id="items" className="text-sm">Showing 1 to 1 of Entries 1</p>
                                <ul className="pagination">

                                    {/* FIRST - DOUBLE LEFT */}
                                    <li className={`page-item ${noData ? "disabled" : ""}`}>
                                        <span className="page-link">
                                            First
                                        </span>
                                    </li>

                                    {/* PREVIOUS */}
                                    <li className={`page-item ${noData ? "disabled" : ""}`}>
                                        <span className="page-link">
                                            Previous
                                        </span>
                                    </li>

                                    {/* PAGE 1 */}
                                    <li className={`page-item current ${noData ? "disabled" : ""}`}>
                                        <button className="page-link">1</button>
                                    </li>

                                    {/* NEXT */}
                                    <li className={`page-item ${noData ? "disabled" : ""}`}>
                                        <span className="page-link">
                                           Next
                                        </span>
                                    </li>

                                    {/* LAST - DOUBLE RIGHT */}
                                    <li className={`page-item ${noData ? "disabled" : ""}`}>
                                        <span className="page-link">
                                           Last
                                        </span>
                                    </li>

                                </ul>
                            </div>

                        </div>

                    </main>

                </div>
            </div>

        </div>
    );
}
