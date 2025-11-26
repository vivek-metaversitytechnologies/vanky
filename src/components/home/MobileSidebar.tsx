import { useEffect, useState } from "react";
import { mobileNavItems } from "./data";
import {
  faChartColumn,
  faCircle,
  faCoins,
  faFileLines,
  faGamepad,
  faGauge,
  faKey,
  faPen,
  faPlayCircle,
  faScroll,
  faUser,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navIconMap: Record<string, IconDefinition> = {
  Dashboard: faGauge,
  "In-Play": faPlayCircle,
  "All Market Book": faChartColumn,
  Profile: faUser,
  Password: faKey,
  Rules: faScroll,
  "My Commission": faCoins,
  Report: faFileLines,
  "Live Games": faGamepad,
  "Edit Stake": faPen,
};

const getNavIcon = (title: string) => navIconMap[title] ?? faCircle;

export type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isActive, setIsActive] = useState(isOpen);
  const animationDuration = 700;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      setShouldRender(true);
    } else {
      setIsActive(false);
      timeoutId = setTimeout(() => setShouldRender(false), animationDuration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    let frameId: number | undefined;
    const activate = () => setIsActive(true);

    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      frameId = window.requestAnimationFrame(activate);
    } else {
      const timeoutId = setTimeout(activate, 16);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (frameId && typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`absolute inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-[#255f00] shadow-[0_20px_40px_rgba(0,0,0,0.4)] transform transition-transform duration-700 ${
          isActive ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex text-white">
          <div className="flex flex-1 items-center bg-[#ffc21e] px-2 py-2 text-[#1e2613]">
            <div className="flex items-center justify-center text-xl text-white">
              <FontAwesomeIcon icon={faUserSecret} className="w-5 h-5 text-[#255f00]" style={{fontSize: "34px"}}/>
            </div>
            <span className="text-base font-bold tracking-wider">C360348</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#ffc21e] px-4 text-2xl font-black  text-[#1e2613]"
            aria-label="Close menu"
          >
            X
          </button>
        </div>
        <div className="bg-[#255f00] text-white">
          <nav className="mt-1 border-t border-[#255f00]">
            {mobileNavItems.map((item) => (
              <button
                key={item.title}
                type="button"
                className="flex w-full items-center text-left text-sm font-semibold tracking-wide"
                style={{borderBottom: "1px solid #6c6c6c"}}
              >
                <span className="flex flex-1 items-center gap-1 px-2 py-1">
                  <span className="text-base text-white">
                    <FontAwesomeIcon
                      icon={getNavIcon(item.title)}
                      className="h-4 w-4 text-white"
                    />
                  </span>
                  {item.title}
                </span>
                {item.action ? (
                  <span className="flex h-full items-center border-l border-[#255f00] px-4 text-lg text-[#ffe77b]">
                    {item.action}
                  </span>
                ) : (
                  <span className="w-2" aria-hidden="true"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
