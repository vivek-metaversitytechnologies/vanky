"use client";

import "../../styles/customStyle.css";
import "../../styles/header.css";
import "../../styles/profile.css"; // make this file

import HeaderDesktop from "../../components/layout/HeaderDesktop";
import SidebarDesktop from "../../components/layout/SidebarDesktop";
import Marquee from "../../components/layout/Marquee";

export default function ProfilePage() {
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
                      <select id="rateDiff">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </td>

                    <td className="right-col">
                      <button className="update-btn">Update</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="title_new_at">PERSONAL INFORMATION</div>

              <table className="profile-table">
                <tbody>
                  <tr>
                    <td className="left-col">Client Name</td>
                    <td className="right-col">Demovanky</td>
                  </tr>

                  <tr>
                    <td className="left-col">Client Code</td>
                    <td className="right-col">c360348</td>
                  </tr>

                  <tr>
                    <td className="left-col">Chips</td>
                    <td className="right-col mWallet">1,000.00</td>
                  </tr>

                  <tr>
                    <td className="left-col">Contact No.</td>
                    <td className="right-col">0</td>
                  </tr>

                  <tr>
                    <td className="left-col">Date Of Joining</td>
                    <td className="right-col">30 Jun 2025 18:51 PM</td>
                  </tr>

                  <tr>
                    <td className="left-col">Address</td>
                    <td className="right-col">--</td>
                  </tr>
                </tbody>
              </table>
              <div className="title_new_at">COMPANY INFORMATION</div>

              <table className="profile-table">
                <tbody>
                  <tr className="profile-footer">
                    <td className="left-col">Help Line No.</td>
                    <td className="right-col company-number">+91 1234567890</td>
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
