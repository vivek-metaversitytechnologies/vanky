import Image from "next/image";
import Link from "next/link";
import { menuIcons } from "../data";

export function DesktopMenuSection() {
  return (
    <div className="desktop-menu">
      {menuIcons.map((item) => (
        <Link key={item.title} href={item.link} className="desktop-menu-item">
          
          <div className="desktop-menu-icon-inner">
            <Image
              src={item.image}
              alt={item.title}
              width={70}
              height={70}
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
