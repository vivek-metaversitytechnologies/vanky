"use client";
import { useState } from "react";

const RULES_HINDI = [
    "लॉग इन करने के बाद अपना पासवर्ड बदलें।",
    "स्टेक्स चैट के लिए 0.0/- कंगारू चार्ज रहेगा।",
    "लोडिंग फंड 9.5 का रहेगा।",
    "लाइव और सेट स्कोर फॉल्स हो सकते हैं। दर कभी नहीं बदली जाती हैं। यह यूजर के लिए अच्छा मौका देता है।",
    "मैच के दौरान मौके को देख और समझ कर ही सोचें करें। किये गए किसी भी मौके को हटाया या बदला नहीं जायेगा। सभी मौके के लिए आप स्वयं जिम्मेदार हैं।",
    "यहां सभी मौके देर से जाते हैं।",
    "वीडियो या गलत मौके सब मौके हटा दिए जायेंगे मैच खत्म होने बाद भी।",
    "मैच या शेष मौके गलत चलते जाय तो भी मैच शेष के मौके बंध हुए हटा जायेगी। ऐसी स्थिति में किसी भी प्रकार का क्लेम-विदाद मान्य नहीं होगा।",
    "अगर अनॉथराइज्ड यूजर से पासवर्ड, पार्टनरशिप और खिलाडियों और खिलाडियों रिसिंग में से या खिलाडी रिजल्ट हुआ तो साइट वायर और",
    "कंपनी का डिसीज़न ही फाइनल होगा, उस पर कोई क्लेम मान्य नहीं होगा।",
    "अगर आप इस एग्रीमेंट को ऐक्सेप्ट नहीं करते हे तो कोई सौदा नहीं कीजिये।",
    "इंटरनेट कनेक्शन प्रॉब्लम की जिम्मेवारी आपकी रहेगी |",
    "टेस्ट मैच में प्रतिदिन 0.0/ कॉइन चार्ज रहेगा |",
    "एक्स्ट्रा फैंसी पर कमिशन नहीं मिलेगा , जिन फैंसी में No Comm लिखा है उनमे कमिशन नहीं मिलेगा|",
    "यदि आप मैच या सेशन का एक भी सौदा नहीं करते हो, ऐसे में आपसे 0.0/- कॉइन्स का चार्ज लिया जायेगा |",
    "सभी एडवांस सौदे टॉस के बाद लिए जाएंगे |",
    "खेल रद्द या टाई होने पर सभी सौदे रद्द कर दिए जाएंगे और लेनदेन सेशन और फैंसी जो पूरा हो गया है उस पर किया जाएगा | मैच के दौरान सेशन की कंडीशन पर फैंसी का सेटलमेंट कंपनी तय करेगी कंपनी का डिसीजन ही फाइनल होगा|",
    "टेस्ट मैच में पार्टनरशिप और प्लेयर रन खराब मौसम और मैच रद्द ( ड्रॉ) होता है तो रिजल्ट उस टाइम जो स्कोर होगा उस हिसाब से डिक्लियर होगा |",
    "मैच के लिए सौदे की रकम: मार्केट का प्रकारकम से कम शर्त राशिअधिकतम शर्त राशिमैच कौन जीतेगा500|500000 क्रिकेट सेशन500|55000क्रिकेट एकी बेकी100|100000अंक समाप्त मैच का दांव100|100000",
    "एकी बेकी में 95 का भाव है |",
    "नोट: सर्वर या वेबसाइट में किसी तरह की खराबी आने या बंद हो जाने पर केवल किए गए सौदे ही मान्य होंगे | ऐसी स्तिथि में किसी तरह का वाद-विवाद मान्य नहीं होगा |"
];

const RULES_ENGLISH = [
    "Change your password after you log in.",
    "0.0 /- coins will be charged for each game.",
    "0.0 /- coin charge will be there per day in test match.",
    "No commission will be given on extra fancy, commission will not be available in fancy in which No Comm is written.",
    "If you do not make a single deal of match or session, then you will be charged 0.0/- coins.",
    "All advance deals will be taken after the toss.",
    "In case the game is canceled or tied, all transactions will be canceled and the transaction will be done on the session and fancy that has been completed. During the match, the company will decide the settlement of fancy on the condition of the session, the decision of the company will be final.",
    "Partnership and player run in test match bad weather and match is canceled (draw) then result will be declared according to the score at that time.",
    "Deal amount for the match: Market TypeMinimum Bet AmountMaximum Bet AmountWho Wins the Match500|500000Cricket Sessions500|55000Cricket Aki Becky100|100000 Points Ended Match Bet100|100000",
    "Aki Becky has a price of 95.",
    "The lottery draw has a value of 9.5.",
    "Live draw is dependent on TV score. The rate never changes. This is a good opportunity for the user.",
    "Deal only after seeing and understanding the price during the match. Any transaction entered into will not be deleted or replaced. You are responsible for all transactions.",
    "All deals here will be validated by ledger.",
    "Deals of cheating or wrong price will be removed even after the match is over.",
    "If the match or session price is incorrect, then whatever match or session has been traded will be automatically removed. In such a case, any dispute will not be valid.",
    "All transactions for sessions, partnerships and players who are in running or retired players will be canceled when the match is terminated. And the coins will be more or less according to the session which is complete. And when the result comes, the players who are where they are will be considered.",
    "The decision of the company will be final, no claim will be accepted on it.",
    "If you do not accept this agreement then do not do any deal.",
    "You will be responsible for internet connection problem."
];

export default function RulesModal({ onClose }) {
    const [lang, setLang] = useState("hindi");

    return (
        <div className="fixed inset-0 flex justify-center bg-opacity-50 z-50 h-[55%]">
            <div
                className="w-[480px] max-w-full w-[600px]  rounded shadow-lg border border-green-900"
                style={{background: "#fff"}}
            >
                {/* Header */}
                <div className="flex flex-col items-center py-3 px-4 bg-[#255f00] rounded-t">
                    <h2 className="text-lg font-bold text-yellow-300 mt-3 tracking-wide">
                        VANKY12.COM RULES
                    </h2>
                </div>
                <div className="flex gap-2 w-full justify-start p-2 border-b-2 border-black">
                    <button
                        className={`px-4 py-1 rounded text-base font-semibold border ${"bg-[#255f00] text-white border-white"}`}
                        onClick={() => setLang("hindi")}
                    >
                        Hindi
                    </button>
                    <button
                        className={`px-4 py-1 rounded text-base font-semibold border ${ "bg-[#255f00] text-white border-white"}`}
                        onClick={() => setLang("english")}
                    >
                        English
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 pt-4 overflow-y-auto max-h-[410px]">
                    {lang === "hindi" ? (
                        <>
                            <p className="font-semibold mb-4 text-black">
                                कृपया admin.vanky12.com के नियमों को समझने के लिए यहाँ कुछ मिनट दें, और अपने अनुसार समझ
                                लें |
                            </p>
                            <ol className="list-decimal pl-6 space-y-1 text-black text-base">
                                {RULES_HINDI.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ol>
                            <ul className="list-disc ml-5 font-bold text-sm text-gray-700">
                                <li>
                                    नोट: सर्वर या वेबसाइट में किसी तरह की खराबी आने या बंद हो जाने पर केवल किए गए सौदे ही मान्य होंगे | ऐसी स्तिथि में किसी तरह का वाद-विवाद मान्य नहीं होगा |
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold mb-4 text-black">
                                Please take a few minutes here to understand the rules of VANKY12, and understand
                                accordingly.
                            </p>
                            <ol className="list-decimal pl-6 space-y-1 text-black text-base">
                            {RULES_ENGLISH.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ol>
                            <ul className="list-disc ml-5 font-bold text-sm text-gray-700">
                                <li>
                                    Note: Transactions made will be valid only in case of server or website failure or
                                    shutdown. In such a case, any kind of debate will not be valid.
                                </li>
                            </ul>
                        </>
                    )}
                </div>
                {/* Footer */}
                <div className="flex justify-center py-3 bg-[#255f00] rounded-b">
                    <button
                        className="px-10 py-1 rounded bg-[#255f00] text-yellow-300 font-bold text-lg shadow border border-[#255f00] hover:bg-[#255f00] transition"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}
