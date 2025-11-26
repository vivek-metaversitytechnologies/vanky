import { cricketMatches } from "../data";
import { ClockGlyph, TvGlyph } from "../icons";

export function CricketSection() {
  return (
    <section className="mt-8 rounded-[24px] border border-[#e5e5e5] shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 rounded-t-[24px] bg-[#255f00] px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
        <span className="text-lg">🏏</span>
        <span>Cricket</span>
      </div>
      <div className="bg-[#f6fbf6]">
        {cricketMatches.map((match) => (
          <div
            key={match.opponent}
            className="flex items-center gap-3 border-t border-[#d3e2d3] px-4 py-3 text-sm first:border-t-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-bold text-[#1b5798] shadow-inner">
              10
            </div>
            <div className="flex-1">
              <p className="text-[0.95rem] font-semibold text-[#1369c4]">
                {match.opponent}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#255f00]">
                <ClockGlyph />
                <span>{match.time}</span>
              </div>
            </div>
            <TvGlyph />
          </div>
        ))}
      </div>
    </section>
  );
}
