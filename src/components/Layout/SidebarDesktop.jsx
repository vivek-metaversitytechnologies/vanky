"use client";

import { useState } from "react";
import Link from "next/link";
import "../../styles/header.css";

export default function SidebarDesktop() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Sports</div>

      <ul className="sidebar-list">
        <li>
          <Link href="/home" className="sidebar-btn">
            In-Play
          </Link>
        </li>

        {/* CRICKET */}
        <li>
          <button className="sidebar-btn" onClick={() => toggleDropdown(1)}>
            Cricket <i className="fa-solid fa-caret-down"></i>
          </button>

          <ul className={`side-dropdown ${openDropdown === 1 ? "open" : ""}`}>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> India v South Africa</a>
            </li>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> Aspin Stallions v UAE Bulls</a>
            </li>
          </ul>
        </li>

        {/* TENNIS */}
        <li>
          <button className="sidebar-btn" onClick={() => toggleDropdown(2)}>
            Tennis <i className="fa-solid fa-caret-down"></i>
          </button>

          <ul className={`side-dropdown ${openDropdown === 2 ? "open" : ""}`}>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> Match 1</a>
            </li>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> Match 2</a>
            </li>
          </ul>
        </li>

        {/* SOCCER */}
        <li>
          <button className="sidebar-btn" onClick={() => toggleDropdown(3)}>
            Soccer <i className="fa-solid fa-caret-down"></i>
          </button>

          <ul className={`side-dropdown ${openDropdown === 3 ? "open" : ""}`}>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> Match 1</a>
            </li>
            <li>
              <a><i className="fa-solid fa-angles-right"></i> Match 2</a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}
