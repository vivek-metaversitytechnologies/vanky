import { casinoGames } from "../data";

export function DesktopCasinoSection() {
  return (
    <>
      <div className="mb-4 rounded bg-[#255f00] px-4 py-2 font-bold text-white">
        Casino Games
      </div>
      <div className="grid grid-cols-4 gap-6">
        {casinoGames.map((game) => (
          <div
            className="flex h-[130px] flex-col items-center justify-center rounded-lg bg-[#c8e4af] px-2 py-3 text-center shadow"
            key={game.title}
          >
            <div className="mb-2 text-lg font-bold">{game.title}</div>
            <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-4xl">
              🎲
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
