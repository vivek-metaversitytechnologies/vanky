"use client";

import React from "react";
import "../../styles/popup.css";

export default function EditStakeModal({ onClose }) {
  // Exact values from your screenshot
  const chipValues = [
    500,
    1000,
    2000,
    3000,
    5000,
    10000,
    20000,
    25000,
    50000,
    100000,
    200000
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-box editstake-modal">

        {/* Header */}
        <div className="modal-header stakeModal">
          <span>Chip Setting</span>
          <button className="modal-close" onClick={onClose}>
            x
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form className="modal-form">

            <div className="modal-grid">
              {chipValues.map((value, i) => (
                <div className="form-group" key={i}>
                  <label>Chips Name {i + 1}:</label>
                  <input
                    type="text"
                    maxLength={7}
                    className="form-control"
                    defaultValue={value}
                  />
                </div>
              ))}
            </div>

           <div className="btn-wrap">
             <button type="submit" className="modal-tab-btn btn text-sm">
              Update Chip Setting
            </button>
           </div>

          </form>
        </div>

      </div>
    </div>
  );
}
