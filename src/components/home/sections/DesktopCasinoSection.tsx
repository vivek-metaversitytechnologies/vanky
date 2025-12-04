import { casinoGames } from "../data";
import Image from "next/image";
export function DesktopCasinoSection() {
  return (
    <>
      <div className="casino-wrapper">
        <div className="casino-heading">
          <Image src="/assets/images/casino.png" alt="" width={30} height={30} />
          Casino Games
        </div>
        <div className="casino-grid">
          {casinoGames.map((game) => (
            <div
              className="casino-card"
              key={game.title}
            >
              <div className="casino-card-content">
                <Image
                  src={game.image}
                  alt={game.title}
                  width={70}
                  height={70}
                  className="desktop-menu-img"
                />
                <span>
                {game.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
