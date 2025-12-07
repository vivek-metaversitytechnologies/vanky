"use client";

import React from "react";
import Image from "next/image";

interface RulesModalProps {
    visible: boolean;
    onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
    if (!visible) return null;

    return (
        <div className="rules-modal-overlay">
            <div className="rules-modal-content">
                <div className="rules-modal-box">

                {/* HEADER */}
                <div className="rules-modal-header">
                    <h2 className="rules-title">Rules</h2>
                    <button className="rules-close-btn" onClick={onClose}>×</button>
                </div>

                {/* IMAGE */}
                <div className="rules-modal-image">
                    <Image
                        src="/assets/images/teen20rules.jpg"
                        alt="Teen Patti Rules"
                        width={500}
                        height={400}
                        className="rules-img"
                    />
                </div>

                {/* TEXT RULES */}
                <div className="rules-list">
                    <p>1. Kabhi Bhi Result Atakne Ki Condition Me Stake Vapas Kiya Jaa Skta Hai.</p>
                    <p>2. Kisi Bhi Vaad Vivaad Ki Condition Me Antim Faisla Company Ka Hoga.</p>
                    <p>3. T20 TeenPatti Me Bade Or Chote Patto Ka Example Diya Gya Hai.</p>
                </div>

            </div>
            </div>
        </div>
    );
};

export default RulesModal;
