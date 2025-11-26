"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import BettingSection from "@/src/components/casinoAdda/BettingSection";

const Page = () => {
    const results = ["A", "A", "B", "B", "B", "A", "A", "A", "A", "B"];

    return (
        <div className="min-h-screen bg-[#264e34] text-white flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-3 bg-[#1f3224] text-sm">
                <h1 className="font-bold text-lg">HOME</h1>
                <div className="flex items-center gap-6">
                    <span className="font-semibold">Pts: 1262.00</span>
                    <span className="bg-gray-800 px-3 py-1 rounded text-sm">c272184</span>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 p-4 gap-4 ">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-6 bg-[#1f3224] p-2 rounded-lg  h-[100%]">
                    {/* Cards and Video side by side */}
                    <div className="flex gap-4">
                        {/* Cards */}
                        <div>
                            <div className='bg-black p-2'>
                                <span className='text-yellow-500 text-xl flex items-center justify-center'>TEENPAATTI T-20</span>
                                <span className='text-white block'>ROUND ID: 123456789012345</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-6 bg-black">
                            {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-red-600 w-12 h-16 border border-black rounded"
                                    />
                                ))}
                            </div>
                        </div>


                        {/* Video */}
                        <div
                            className="flex-1 flex justify-center items-center bg-black h-80 rounded-lg shadow-lg relative">
                            <div
                                className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-opacity-70"/>
                            <div
                                className="absolute bottom-3 right-3 flex items-center justify-center w-12 h-12 rounded-full border-2 border-red-500 text-red-500 font-bold text-lg">
                                8
                            </div>
                        </div>
                    </div>

                    {/* Odds Section */}
                    <div className="w-full mx-auto mt-4">
                        <table className="w-full text-center text-sm border-collapse">
                            <thead>
                            <tr className="bg-[#2d4131]">
                                <th className="py-2" width='2000px'>Main</th>
                                <th className="py-2" width='2000px'>Back</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-gray-600">
                                <td className="py-3 font-semibold bg-[#0e1f15]">Player A
                                    <span className='block'>0.00</span>
                                </td>
                                <td>
                                    <Button
                                        variant="outline"
                                        className="bg-[#243628] w-100 border-blue-400"
                                    >
                                        1.96
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 font-semibold bg-[#0e1f15]">Player B
                                    <span className='block'>0.00</span>
                                </td>
                                <td>
                                <Button
                                        variant="outline"
                                        className="bg-[#243628] border-blue-400 w-100"
                                    >
                                        1.96
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/4 flex flex-col gap-4">
                    <BettingSection />
                </div>
            </div>
        </div>
    );
};

export default Page;