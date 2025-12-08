import { casinoGames } from "../data";
export function DesktopCasinoSection() {
  return (
    <>
      <div className="casino-wrapper">
        <div className="casino-heading">
          <img src="/assets/images/casino.png" alt="" />
          Casino Games
        </div>
        <div className="casino-grid">
          {casinoGames.map((game) => (
            <div
              className="casino-card"
              key={game.title}
            >
              <div className="casino-card-content">
                <img
                  src={game.image}
                  alt={game.title}
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
