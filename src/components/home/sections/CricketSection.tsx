import Image from "next/image";
import Link from "next/link";
import { cricketMatches } from "../data";

type MatchItem = {
  matchName: string;
  openDate: string;
  matchId?: number;
};

type DisplayMatch = {
  opponent: string;
  time: string;
  matchId?: number;
};

export function CricketSection({
  matches,
  enableMatchLink = false,
  useApiOnly = false,
}: {
  matches?: MatchItem[];
  enableMatchLink?: boolean;
  useApiOnly?: boolean;
}) {
  const list: DisplayMatch[] = matches?.length
    ? matches.map((item) => ({
      opponent: item.matchName,
      time: item.openDate,
      matchId: item.matchId,
    }))
    : (useApiOnly ? [] : cricketMatches);

  return (
    <section className="vs-wrap vs-main">
      <div className="vs-heading">
        <img src="/assets/images/ball.png" alt="Cricket"  />
        <span className="sports-cat">Cricket</span>
      </div>

      <div className="vs-content">
        {list.length === 0 ? (
          <div className="vs-strip">
            <div className="vs-table">
              <div className="match-opponent">
                <p className="match-name">No matches found</p>
              </div>
            </div>
          </div>
        ) : null}

        {list.map((match) => (
          <div key={`${match.opponent}-${match.matchId ?? "na"}`} className="vs-strip">
            <div className="vs-table">

              <div className="match-opponent">
                <p className="match-name">
                  {enableMatchLink && match.matchId ? (
                    <Link href={`/match/${match.matchId}`} className="match-name">
                      <Image src="/assets/images/jersey.svg" alt="" width={30} height={30} />
                      {match.opponent}
                    </Link>
                  ) : (
                    <>
                      <Image src="/assets/images/jersey.svg" alt="" width={30} height={30} />
                      {match.opponent}
                    </>
                  )}
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
