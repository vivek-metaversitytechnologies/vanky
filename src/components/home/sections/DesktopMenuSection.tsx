import Image from "next/image";
import { menuIcons } from "../data";

export function DesktopMenuSection() {
  return (
    <div className="desktop-menu">
      {menuIcons.map((item) => (
        <a key={item.title} className="desktop-menu-item" href="#">
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
        </a>
      ))}
    </div>
  );
}
