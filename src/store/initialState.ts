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
