import Image from "next/image";
import Link from "next/link";
import { cricketMatches } from "../data";
import { formatMatchTime } from "./formatMatchTime";

type MatchItem = {
  matchName: string;
  openDate: string;
  matchId?: number | string;
  matchid?: number | string;
  id?: number | string;
};

type DisplayMatch = {
  opponent: string;
  time: string;
  matchId?: number | string;
};

export function CricketSection({
  matches,
  enableMatchLink = false,
  useApiOnly = false,
  dashboardExact = false,
}: {
  matches?: MatchItem[];
  enableMatchLink?: boolean;
  useApiOnly?: boolean;
  dashboardExact?: boolean;
}) {
  const list: DisplayMatch[] = matches?.length
    ? matches.map((item) => ({
      opponent: item.matchName,
      time: formatMatchTime(item.openDate),
      matchId: item.matchId ?? item.matchid ?? item.id,
    }))
    : (useApiOnly ? [] : cricketMatches);

  if (dashboardExact) {
    return (
      <div className="table table-striped jambo_table bulk_action cricket-dashboard-wrap">
        <div className="clearfix"></div>
        <div id="cricket" className="tab-pane fade in active cricket-pane">
          <div id="user_row_" className="lotus-title sportrow-4 cricket-lotus-title">
            <div className="head-matchname">
              <div className="match-head">
                <img src="/assets/images/ball.png" alt="Cricket" className="cricket-head-icon" />
                Cricket
              </div>
            </div>

            {list.length === 0 ? (
              <div className="sport_row cricket-dashboard-row">
                <div className="sport_name cricket-empty-state">No upcoming matches are there</div>
              </div>
            ) : null}

            {list.map((match) => {
              const linkContent = (
                <>
                  <img src="/assets/images/jersey.svg" alt="" className="dashboard-match-icon" />
                  {match.opponent}
                </>
              );

              return (
                <div key={`${match.opponent}-${match.matchId ?? "na"}`} className="sport_row cricket-dashboard-row">
                  <div className="sport_name cricket-dashboard-main">
                    {enableMatchLink && match.matchId != null && String(match.matchId) !== "" ? (
                      <Link href={`/match/${match.matchId}`} className="dashboard-match-link">
                        {linkContent}
                      </Link>
                    ) : (
                      <a className="dashboard-match-link">{linkContent}</a>
                    )}

                    <time className="dashboard-match-time">
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="13" height="13">
                        <path
                          fill="currentColor"
                          d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-8.586V7a1 1 0 10-2 0v5c0 .265.105.52.293.707l3 3a1 1 0 001.414-1.414L13 11.414z"
                        />
                      </svg>
                      {match.time}
                    </time>

                    <span className="dashboard-match-fav">
                      <i aria-hidden="true" className="fa fa-star-o"></i>
                    </span>
                  </div>

                  <div className="sport_name cricket-tv-side">
                    <img src="/assets/images/tv.png" className="tvwidth dashboard-tv-icon" alt="Live TV" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

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
                <p className="match-name">No upcoming matches are there</p>
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
