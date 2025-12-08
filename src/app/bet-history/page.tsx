"use client";

import { useState, useEffect, useMemo } from "react";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";
import "../../styles/betHistory.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

export default function BetHistoryPage() {
    // raw data (sample) - replace with API results later
    const initialData = [
        {
            sno: 1,
            client: "client001",
            description: "Royal Champs v Aspin Stallions",
            selection: "Aspin Stallions",
            sport: "Cricket",
            type: "Back",
            odds: "1.75",
            stack: 100,
            date: "2025-11-26 21:30:00",
            pl: 50,
            profit: 50,
            liability: 0,
            betType: "Single",
            status: "Settled",
            ip: "192.168.1.10",
        },
        {
            sno: 2,
            client: "client002",
            description: "Bangladesh v Ireland",
            selection: "Bangladesh",
            sport: "Cricket",
            type: "Lay",
            odds: "2.10",
            stack: 50,
            date: "2025-11-19 09:00:00",
            pl: -20,
            profit: 0,
            liability: 20,
            betType: "Single",
            status: "Settled",
            ip: "192.168.1.11",
        },
        {
            sno: 3,
            client: "client003",
            description: "St. Lucia Kings v Guyana Amazon Warriors",
            selection: "St. Lucia Kings",
            sport: "Cricket",
            type: "Back",
            odds: "1.95",
            stack: 200,
            date: "2025-08-27 04:30:00",
            pl: 0,
            profit: 0,
            liability: 0,
            betType: "Single",
            status: "Settled",
            ip: "192.168.1.12",
        },
    ];

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Settled");
    const [activeTab, setActiveTab] = useState("All");

    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setRows(initialData);
        setFilteredRows(initialData);
    }, []);

    const parseRowDate = (s) => {
        if (!s) return null;
        const t = s.replace(" ", "T");
        const d = new Date(t);
        return isNaN(d.getTime()) ? null : d;
    };

    const applyFilters = (tabKey = activeTab) => {
        let result = [...rows];

        if (statusFilter !== "all") {
            result = result.filter((r) => {
                if (statusFilter === "Open") return r.status.toLowerCase() === "open";
                if (statusFilter === "Settled") return r.status.toLowerCase() === "settled";
                return true;
            });
        }
        if (tabKey !== "All") {
            result = result.filter(
                (r) => r.sport.toLowerCase() === tabKey.toLowerCase()
            );
        }

        if (fromDate) {
            const f = new Date(fromDate + "T00:00:00");
            result = result.filter((r) => {
                const rd = parseRowDate(r.date);
                return rd && rd >= f;
            });
        }

        if (toDate) {
            const t = new Date(toDate + "T23:59:59");
            result = result.filter((r) => {
                const rd = parseRowDate(r.date);
                return rd && rd <= t;
            });
        }

        if (searchTerm.trim()) {
            const s = searchTerm.trim().toLowerCase();
            result = result.filter(
                (r) =>
                    r.description.toLowerCase().includes(s) ||
                    r.selection.toLowerCase().includes(s) ||
                    r.client.toLowerCase().includes(s)
            );
        }

        setFilteredRows(result);
    };

    const noData = useMemo(() => filteredRows.length === 0, [filteredRows]);

    // Tabs
    const tabs = [
        { label: "All", key: "All" },
        { label: "Cricket", key: "Cricket" },
        { label: "Tennis", key: "Tennis" },
        { label: "Soccer", key: "Soccer" },
        { label: "Fancy", key: "Fancy" },
    ];

    const onPageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
    };

    const resetFilters = () => {
        setFromDate("");
        setToDate("");
        setSearchTerm("");
        setStatusFilter("Settled");
        setActiveTab("All");
        setFilteredRows(rows);
    };

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
                                Bet History
                                <select
                                    id="pages"
                                    className="filter-select"
                                    style={{ color: "black", marginLeft: 8 }}
                                    value={pageSize}
                                    onChange={onPageSizeChange}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </span>
                        </div>

                        {/* FILTERS */}
                        <div className="commission-filters panel-body responsive-filter">

                            {/* FROM DATE */}
                            <div className=" filter-item">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            {/* TO DATE */}
                            <div className=" filter-item">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            {/* SEARCH */}
                            <div className=" filter-item small-field">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* STATUS */}
                            <div className=" filter-item">
                                <select
                                    className="form-control"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="Open">Open</option>
                                    <option value="Settled">Settled</option>
                                </select>
                            </div>

                            {/* FILTER BUTTON */}
                            <div className=" filter-btn-area">
                                <button className="btn btn-yellow text-sm" onClick={() => applyFilters()}>
                                    <i className="fa fa-filter" /> Filter
                                </button>

                                <button
                                    className="btn btn-danger text-sm"
                                    style={{ marginLeft: "8",display:"none" }}
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="tab_bets get-mchlist" >
                            <ul id="betsalltab" className="nav nav-pills match-lists">
                                {tabs.map((t) => (
                                    <li key={t.key} className={activeTab === t.key ? "active" : ""}>
                                        <a
                                            onClick={() => {
                                                setActiveTab(t.key);
                                                applyFilters(t.key);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {t.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* TABLE */}
                        <div className="panel panel-default table-panel">
                            <div className="table-responsive">
                                <table className="table table-striped jambo_table bulk_action grey-table">
                                    <thead>
                                        <tr className="headings">
                                            <th className="text-left">S.No.</th>
                                            <th className="text-left">Client</th>
                                            <th className="text-left">Description</th>
                                            <th className="text-left">Selection</th>
                                            <th className="text-left">Type</th>
                                            <th className="text-left">Odds</th>
                                            <th className="text-left">Stack</th>
                                            <th className="text-left">Date</th>
                                            <th className="text-left">P_L</th>
                                            <th className="text-left">Profit</th>
                                            <th className="text-left">Liability</th>
                                            <th className="text-left">Bet type</th>
                                            <th className="text-left">Status</th>
                                            <th>IP</th>
                                        </tr>
                                    </thead>

                                    {filteredRows.length > 0 && (
                                        <tbody >
                                            {filteredRows.map((r, idx) => (
                                                <tr key={idx}>
                                                    <td>{r.sno}</td>
                                                    <td>{r.client}</td>
                                                    <td>{r.description}</td>
                                                    <td>{r.selection}</td>
                                                    <td>{r.type}</td>
                                                    <td>{r.odds}</td>
                                                    <td>{r.stack}</td>
                                                    <td>{r.date}</td>
                                                    <td className={r.pl >= 0 ? "green" : "red"}>{r.pl}</td>
                                                    <td>{r.profit}</td>
                                                    <td>{r.liability}</td>
                                                    <td>{r.betType}</td>
                                                    <td>{r.status}</td>
                                                    <td>{r.ip}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>


                            </div>
                                {/* PAGINATION */}
                                <div className="pagination-wrap  left-pagination">
                                    <p id="items" className="text-sm">
                                        {noData
                                            ? "Showing 0 to 0 of Entries 0"
                                            : `Showing 1 to ${filteredRows.length} of Entries ${filteredRows.length}`}
                                    </p>
                                    <ul className="pagination">
                                        {/* <li className={`page-item ${noData ? "disabled" : ""}`}>
                                            <span className="page-link">First</span>
                                        </li>
                                        <li className={`page-item ${noData ? "disabled" : ""}`}>
                                            <span className="page-link">Previous</span>
                                        </li> */}
                                        <li className={`page-item current text-dark ${noData ? "disabled" : ""}`} style={{fontWeight:"600"}}>
                                            <button className="page-link">1</button>
                                        </li>
                                        {/* <li className={`page-item ${noData ? "disabled" : ""}`}>
                                            <span className="page-link">Next</span>
                                        </li>
                                        <li className={`page-item ${noData ? "disabled" : ""}`}>
                                            <span className="page-link">Last</span>
                                        </li> */}

                                    </ul>
                                </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
