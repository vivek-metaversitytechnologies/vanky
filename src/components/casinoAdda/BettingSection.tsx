import { useState } from "react";

export default function BettingSection() {
    const [stake, setStake] = useState(0);
    const odds = 0.96;

    const results = ["A", "B", "A", "B", "A", "A", "A", "A", "A", "A", "A"];
    const stakeButtons = [1, 5, 10, 50, 100, 500, 1000, 5000];

    return (
        <div className="betting-section">

            {/* LAST RESULTS */}
            <div className="betting-box betting-last-results">
                <h2 className="betting-title">LAST RESULTS</h2>

                <div className="results-list">
                    {results.map((r, i) => (
                        <div 
                            key={i}
                            className={`result-item ${r === "A" ? "result-a" : "result-b"}`}
                        >
                            {r}
                        </div>
                    ))}
                </div>
            </div>


            {/* PLACE BET */}
            <div className="betting-box betting-placebet">

                <div className="placebet-header">
                    <h2 className="betting-title">PLACE BET</h2>
                    <span className="bet-range">Range: 100-5000</span>
                </div>

                {/* Bet Info */}
                <div className="bet-info">
                    <div className="bet-info-item">Player A</div>
                    <div className="bet-info-item">Odds: {odds}</div>
                    <div className="bet-info-item">Stake: {stake}</div>

                    <div 
                        className={`bet-info-item ${
                            stake * odds >= 0 ? "profit-positive" : "profit-negative"
                        }`}
                    >
                        Profit: {(stake * odds).toFixed(2)}
                    </div>
                </div>

                {/* Stake Buttons */}
                <div className="stake-buttons">
                    {stakeButtons.map((val) => (
                        <button
                            key={val}
                            onClick={() => setStake(val)}
                            className="stake-btn"
                        >
                            {val}
                        </button>
                    ))}
                </div>

                {/* Reset / Submit */}
                <div className="bet-actions">
                    <button 
                        onClick={() => setStake(0)}
                        className="bet-btn reset-btn"
                    >
                        Reset
                    </button>

                    <button className="bet-btn submit-btn">
                        Submit
                    </button>
                </div>
            </div>


            {/* MY BETS */}
            <div className="betting-box betting-mybets">
                <h2 className="betting-title">MY BETS</h2>

                <div className="mybets-header">
                    <span>Name</span>
                    <span>Odds</span>
                    <span>Stake</span>
                    <span>P/L</span>
                </div>

                <div className="mybets-empty">No bets placed yet.</div>
            </div>

        </div>
    );
}
