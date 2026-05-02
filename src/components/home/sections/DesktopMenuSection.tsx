"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { menuIcons } from "../data";

export function DesktopMenuSection() {
  const router = useRouter();

  useEffect(() => {
    menuIcons.forEach((item) => {
      router.prefetch(item.link);
    });
  }, [router]);

  return (
    <div className="desktop-menu">
      {menuIcons.map((item) => (
        <Link key={item.title} href={item.link} className="desktop-menu-item">
          
          <div className="desktop-menu-icon-inner">
            <img
              src={item.image}
              alt={item.title}
              className="desktop-menu-img"
            />
          </div>

          <span className="desktop-menu-title">
            {item.uppercase ? item.title.toUpperCase() : item.title}
          </span>

        </Link>
      ))}
    </div>
  );
}
