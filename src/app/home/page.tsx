"use client";

import { useState } from "react";
import Image from "next/image";

import "../../styles/customStyle.css";
import "../../styles/header.css";

import Marquee from "../../components/Layout/Marquee";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";

import RulesModal from "../../components/home/RulesModal";
import EditStakeModal from "../../components/home/EditStakeModal";

import {
  CricketSection,
  DesktopCasinoSection,
  DesktopMenuSection,
} from "../../components/home/sections";

export default function MainDashboard() {
  const [showRules, setShowRules] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);

  return (
    <div className="dashboard-wrapper">

      {/* HEADER + PASS BOTH MODAL FUNCTIONS */}
      <HeaderDesktop
        onOpenRules={() => setShowRules(true)}
        onOpenStakeModal={() => setShowStakeModal(true)}
      />

      {/* MOBILE MARQUEE */}
      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      {/* DESKTOP WRAPPER */}
      <div className="desktop-wrapper">
        <div className="desktop-container">

          {/* SIDEBAR */}
          <SidebarDesktop />

          {/* MAIN CONTENT */}
          <main className="desktop-main">
            <DesktopMenuSection />
            <CricketSection />
            <DesktopCasinoSection />
          </main>
        </div>
      </div>

      {/* RULES POPUP */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {/* EDIT STAKE POPUP */}
      {showStakeModal && (
        <EditStakeModal onClose={() => setShowStakeModal(false)} />
      )}

    </div>
  );
}
