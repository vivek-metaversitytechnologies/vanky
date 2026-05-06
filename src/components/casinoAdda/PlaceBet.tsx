"use client";

import { useState } from "react";

interface PlaceBetProps {
    playerName?: string;
    range?: string;
    oddsOptions?: number[];
    stakeButtons?: number[];
    onSubmit?: (stake: number, odds: number) => void;
}

export default function PlaceBet({
    playerName = "Player A",
    range = "100-5000",
    oddsOptions = [0.64, 0.70, 0.80],
    stakeButtons = [1, 5, 10, 50, 100, 500, 1000, 5000],
    onSubmit,
}: PlaceBetProps) {
    const [stake, setStake] = useState(0);
    const [selectedOdds, setSelectedOdds] = useState(oddsOptions[0]);

    const profit = stake * selectedOdds;

    const handleSubmit = () => {
        if (onSubmit) onSubmit(stake, selectedOdds);
    };

    return (
        <div className="betting-box betting-placebet">

            <div className="placebet-header">
                <h2 className="betting-title">
                    PLACE BET <span className="bet-range">Range:{range}</span>
                </h2>
            </div>

            <div className="bet-info-header">
                <span>(Bet for)</span>
                <span>Odds</span>
                <span>Stake</span>
                <span>Profit</span>
            </div>

            <div className="bet-info grid grid-cols-4 gap-2 items-center">

                {/* Player Name */}
                <span className="font-semibold text-sm">{playerName}</span>

                {/* Odds Select */}
                <select
                    className="bet-dropdown text-sm"
                    value={selectedOdds}
                    onChange={(e) => setSelectedOdds(Number(e.target.value))}
                >
                    {oddsOptions.map((o) => (
                        <option key={o} value={o}>{o.toFixed(2)}</option>
                    ))}
                </select>

                {/* Stake Input */}
                <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(Number(e.target.value))}
                    className="bet-input text-sm"
                />

                {/* Profit */}
                <div className={profit >= 0 ? "profit-positive" : "profit-negative"}>
                    {profit.toFixed(2)}
                </div>
            </div>

            {/* Quick Stake Buttons */}
            <div className="stake-buttons grid grid-cols-4 gap-1 mt-1">
                {stakeButtons.map((val) => (
                    <button key={val} className="stake-btn" onClick={() => setStake(val)}>
                        {val}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="bet-actions flex gap-2 mt-1">
                <button className="bet-btn reset-btn flex-1" onClick={() => setStake(0)}>
                    Reset
                </button>
                <button className="bet-btn submit-btn flex-1" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}
