import { menuIcons } from "../data";

export function MobileMenuSection() {
  return (
    <section className="grid grid-cols-2 gap-x-8 gap-y-7">
      {menuIcons.map((item) => (
        <div key={item.title} className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#255f00] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl">
              {item.icon}
            </div>
          </div>
          <span
            className={`mt-2 text-center text-sm font-semibold tracking-wide text-[#3f6f99] ${
              item.uppercase ? "uppercase" : "normal-case"
            }`}
          >
            {item.title}
          </span>
        </div>
      ))}
    </section>
  );
}
