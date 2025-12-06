"use client";

import React, { useState } from "react";
import Link from "next/link";
import "../../styles/header.css";

export default function Navbar({ 
  isOpen, 
  onClose, 
  onOpenRules,
  onOpenEditStake        // ✅ ADDED HERE
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className={`nav-sidebar-wrap ${isOpen ? "open" : ""}`}>
      <nav className="main-nav">

        {/* MOBILE TITLE BAR */}
        <div className="header-titlebar">
          <div className="mob-user">
            <i className="fa-solid fa-user-secret"></i>
            <span className="badge-text">C125 (DEMO)</span>
          </div>

          <span className="close-mob-nav" onClick={onClose}>x</span>
        </div>

        {/* NAVIGATION */}
        <ul className="nav-list">

          <li>
            <Link href="/home" className="nav-link">
              <i className="fa-solid fa-house-chimney"></i>
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/inplay" className="nav-link">
              <i className="fa-solid fa-play"></i>
              In-Play
            </Link>
          </li>

          <li>
            <Link href="/all-market-book" className="nav-link">
              <i className="fa-solid fa-chart-column"></i>
              All Market Book
            </Link>
          </li>

          <li>
            <Link href="/profile" className="nav-link">
              <i className="fa-solid fa-user"></i>
              Profile
            </Link>
          </li>

          <li>
            <Link href="/change-password" className="nav-link">
              <i className="fa-solid fa-lock"></i>
              Password
            </Link>
          </li>

          <li>
            <Link href="/rate-information" className="nav-link">
              <i className="fa-solid fa-circle-info"></i>
              Rate Information
            </Link>
          </li>

          {/* RULES POPUP */}
          <li>
            <a className="nav-link" onClick={onOpenRules}>
              <i className="fa-solid fa-circle-info"></i>
              Rules
            </a>
          </li>

          <li>
            <Link href="/myCommission" className="nav-link">
              <i className="fa-solid fa-book"></i>
              My Commission
            </Link>
          </li>

          {/* REPORT DROPDOWN */}
          <li className={`dropdown-parent ${dropdownOpen ? "active" : ""}`}>
            <span
              className={`nav-link ${dropdownOpen ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              <i className="fa-solid fa-book"></i>
              Report
            </span>

            <ul className={`nav-link-dropdown ${dropdownOpen ? "open" : ""}`}>
              <li><Link href="/accountStatement">Account Statement</Link></li>
              <li><Link href="/ledger">Total Ledger</Link></li>
              <li><Link href="/profit-loss">Profit & Loss</Link></li>
              <li><Link href="/bet-history">Bet History</Link></li>
              <li><Link href="/bet-history-live">Live Bet History</Link></li>
            </ul>
          </li>

          <li>
            <Link href="/CasinoAdda" className="nav-link">
              <i className="fa-solid fa-gamepad"></i>
              Live Games
            </Link>
          </li>

          {/* EDIT STAKE POPUP TRIGGER */}
          <li>
            <a className="nav-link" onClick={onOpenEditStake}>
              <i className="fa-solid fa-book"></i>
              Edit Stake
            </a>
          </li>

        </ul>
      </nav>
    </div>
  );
}
