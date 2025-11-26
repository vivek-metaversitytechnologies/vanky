import React from "react";

export default function MatchPage() {
    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-60 bg-gray-100 border-r p-4">
                <h2 className="text-lg font-bold mb-4">Sports</h2>
                <ul className="space-y-2">
                    <li className="cursor-pointer hover:text-blue-600">In-Play</li>
                    <li className="cursor-pointer hover:text-blue-600">Cricket</li>
                    <li className="cursor-pointer hover:text-blue-600">Tennis</li>
                    <li className="cursor-pointer hover:text-blue-600">Soccer</li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-[#2e5e1f] text-white flex justify-between items-center px-4 py-3">
                    <h1 className="text-xl font-bold">vanky12</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <span>Main: <strong>1,262.00</strong></span>
                        <span>Exposure: <strong className="text-red-500">0.0</strong></span>
                        <span className="bg-gray-700 rounded px-2 py-1">c272184</span>
                    </div>
                </header>

                {/* Navigation Bar */}
                <nav className="bg-black text-white flex gap-4 px-4 py-2 text-sm">
                    {[
                        "Dashboard",
                        "In-Play",
                        "All Market Book",
                        "Profile",
                        "Password",
                        "Rules",
                        "My Commission",
                        "Report",
                        "Live Games",
                        "Edit Stake"
                    ].map((item) => (
                        <button key={item} className="hover:text-yellow-300">
                            {item}
                        </button>
                    ))}
                </nav>

                {/* Match Info */}
                <div className="flex justify-between bg-gray-200 p-2 items-center">
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-500 text-white rounded px-2">India</span>
                        <span className="bg-orange-500 text-white rounded px-2">Sri Lanka</span>
                    </div>
                    <span className="text-green-600 text-sm">LIVE TV</span>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-auto p-4">
                    {/* Bookmaker Section */}
                    <div className="border rounded overflow-hidden mb-6">
                        <div className="bg-yellow-400 px-3 py-1 font-bold text-black">
                            Bookmaker <span className="text-xs">Min/Max - 100 / 200000</span>
                        </div>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">Team</th>
                                <th className="border p-2">LAGAI</th>
                                <th className="border p-2">KHAI</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border p-2">India</td>
                                <td className="border p-2 bg-blue-200 text-center">23</td>
                                <td className="border p-2 bg-red-200 text-center">25</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Sri Lanka</td>
                                <td className="border p-2 bg-blue-200 text-center">400</td>
                                <td className="border p-2 bg-red-200 text-center">434</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Toss Book Section */}
                    <div className="border rounded overflow-hidden">
                        <div className="bg-yellow-400 px-3 py-1 font-bold text-black">
                            Toss Book <span className="text-xs">Min/Max - 100 / 10000</span>
                        </div>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">Team</th>
                                <th className="border p-2">LAGAI</th>
                                <th className="border p-2">KHAI</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border p-2">India</td>
                                <td className="border p-2 bg-blue-200 text-center">0.90</td>
                                <td className="border p-2 bg-red-200 text-center">0</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Sri Lanka</td>
                                <td className="border p-2 bg-blue-200 text-center">0.90</td>
                                <td className="border p-2 bg-red-200 text-center">0</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}