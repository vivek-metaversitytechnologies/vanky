import Image from "next/image";
import { cricketMatches } from "../data";

export function CricketSection() {
  return (
    <section className="vs-wrap vs-main">
      <div className="vs-heading">
        <Image src="/assets/images/ball.png" alt="Cricket" width={26} height={26} />
        <span className="sports-cat">Cricket</span>
      </div>

      <div className="vs-content">
        {cricketMatches.map((match) => (
          <div key={match.opponent} className="vs-strip">
            <div className="vs-table">

              <div className="match-opponent">
                <p className="match-name">
                  <Image src="/assets/images/jersey.svg" alt="" width={30} height={30} />
                  {match.opponent}
                </p>
                <Image src="/assets/images/tv.png" className="tv-img" alt="" width={30} height={30} />
              </div>

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
