import { useState } from "react";

export default function BettingSection() {
    const [stake, setStake] = useState(0);
    const odds = 0.96;

    const results = ["A", "B", "A", "B", "A", "A", "A", "A", "A", "A", "A"];
    const stakeButtons = [1, 5, 10, 50, 100, 500, 1000, 5000];

    return (
        <div className="bg-[#132B16] min-h-screen p-4 text-white flex flex-col gap-4">
            {/* Last Results */}
            <div className="bg-[#16191c] rounded-md p-3">
                <h2 className="font-bold text-lg mb-2 bg-[#434343] p-2 rounded">
                    LAST RESULTS
                </h2>
                <div className="flex gap-2 overflow-x-auto">
                    {results.map((r, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 flex items-center justify-center rounded bg-[#434343] ${
                                r === "A" ? "text-red-600" : "text-yellow-500"
                            } font-bold flex-shrink-0`}
                        >
                            {r}
                        </div>
                    ))}
                </div>
            </div>

            {/* Place Bet */}
            <div className="bg-[#16191c] rounded-md p-3 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-2 p-2 rounded font-bold text-lg mb-2 bg-black p-2 rounded">
                    <h2 className="font-bold text-lg">PLACE BET</h2>
                    <span className="text-sm text-gray-300">Range: 100-5000</span>
                </div>

                {/* Bet info */}
                <div className="grid grid-cols-4 gap-2 text-center font-semibold text-gray-100">
                    <div>Player A</div>
                    <div>Odds: {odds}</div>
                    <div>Stake: {stake}</div>
                    <div className={`${stake * odds >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        Profit: {(stake * odds).toFixed(2)}
                    </div>
                </div>

                {/* Stake buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                    {stakeButtons.map((val) => (
                        <button
                            key={val}
                            onClick={() => setStake(val)}
                            className={`bg-[#243628] hover:bg-[#2f462c] py-2 rounded font-semibold transition-colors`}
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => setStake(0)}
                        className="bg-red-500 hover:bg-red-600 flex-1 py-2 rounded font-semibold transition-colors"
                    >
                        Reset
                    </button>
                    <button className="bg-emerald-500 hover:bg-emerald-600 flex-1 py-2 rounded font-semibold transition-colors">
                        Submit
                    </button>
                </div>
            </div>

            {/* My Bets */}
            <div className="bg-[#16191c] rounded-md p-3 flex flex-col gap-2">
                <h2 className="font-bold text-lg mb-2 bg-black p-2 rounded">MY BETS</h2>
                <div className="grid grid-cols-4 text-gray-300 font-semibold border-b border-gray-700 pb-1 mb-2 bg-[#1f2a21] p-1 rounded">
                    <span>Name</span>
                    <span>Odds</span>
                    <span>Stake</span>
                    <span>P/L</span>
                </div>
                <div className="text-gray-400 text-sm italic">No bets placed yet.</div>
            </div>
        </div>
    );
}