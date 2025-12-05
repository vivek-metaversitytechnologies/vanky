"use client";

import { useState } from "react";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/layout/HeaderDesktop";
import SidebarDesktop from "../../components/layout/SidebarDesktop";
import Marquee from "../../components/layout/Marquee";

export default function CommissionPage() {

    // ⭐ STATE FOR TABLE DATA
    const [rows] = useState([]); 
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

                        <div className="casino-heading no-radius uppercase " >My Commission</div>

                        <div className="commission-filters">
                            <div className="filter-item">
                                <input type="date" className="filter-input input-sm form-control" />
                            </div>

                            <div className="filter-item">
                                <input type="date" className="filter-input input-sm form-control" />
                            </div>

                            <div className="filter-btn">
                                <button className=" modal-tab-btn btn">Search</button>
                            </div>
                        </div>

                        <div className="commission-table-wrap">
                            <table className="commission-table table jambo_table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>M. Comm.</th>
                                        <th>S. Comm.</th>
                                        <th>C. Comm.</th>
                                        <th>T. Comm.</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>

                                {/* ⭐ SHOW TBODY ONLY IF THERE ARE ROWS */}
                                {rows.length > 0 && (
                                    <tbody>
                                        {rows.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.date}</td>
                                                <td>{item.m}</td>
                                                <td>{item.s}</td>
                                                <td>{item.c}</td>
                                                <td>{item.t}</td>
                                                <td>{item.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}

                                <tfoot>
                                    <tr>
                                        <td>Total</td>
                                        <td className="text-success">0</td>
                                        <td className="text-success">0</td>
                                        <td className="text-success">0</td>
                                        <td className="text-success">0</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* ⭐ ORIGINAL PAGINATION — UNCHANGED STRUCTURE */}
                        <div className="pagination-wrap">
                            <ul className="pagination">

                                <li className={noData ? "disabled" : ""}>
                                    <span><i className="fa fa-caret-left" /><i className="fa fa-caret-left" /></span>
                                </li>

                                <li className={noData ? "disabled" : ""}>
                                    <span><i className="fa fa-caret-left" /></span>
                                </li>

                                <li className={noData ? "disabled" : ""}>
                                    <span><i className="fa fa-caret-right" /></span>
                                </li>

                                <li className={noData ? "disabled" : ""}>
                                    <span><i className="fa fa-caret-right" /><i className="fa fa-caret-right" /></span>
                                </li>

                                <li className="active">
                                    <button>1</button>
                                </li>

                            </ul>
                        </div>

                    </main>

                </div>
            </div>
        </div>
    );
}
