"use client";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/table.css";

import HeaderDesktop from "../../components/layout/HeaderDesktop";
import SidebarDesktop from "../../components/layout/SidebarDesktop";
import Marquee from "../../components/layout/Marquee";

export default function AccountStatementPage() {
  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <HeaderDesktop />

      {/* MOBILE MARQUEE */}
      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">

          {/* SIDEBAR */}
          <SidebarDesktop />

          {/* MAIN CONTENT */}
          <main className="desktop-main commission-wrap">

            {/* PAGE TITLE */}
            <div className="casino-heading no-radius uppercase acc-heading">
              Account Statement
                <button className="btn">Back</button>
            </div>

            {/* FILTER AREA (same 6 buttons format) */}
            <div className="commission-filters panel-body">

              <div className="filter-item">
                <input type="date" className="input-sm input-s form-control" />
              </div>

              <div className="filter-item">
                <input type="date" className="input-sm input-s form-control" />
              </div>

              <div className="filter-buttons-group">

                <button className="btn btn-s-md btn-success">Search</button>
                <button className="btn btn-s-md btn-danger">Reset</button>
                <button className="btn btn-s-md btn-primary">All</button>
                <button className="btn btn-s-md btn-success">P&amp;L</button>
                <button className="btn btn-s-md btn-danger">PDC</button>
                <button className="btn btn-s-md btn-light">Account</button>

              </div>
            </div>

            {/* TABLE */}
            <div className="panel panel-default table-panel">
              <div className="table-responsive">

                <table className="table table-bordered table-striped jambo_table account-table">
                  <thead>
                    <tr>
                      <th className="tablelightblue">Date</th>
                      <th className="tabledarkblue">Description</th>
                      <th className="tablelightblue">Prev. Bal</th>
                      <th className="tabledarkblue">CR</th>
                      <th className="tablelightblue">DR</th>
                      <th className="tabledarkblue">Comm+</th>
                      <th className="tablelightblue">Comm-</th>
                      <th className="tabledarkblue">Balance</th>
                    </tr>
                  </thead>

                  <tbody id="statements">
                    {/* Dynamic rows to be added later */}
                  </tbody>
                </table>

              </div>

              {/* PAGINATION (Same as screenshot) */}
              <div className="pagination-wrap center-pagi">
                <ul className="pagination">

                  <li className="page-item disabled">
                    <span className="page-link">
                      <i className="fa fa-caret-left"></i>
                      <i className="fa fa-caret-left"></i>
                    </span>
                  </li>

                  <li className="page-item disabled">
                    <span className="page-link">
                      <i className="fa fa-caret-left"></i>
                    </span>
                  </li>

                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>

                  <li className="page-item disabled">
                    <span className="page-link">
                      <i className="fa fa-caret-right"></i>
                    </span>
                  </li>

                  <li className="page-item disabled">
                    <span className="page-link">
                      <i className="fa fa-caret-right"></i>
                      <i className="fa fa-caret-right"></i>
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
