"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import type { RootState } from "../../store/store";

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
import { fetchMatches } from "../../store/actions/matches";

export default function MainDashboard() {
  const [showRules, setShowRules] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const { list: matches } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    fetchMatches();
  }, []);

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
            <CricketSection matches={matches} />
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
