export const authInitialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  loading: false,
  error: null,
};

export const messageInitialState = {
  text: "",
  loading: false,
  error: null,
  lastFetched: null as number | null,
};

export const matchesInitialState = {
  list: [],
  loading: false,
  error: null,
  lastFetched: null as number | null,
};

export const balanceInitialState = {
  balance: 0,
  liability: 0,
  loading: false,
  error: null,
  lastFetched: null as number | null,
};

export const accountStatementInitialState = {
  rows: [],
  loading: false,
  error: null,
  lastFetched: null as number | null,
};

export const gameInitialState = {
  odds: [] as any[],
  bookmaker: [] as any[],
  fancy: [] as any[],
  fancy2: [] as any[],
  loading: false,
  error: null as string | null,
  lastFetched: null as number | null,
};

export const matchBetsInitialState = {
  betList: [] as any[],
  completedBets: [] as any[],
  fancyBook: [] as any[],
  loadingBetList: false,
  loadingCompletedBets: false,
  loadingFancyBook: false,
  errorBetList: null as string | null,
  errorCompletedBets: null as string | null,
  errorFancyBook: null as string | null,
};

export const passwordChangeInitialState = {
  loading: false,
  success: false,
  error: null as string | null,
  message: null as string | null,
};

export const betInitialState = {
  placingBet: false,
  betSuccess: false,
  betError: null as string | null,
  lastBetResponse: null as any,
};

export const stakeSettingsInitialState = {
  values: [100, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000, 200000, 300000, 500000] as number[],
  loading: false,
  saving: false,
  error: null as string | null,
  message: null as string | null,
};

export const casinoLiveInitialState = {
  casinoList: [] as any[],
  loadingCasinoList: false,
  errorCasinoList: null as string | null,
  lastCasinoListFetched: null as number | null,

  meta: [] as any[],
  runners: [] as any[],
  extra: [] as any[],
  roundId: null as string | null,
  gameType: null as string | null,
  loadingMeta: false,
  errorMeta: null as string | null,
  lastMetaFetched: null as number | null,

  liability: [] as any[],
  loadingLiability: false,
  errorLiability: null as string | null,
  lastLiabilityFetched: null as number | null,

  userBets: [] as any[],
  loadingUserBets: false,
  errorUserBets: null as string | null,
  lastUserBetsFetched: null as number | null,

  lastResult: null as any,
  loadingResult: false,
  errorResult: null as string | null,
  lastResultFetched: null as number | null,

  lastResults: [] as any[],
  loadingLastResults: false,
  errorLastResults: null as string | null,
  lastResultsFetched: null as number | null,

  placingBet: false,
  placeBetError: null as string | null,
  placeBetSuccess: null as string | null,
};
