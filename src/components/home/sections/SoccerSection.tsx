import Image from "next/image";
import { soccerMatches } from "../data";

export function SoccerSection() {
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
        {soccerMatches.map((match) => (
          <div key={match.opponent} className="vs-strip">
            <div className="vs-table">

              {/* OPPONENTS */}
              <p className="match-opponent">
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
              </p>

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
