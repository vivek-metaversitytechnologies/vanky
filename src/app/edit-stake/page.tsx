"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  DEFAULT_STAKE_VALUES,
  clearStakeSettingsMessage,
  fetchStakeSettings,
  saveStakeSettings,
  setStakeSettingsValues,
} from "../../store/actions/stakeSettings";
import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/editStake.css";
import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

export default function EditStakePage() {
  const router = useRouter();
  const { values, loading, saving, error, message } = useSelector(
    (state: RootState) => state.stakeSettings as any
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const savedStakeValues = typeof window !== "undefined" ? localStorage.getItem("stakeValues") : null;
    if (savedStakeValues) {
      try {
        const parsed = JSON.parse(savedStakeValues);
        if (Array.isArray(parsed) && parsed.length === 12) {
          setStakeSettingsValues(parsed.map((value: any) => Number(value) || 0));
        }
      } catch (_error) {
        setStakeSettingsValues(DEFAULT_STAKE_VALUES);
      }
    }

    fetchStakeSettings();

    return () => {
      clearStakeSettingsMessage();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Array.isArray(values) && values.length === 12) {
      localStorage.setItem("stakeValues", JSON.stringify(values));
    }
  }, [values]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      clearStakeSettingsMessage();
    }, 1500);

    return () => clearTimeout(timer);
  }, [message]);

  const handleStakeChange = (index: number, inputValue: string) => {
    const nextValues = [...values];
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    nextValues[index] = numericValue === "" ? 0 : parseInt(numericValue, 10);
    setStakeSettingsValues(nextValues);
  };

  const handleSave = async () => {
    await saveStakeSettings(values);
  };

  const handleReset = async () => {
    await fetchStakeSettings();
  };

  return (
    <div className="dashboard-wrapper">
      <HeaderDesktop />

      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      <div className="desktop-wrapper">
        <div className="desktop-container">
          <SidebarDesktop />

          <main className="desktop-main">
            <div className="edit-stake-wrapper">
              <div className="edit-stake-card">
                {loading ? (
                  <div className="edit-stake-loading">Loading your stake preferences...</div>
                ) : (
                  <>
                    {error && <div className="edit-stake-feedback error">{error}</div>}
                    {message && <div className="edit-stake-feedback success">{message}</div>}

                    <div className="edit-stake-grid">
                      {values.map((value: number, index: number) => (
                        <div key={index} className="edit-stake-group">
                          <label>Stake Value {index + 1}:</label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleStakeChange(index, e.target.value)}
                            disabled={saving}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="edit-stake-actions">
                      <button type="button" className="edit-stake-btn save" onClick={handleSave} disabled={saving}>
                        {saving ? "SAVING..." : "SAVE"}
                      </button>
                      <button type="button" className="edit-stake-btn reset" onClick={handleReset} disabled={saving}>
                        RESET
                      </button>
                      <button type="button" className="edit-stake-btn save" onClick={() => router.back()} disabled={saving}>
                        BACK
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
