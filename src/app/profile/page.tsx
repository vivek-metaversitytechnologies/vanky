"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { urbApiClient } from "../../config/axiosConfig";
import { fetchBalance } from "../../store/actions/balance";
import type { RootState } from "../../store/store";
import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/profile.css";

import HeaderDesktop from "../../components/Layout/HeaderDesktop";
import SidebarDesktop from "../../components/Layout/SidebarDesktop";
import Marquee from "../../components/Layout/Marquee";

type ProfileData = {
  userId?: string;
  username?: string;
  contact?: string;
  dateOfJoining?: string;
  address?: string;
  helpline?: string;
  rateDifference?: number;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chips = useSelector((state: RootState) => state.balance.balance);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value.replace(" ", "T"));
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await urbApiClient.post("/enduser/get-self-profile", {});
      const data = response?.data?.data || null;
      setProfile(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Unable to fetch profile";
      setProfile(null);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    fetchBalance();
  }, []);

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <HeaderDesktop />

      {/* MOBILE MARQUEE */}
      <div className="marquee-wrap mobile">
        <Marquee />
      </div>

      {/* MAIN WRAPPER */}
      <div className="desktop-wrapper">
        <div className="desktop-container">

          {/* SIDEBAR */}
          <SidebarDesktop />
          <main className="desktop-main ">

            <div className="profile-wrapper">
              <div className="title_new_at">RATE INFORMATION</div>

              <table className="profile-table center-table">
                <tbody>
                  <tr>
                    <td className="left-col">Rate Difference.</td>

                    <td className="middle-col">
                      <select id="rateDiff" value={profile?.rateDifference ?? 1} disabled>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </td>

                    <td className="right-col">
                      <button className="update-btn" onClick={loadProfile} disabled={loading}>
                        {loading ? "Loading..." : "Refresh"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="title_new_at">PERSONAL INFORMATION</div>

              <table className="profile-table">
                <tbody>
                  {error ? (
                    <tr>
                      <td colSpan={2} className="right-col">{error}</td>
                    </tr>
                  ) : null}

                  <tr>
                    <td className="left-col">Client Name</td>
                    <td className="right-col">{profile?.username || "-"}</td>
                  </tr>

                  <tr>
                    <td className="left-col">Client Code</td>
                    <td className="right-col">{profile?.userId || "-"}</td>
                  </tr>

                  <tr>
                    <td className="left-col">Chips</td>
                    <td className="right-col mWallet">{Number(chips || 0).toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="left-col">Contact No.</td>
                    <td className="right-col">{profile?.contact || "-"}</td>
                  </tr>

                  <tr>
                    <td className="left-col">Date Of Joining</td>
                    <td className="right-col">{formatDate(profile?.dateOfJoining)}</td>
                  </tr>

                  <tr>
                    <td className="left-col">Address</td>
                    <td className="right-col">{profile?.address || "-"}</td>
                  </tr>
                </tbody>
              </table>
              <div className="title_new_at">COMPANY INFORMATION</div>

              <table className="profile-table">
                <tbody>
                  <tr className="profile-footer">
                    <td className="left-col">Help Line No.</td>
                    <td className="right-col company-number">{profile?.helpline || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
