"use client";

import { useState } from "react";
import "../../styles/mobileRules.css";

const HINDI_RULES = [
  "लॉग इन करने के बाद अपना पासवर्ड बदलें।",
  "प्रत्येक गेम के लिए 0.0/- कॉइन्स चार्ज रहेगा |",
  "लॉटरी ड्रॉ में 9.5 का भाव है |",
  "लाइव ड्रा टीवी स्कोर पर निर्भर है | दर कभी नहीं बदली जाती है |",
  "मैच के दौरान भाव को देख और समझ कर ही सौदा करें | किये गए किसी भी सौदे को हटाया या बदला नहीं जायेगा | सभी सौदे के लिए आप स्वयं जिम्मेवार हैं |",
  "यहाँ सभी सौदे लेजर से मान्य किये जायेंगे |",
  "चीटिंग या गलत भाव के सौदे हटा दिए जायेंगे मैच खत्म होने बाद भी।",
  "मैच या सेशन भाव गलत चलने पर जो भी मैच या सेशन के सौदे हुए हे वह स्वतः हट जायेंगे। ऐसी स्थिति में किसी भी तरह का वाद-विवाद मान्य नहीं होगा।",
  "कंपनी का डिसीज़न ही फाइनल होगा, उस पर कोई क्लेम मान्य नहीं होगा।",
  "अगर आप इस एग्रीमेंट को ऐक्सेप्ट नहीं करते हे तो कोई सौदा नहीं कीजिये।",
  "इंटरनेट कनेक्शन प्रॉब्लम की जिम्मेवारी आपकी रहेगी |",
  "टेस्ट मैच में प्रतिदिन 0.0/ कॉइन चार्ज रहेगा |",
  "एक्स्ट्रा फैंसी पर कमिशन नहीं मिलेगा , जिन फैंसी में No Comm लिखा है उनमे कमिशन नहीं मिलेगा|",
  "यदि आप मैच या सेशन का एक भी सौदा नहीं करते हो, ऐसे में आपसे 0.0/- कॉइन्स का चार्ज लिया जायेगा |",
  "सभी एडवांस सौदे टॉस के बाद लिए जाएंगे |",
  "खेल रद्द या टाई होने पर सभी सौदे रद्द कर दिए जाएंगे और लेनदेन सेशन और फैंसी जो पूरा हो गया है उस पर किया जाएगा | मैच के दौरान सेशन की कंडीशन पर फैंसी का सेटलमेंट कंपनी तय करेगी कंपनी का डिसीजन ही फाइनल होगा|",
  "टेस्ट मैच में पार्टनरशिप और प्लेयर रन खराब मौसम और मैच रद्द ( ड्रॉ) होता है तो रिजल्ट उस टाइम जो स्कोर होगा उस हिसाब से डिक्लियर होगा |",
  "एकी बेकी में 95 का भाव है |",
];

const ENGLISH_RULES = [
  "Change your password after you log in.",
  "0.0 /- coins will be charged for each game.",
  "0.0 /- coin charge will be there per day in test match.",
  "No commission will be given on extra fancy, commission will not be available in fancy in which No Comm is written.",
  "If you do not make a single deal of match or session, then you will be charged 0.0/- coins.",
  "All advance deals will be taken after the toss.",
  "In case the game is canceled or tied, all transactions will be canceled and the transaction will be done on the session and fancy that has been completed.",
  "Partnership and player run in test match bad weather and match is canceled (draw) then result will be declared according to the score at that time.",
  "Deal only after seeing and understanding the price during the match. Any transaction entered into will not be deleted or replaced.",
  "All deals here will be validated by ledger.",
  "Deals of cheating or wrong price will be removed even after the match is over.",
  "If the match or session price is incorrect, then whatever match or session has been traded will be automatically removed.",
  "The decision of the company will be final, no claim will be accepted on it.",
  "If you do not accept this agreement then do not do any deal.",
  "You will be responsible for internet connection problem.",
];

export default function MobileRulesModal({ onClose }) {
  const [lang, setLang] = useState("hindi");

  return (
    <div className="mobile-rules-overlay" role="dialog" aria-modal="true" aria-hidden="false">
      <div className="mobile-rules-dialog">
        <div className="mobile-rules-content">
          <div className="mobile-rules-header">
            <h4 className="mobile-rules-title">vanky12.com Rules</h4>
          </div>

          <div className="mobile-rules-body">
            <ul className="mobile-rules-tabs">
              <li>
                <button
                  type="button"
                  className={`mobile-rules-tab-btn ${lang === "hindi" ? "active" : ""}`}
                  onClick={() => setLang("hindi")}
                >
                  Hindi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`mobile-rules-tab-btn ${lang === "english" ? "active" : ""}`}
                  onClick={() => setLang("english")}
                >
                  English
                </button>
              </li>
            </ul>

            {lang === "hindi" ? (
              <>
                <h4 className="mobile-rules-subtitle">
                  कृपया admin.vanky12.com के नियमों को समझने के लिए यहां कुछ मिनट दें, और अपने अनुसार समझ लें |
                </h4>
                <ol className="mobile-rules-list hindi">
                  {HINDI_RULES.map((rule, index) => (
                    <li key={`hi-${index}`}>{rule}</li>
                  ))}
                </ol>
                <ul className="mobile-rules-note hindi">
                  <li>
                    नोट: सर्वर या वेबसाइट में किसी तरह की खराबी आने या बंद हो जाने पर केवल किए गए सौदे ही मान्य होंगे | ऐसी स्तिथि में किसी तरह का वाद-विवाद मान्य नहीं होगा |
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h4 className="mobile-rules-subtitle">
                  Please take a few minutes here to understand the rules of VANKY12, and understand accordingly.
                </h4>
                <ol className="mobile-rules-list english">
                  {ENGLISH_RULES.map((rule, index) => (
                    <li key={`en-${index}`}>{rule}</li>
                  ))}
                </ol>
                <ul className="mobile-rules-note english">
                  <li>
                    Note: Transactions made will be valid only in case of server or website failure or shutdown. In such a case, any kind of debate will not be valid.
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="mobile-rules-footer">
            <button type="button" className="mobile-rules-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
