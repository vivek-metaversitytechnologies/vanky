import Image from "next/image";
import { tennisMatches } from "../data";

export function TennisSection() {
  return (
    <section className="vs-wrap vs-main">
      
      {/* SECTION HEADING */}
      <div className="vs-heading">
        <Image 
          src="/assets/images/inplay/tennis-icon.png" 
          alt="Tennis Icon" 
          width={26} 
          height={26} 
        />
        <span className="sports-cat">Tennis</span>
      </div>

      {/* MATCH LIST */}
      <div className="vs-content">
        {tennisMatches.map((match) => (
          <div key={match.opponent} className="vs-strip">
            <div className="vs-table">

              {/* OPPONENT SIDE */}
              <div className="match-opponent">
                <p className="match-name">
                  <Image 
                    src="/assets/images/jersey.svg" 
                    alt="Team Jersey" 
                    width={30} 
                    height={30} 
                  />
                  {match.opponent}
                </p>

                <Image 
                  src="/assets/images/tv.png"  className="tv-img"
                  alt="Live TV" 
                  width={30} 
                  height={30} 
                />
              </div>

              {/* MATCH TIME */}
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
