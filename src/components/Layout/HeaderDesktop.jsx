"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Marquee from "./Marquee";
import Navbar from "./Navbar";
import { fetchBalance } from "../../store/actions/balance";
import { logout } from "../../store/actions/auth";
import "../../styles/header.css";

export default function HeaderDesktop({
  onOpenRules = () => { },
  onOpenStakeModal = () => { },
}) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const dropdownRef = useRef(null);
  const reduxUserId = useSelector((state) => state.auth?.user?.userId);
  const { balance, liability } = useSelector((state) => state.balance);

  const userInfo = {
    id: isHydrated ? (reduxUserId || "-") : "-",
    main: isHydrated ? Number(balance || 0).toFixed(2) : "0.00",
    expo: isHydrated ? Number(liability || 0).toFixed(2) : "0.00",
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleNav = () => setNavOpen(true);
  const closeNav = () => setNavOpen(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    logout();
    router.replace("/login");
    router.refresh();
  };

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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    fetchBalance();
    const intervalId = setInterval(() => {
      fetchBalance();
    }, 1500);

    return () => clearInterval(intervalId);
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
          <Link href="/home" className="logo-wrap" aria-label="Go to home">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={90}
              height={32}
            />
          </Link>

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
                <span className="main-value">{userInfo.main}</span>
              </p>

              <p className="data-numbers expo-num">
                <b>Exposure:</b>
                <strong className="red">EXPO</strong>
                <span className="expo-value red">{userInfo.expo}</span>
              </p>
            </div>
          </div>

          {/* USER DROPDOWN */}
          <div
            className="user-profile dropdown-toggle"
            ref={dropdownRef}
          >
            <Image
              src="/assets/images/bethistory.svg"
              alt="user"
              width={30}
              height={30}
              className="user-img"
            />

            <span className="user-id" onClick={toggleDropdown}>
              {userInfo.id}
              <i className="fa-solid fa-angle-down"></i>
            </span>

            <ul
              className="dropdown-menu dropdown-usermenu pull-right"
              style={{ display: dropdownOpen ? "block" : "none" }}
            >
              <li>
                <Link href="/change-password" onClick={() => setDropdownOpen(false)}>
                  Change Password
                </Link>
              </li>
              <li className="dropdown-footer">
                <button type="button" onClick={handleLogout}>Log Out</button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <Navbar
        isOpen={navOpen}
        onClose={closeNav}
        onOpenRules={onOpenRules}
      />

    </header>
  );
}
