"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Marquee from "./Marquee";
import Navbar from "./Navbar";
import "../../styles/header.css";

export default function HeaderDesktop({
  user = { id: "c272184", main: "1,262.00", expo: "0.00" },
  onOpenRules = () => { },
  onOpenStakeModal = () => { }   // ⭐ NEW PROP ADDED
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleNav = () => setNavOpen(true);
  const closeNav = () => setNavOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">

      <div className="header-top">

        {/* LEFT SIDE */}
        <div className="header-left">

          {/* HAMBURGER */}
          <div className="nav-toggle" onClick={toggleNav}>
            <i className="fa-solid fa-bars"></i>
          </div>

          {/* LOGO */}
          <div className="logo-wrap">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={90}
              height={32}
            />
          </div>

          {/* DESKTOP MARQUEE */}
          <div className="marquee-wrap desktop">
            <div className="img-wrap">
              <Image
                src="/assets/images/bell-icon.png"
                alt=""
                width={26}
                height={26}
              />
            </div>
            <Marquee />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="header-right">

          {/* BALANCE DISPLAY */}
          <div className="header-balance hidden-xs">

            <span className="wallet-icon">
              <Image
                src="/assets/images/wallet-icons.png"
                alt="wallet"
                width={26}
                height={26}
              />
            </span>

            <div className="data">
              <p className="data-numbers main-num">
                <b>Main:</b> <strong>BAL</strong>
                <span className="main-value">{user.main}</span>
              </p>

              <p className="data-numbers expo-num">
                <b>Exposure:</b>
                <strong className="red">EXPO</strong>
                <span className="expo-value red">{user.expo}</span>
              </p>
            </div>
          </div>

          {/* USER DROPDOWN */}
          <div
            className="user-profile dropdown-toggle"
            ref={dropdownRef}
            onClick={toggleDropdown}
          >
            <Image
              src="/assets/images/bethistory.svg"
              alt="user"
              width={30}
              height={30}
              className="user-img"
            />

            <span className="user-id">
              {user.id}
              <i className="fa-solid fa-angle-down"></i>
            </span>

            <ul
              className="dropdown-menu dropdown-usermenu pull-right"
              style={{ display: dropdownOpen ? "block" : "none" }}
            >
              <li><a href="/change-password">Change Password</a></li>
              <li className="dropdown-footer"><a>Log Out</a></li>
            </ul>
          </div>

        </div>
      </div>

      <Navbar
        isOpen={navOpen}
        onClose={closeNav}
        onOpenRules={onOpenRules}
        onOpenEditStake={onOpenStakeModal}   // ✅ CORRECT NAME
      />

    </header>
  );
}
