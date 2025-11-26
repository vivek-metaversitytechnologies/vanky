"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CasinoAdda = () => {
    const games = [
        { name: "20-20 TeenPatti", code: "ODT20", img: "/assets/images/teen20.jpg" },
        { name: "TeenPatti Day", code: "OD1Day", img: "/assets/images/teen.jpg" },
        { name: "32 Cards A", code: "OD32card", img: "/assets/images/card32.jpg" },
        { name: "Lucky 7", code: "ODLucky7", img: "/assets/images/lucky7.jpg" },
        { name: "20-20 Dragon Tiger", code: "ODdt20", img: "/assets/images/dt20.jpg" },
        { name: "Anthony", code: "ODaaa", img: "/assets/images/aaa.jpg" },
        { name: "Andar Bahar 2", code: "ODab20", img: "/assets/images/ab20.jpg" },
        { name: "Dragon Tiger 2", code: "ODDT202", img: "/assets/images/lucky7eu.jpg" },
        { name: "Casino 20-20 DTL", code: "ODDTL20", img: "/assets/images/abj.jpg" },
        { name: "Lucky 7 B", code: "ODLucky7b", img: "/assets/images/dtl20.jpg" },
    ];

    return (
        <div className="min-h-screen bg-[#265236] p-4 text-white">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-base font-bold">rolex12</h1>
                <p className="text-xs">Pts: 1262.00</p>
            </div>

            {/* Category Buttons */}
            <div className="flex gap-2 mb-4">
                <Button
                    variant="outline"
                    className="border-yellow-400 bg-transparent text-gray-300 rounded-6 h-8 px-3  flex items-center gap-1"
                >
                    <img src="/assets/images/4.png" alt="" width="18" height="18" />
                    Casino Hub
                </Button>
                <Button
                    variant="outline"
                    className="border-yellow-400 bg-transparent text-gray-300 rounded-6 h-8 px-3  flex items-center gap-1"
                >
                    <img src="/assets/images/4.png" alt="" width="18" height="18" />
                    oldDiamond
                </Button>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {games.map((game, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }}>
                        <Card className="overflow-hidden bg-gray-900 border border-black rounded-none p-0">
                            <CardContent className="p-0">
                                <img
                                    src={game.img}
                                    alt={game.name}
                                    className="w-full h-24 object-cover"
                                />
                                <div className="bg-[#3c444b] p-1 text-center  uppercase tracking-wide text-white">
                                    {game.code}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CasinoAdda;