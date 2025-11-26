import { menuIcons } from "../data";

export function DesktopMenuSection() {
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-7">
      {menuIcons.map((icon) => (
        <div key={icon.title} className="flex w-[135px] flex-col items-center">
          <div className="mb-1 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#255f00] shadow-lg">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl">
              {icon.icon}
            </div>
          </div>
          <span className="text-center text-sm font-semibold text-[#255f00]">
            {icon.title}
          </span>
        </div>
      ))}
    </div>
  );
}
