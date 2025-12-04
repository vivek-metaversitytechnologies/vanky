"use client";

import Image from "next/image";
import { useState } from "react";
import "../../styles/customStyle.css";
import "../../styles/header.css";
import Marquee from "../../components/Layout/Marquee";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import RulesModal from "../../components/home/RulesModal";
import {
  CricketSection,
  DesktopCasinoSection,
  DesktopMenuSection,
} from "../../components/home/sections";

export default function MainDashboard() {
  const [showRules, setShowRules] = useState(true); // auto-open on login
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* PASS OPEN POPUP FUNCTION TO HEADER */}
      <HeaderDesktop onOpenRules={() => setShowRules(true)} />

      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">
           <SidebarDesktop />

          <main className="desktop-main">
            <DesktopMenuSection />
            <CricketSection />
            <DesktopCasinoSection />
          </main>

        </div>
      </div>

      {/* RULES POPUP */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
