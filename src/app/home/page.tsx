"use client";

import Image from "next/image";
import { useState } from "react";

import { MobileSidebar } from "../../components/home/MobileSidebar";
import RulesModal from "../../components/home/RulesModal";
import {
  CricketSection,
  DesktopCasinoSection,
  DesktopMenuSection,
  MobileCasinoSection,
  MobileMenuSection,
} from "../../components/home/sections";

export default function MainDashboard() {
  const [showRules, setShowRules] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#302837] lg:bg-white lg:px-0 lg:py-0">
      <div className="mx-auto w-full max-w-md overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] lg:hidden">
        <header className="bg-[#255f00] text-white shadow-inner">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <button
                  type="button"
                  aria-label="Open menu"
                  className="flex flex-col gap-[6px]"
                  onClick={() => setIsMenuOpen(true)}
              >
                <span className="block h-1 w-8 rounded-full bg-white"></span>
                <span className="block h-1 w-8 rounded-full bg-white"></span>
                <span className="block h-1 w-8 rounded-full bg-white"></span>
              </button>
              <div className="flex items-end gap-2 font-serif">
                <span className="text-3xl font-semibold italic tracking-widest">
                  vanky
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* BAL / EXPO */}
              <div className="text-left text-[13px] font-semibold leading-tight tracking-wide">
                <div>
                  BAL: <span className="font-bold">1,000.00</span>
                </div>
                <div className="text-[#ff1f1f]">EXPO. : 0.00</div>
              </div>

              {/* User icon + id */}
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center">
                  <Image
                    src="/assets/images/bethistory.svg"
                    alt="Bet history icon"
                    width={36}
                    height={36}
                  />
                </div>
                <button
                  type="button"
                  className="mt-1 text-[13px] font-semibold leading-none"
                >
                  c360348 <span className="text-[10px] align-middle">▾</span>
                </button>
              </div>
            </div>
          </div>
          <div className="border border-[#255f00] bg-[#edf1ea] overflow-hidden">
            <div className="marquee-track text-[11px] text-[#4083a9] font-semibold uppercase tracking-wide">
              <div className="flex flex-shrink-0 items-center gap-2 px-4 py-1">
                <span> 2025-11-19 03:37:25 -  WELCOME TO VANKY12.COM  )  [ New Zealand vs West Indies 34-overs per side game due tue rain ] </span>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 px-4 py-1" aria-hidden="true">
                <span> 2025-11-19 03:37:25 -  WELCOME TO VANKY12.COM  )  [ New Zealand vs West Indies 34-overs per side game due tue rain ] </span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 pb-10 pt-6">
          <MobileMenuSection />
          <CricketSection />
          <MobileCasinoSection />
        </main>
      </div>

      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="hidden lg:block">
        <div className="min-h-screen bg-white">
          <header className="bg-[#255f00] py-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-white">vanky</span>
              <span className="bg-white text-black px-2 py-0.5 rounded font-semibold">12</span>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-white">Main: 1,262.00</div>
              <div className="text-white">Exposure : 0.00</div>
              <div className="text-white">c272184</div>
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <span role="img" aria-label="profile">👤</span>
              </div>
            </div>
          </header>
          <nav className="bg-black text-white flex gap-8 px-6 py-2 text-base font-medium items-center">
            <span>Dashboard</span>
            <span>In-Play</span>
            <span>All Market Book</span>
            <span>Profile</span>
            <span>Password</span>
            <span>Rules</span>
            <span>My Commission</span>
            <span>Report</span>
            <span>Live Games</span>
            <span>Edit Stake</span>
          </nav>
          <div className="flex">
            <aside className="w-[170px] bg-[#f7f9f7] py-3 px-2 border-r border-gray-200">
              <div className="font-semibold text-gray-600 mb-3 pl-2">Sports</div>
              <ul className="space-y-2">
                <li>
                  <button className="w-full text-left py-1 px-2 rounded hover:bg-green-100 text-gray-700">In-Play</button>
                </li>
                <li>
                  <button className="w-full text-left py-1 px-2 rounded hover:bg-green-100 text-gray-700">Cricket</button>
                </li>
                <li>
                  <button className="w-full text-left py-1 px-2 rounded hover:bg-green-100 text-gray-700">Tennis</button>
                </li>
                <li>
                  <button className="w-full text-left py-1 px-2 rounded hover:bg-green-100 text-gray-700">Soccer</button>
                </li>
              </ul>
            </aside>
            <main className="flex-1 p-7">
              <DesktopMenuSection />
              <DesktopCasinoSection />
            </main>
          </div>
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}
