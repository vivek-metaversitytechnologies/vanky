"use client";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/layout/HeaderDesktop";
import SidebarDesktop from "../../components/layout/SidebarDesktop";
import Marquee from "../../components/layout/Marquee";

export default function CommissionPage() {
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

                        {/* TITLE */}
                        <div className="casino-heading no-radius uppercase " >My Commission</div>

                        {/* FILTER AREA */}
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

                        {/* TABLE */}
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

                                <tbody>
                                    {/* dynamic rows will come here */}
                                </tbody>

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

                        {/* PAGINATION */}
                        <div className="pagination-wrap">
                            <ul className="pagination">
                                <li className="disabled">
                                    <span><i className="fa fa-caret-left" /><i className="fa fa-caret-left" /></span>
                                </li>
                                <li className="disabled">
                                    <span><i className="fa fa-caret-left" /></span>
                                </li>
                                <li className="disabled">
                                    <span><i className="fa fa-caret-right" /></span>
                                </li>
                                <li className="disabled">
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
