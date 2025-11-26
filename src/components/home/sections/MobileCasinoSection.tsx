import Image from "next/image";

import { casinoGames } from "../data";

export function MobileCasinoSection() {
  return (
    <section className="mt-7">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#a3180b] px-3 py-1 text-xs font-bold uppercase tracking-[0.35em] text-[#ffd768]">
          Casino
        </span>
        <h3 className="text-lg font-semibold text-[#255f00]">Casino Games</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {casinoGames.map((game) => (
          <div
            key={game.title}
            className="overflow-hidden rounded-2xl bg-[#fdf4dc] shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
          >
            <div className="relative aspect-square">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 200px"
                priority={game.title === "TeenPatti T-20"}
              />
            </div>
            <div className="py-2 text-center text-sm font-semibold text-[#b57705]">
              {game.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
