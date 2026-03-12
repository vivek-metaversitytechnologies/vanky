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
