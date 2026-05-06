export type CasinoRouteCode =
  | "teenPatti"
  | "ODLucky7"
  | "ODab20"
  | "ODdt20"
  | "ODaaa"
  | "OD1Day"
  | "ODDT202"
  | "OD32card"
  | "ODDTL20"
  | "ODLucky7b";

export type CasinoPopupType = "teen" | "dt" | "lucky7" | "aaa" | "ab";

export interface GameResultEntry {
  label: string;
  bg: string; // background color for circular badge
}

export interface CasinoGameConfig {
  code: CasinoRouteCode;
  displayName: string;
  casinoListName?: string;
  metaPath?: string;
  resultPath?: string;
  isUiReady: boolean;
  casinoName?: number;
  /** Maps result number string → badge label + bg color */
  resultMap?: Record<string, GameResultEntry>;
  /** Determines which popup template to render */
  popupType?: CasinoPopupType;
}

export const CASINO_GAMES: CasinoGameConfig[] = [
  {
    code: "teenPatti",
    displayName: "20-20 TeenPatti",
    casinoListName: "TeenPatti",
    metaPath: "/betfair_api/casino/data/meta-teen20",
    resultPath: "/betfair_api/casino/result/meta-teen20",
    isUiReady: true,
    casinoName: 1,
    popupType: "teen",
    resultMap: {
      "1": { label: "A", bg: "#169731" },
      "2": { label: "A", bg: "#169731" },
      "3": { label: "B", bg: "#d0021b" },
      "4": { label: "B", bg: "#d0021b" },
    },
  },
  {
    code: "OD1Day",
    displayName: "TeenPatti Day",
    casinoListName: "TeenPatti OneDay",
    metaPath: "/betfair_api/casino/data/meta-Teen",
    resultPath: "/betfair_api/casino/result/meta-Teen",
    isUiReady: true,
    casinoName: 6,
    popupType: "teen",
    resultMap: {
      "1": { label: "A", bg: "#d0021b" },
      "2": { label: "B", bg: "#fdcf13" },
    },
  },
  {
    code: "OD32card",
    displayName: "32 Cards A",
    isUiReady: false,
  },
  {
    code: "ODLucky7",
    displayName: "Lucky 7",
    casinoListName: "Lcuky7A",
    metaPath: "/betfair_api/casino/data/meta-lucky7",
    resultPath: "/betfair_api/casino/result/meta-lucky7",
    isUiReady: true,
    casinoName: 2,
    popupType: "lucky7",
    resultMap: {
      "0": { label: "T", bg: "#434343" },
      "1": { label: "L", bg: "#d0021b" },
      "2": { label: "H", bg: "#169731" },
    },
  },
  {
    code: "ODdt20",
    displayName: "20-20 Dragon Tiger",
    casinoListName: "Dragon Tiger",
    metaPath: "/betfair_api/casino/data/meta-dt20",
    resultPath: "/betfair_api/casino/result/meta-dt20",
    isUiReady: true,
    casinoName: 3,
    popupType: "dt",
    resultMap: {
      "1": { label: "D", bg: "#169731" },
      "2": { label: "T", bg: "#d0021b" },
      "3": { label: "Ti", bg: "#fdcf13" },
    },
  },
  {
    code: "ODaaa",
    displayName: "Anthony",
    casinoListName: "Amar Albar Anthony",
    metaPath: "/betfair_api/casino/data/meta-aaa",
    resultPath: "/betfair_api/casino/result/meta-aaa",
    isUiReady: true,
    casinoName: 5,
    popupType: "aaa",
    resultMap: {
      "1": { label: "A", bg: "#169731" },
      "2": { label: "B", bg: "#d0021b" },
      "3": { label: "C", bg: "#fdcf13" },
    },
  },
  {
    code: "ODab20",
    displayName: "Andar Bahar 2",
    casinoListName: "Andar Bahar",
    metaPath: "/betfair_api/casino/data/meta-ab20",
    resultPath: "/betfair_api/casino/result/meta-ab20",
    isUiReady: true,
    casinoName: 4,
    popupType: "ab",
    resultMap: {
      "1": { label: "A", bg: "#169731" },
      "2": { label: "B", bg: "#d0021b" },
      "0": { label: "R", bg: "#fdcf13" },
    },
  },
  {
    code: "ODDT202",
    displayName: "Dragon Tiger 2",
    casinoListName: "Dragon Tiger 2",
    metaPath: "/betfair_api/casino/data/meta-dt202",
    resultPath: "/betfair_api/casino/result/meta-dt202",
    isUiReady: true,
    casinoName: 7,
    popupType: "dt",
    resultMap: {
      "1": { label: "D", bg: "#169731" },
      "2": { label: "T", bg: "#d0021b" },
      "3": { label: "Ti", bg: "#fdcf13" },
    },
  },
  {
    code: "ODDTL20",
    displayName: "Casino 20-20 DTL",
    isUiReady: false,
  },
  {
    code: "ODLucky7b",
    displayName: "Lucky 7 B",
    isUiReady: false,
  },
];

export const CASINO_GAME_BY_CODE = CASINO_GAMES.reduce((acc, item) => {
  acc[item.code] = item;
  return acc;
}, {} as Record<string, CasinoGameConfig>);
