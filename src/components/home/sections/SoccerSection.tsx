import Image from "next/image";
import { soccerMatches } from "../data";
import { formatMatchTime } from "./formatMatchTime";

type MatchItem = {
  matchName: string;
  openDate: string;
};

export function SoccerSection({
  matches,
  emptyMessage = "No upcoming matches are there",
}: {
  matches?: MatchItem[];
  emptyMessage?: string;
}) {
  const list = matches !== undefined
    ? matches.map((item) => ({
      opponent: item.matchName,
      time: formatMatchTime(item.openDate),
    }))
    : soccerMatches;

  return (
    <section className="vs-wrap vs-main">

      {/* SECTION HEADING */}
      <div className="vs-heading">
        <Image 
          src="/assets/images/inplay/soccer.svg" 
          alt="Soccer Icon" 
          width={26} 
          height={26} 
        />
        <span className="sports-cat">Soccer</span>
      </div>

      {/* MATCH LIST */}
      <div className="vs-content">
        {list.length === 0 ? (
          <div className="vs-strip">
            <div className="vs-table">
              <div className="match-opponent">
                <div className="match-name">{emptyMessage}</div>
              </div>
            </div>
          </div>
        ) : null}

        {list.map((match) => (
          <div key={match.opponent} className="vs-strip">
            <div className="vs-table">

              {/* OPPONENTS */}
              <div className="match-opponent">
                <div className="match-name">
                  <Image 
                    src="/assets/images/jersey.svg" 
                    alt="Team Jersey" 
                    width={30} 
                    height={30} 
                  />
                  {match.opponent}
                </div>
                <Image 
                  src="/assets/images/tv.png"  className="tv-img"
                  alt="Live TV" 
                  width={30} 
                  height={30} 
                />
              </div>

              {/* TIME */}
              <div className="match-time">
                <i className="fa-solid fa-clock"></i>
                <span>{match.time}</span>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
