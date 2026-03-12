'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { type RootState } from '../store/store';
import { authActions } from '../store/reducers/auth';

function AuthStateSync() {
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const syncAuthState = () => {
      const cookieToken = Cookies.get('accessToken');

      if (!cookieToken && (isAuthenticated || accessToken)) {
        dispatch(authActions.resetAuth());
      }
    };

    syncAuthState();

    window.addEventListener('focus', syncAuthState);
    const intervalId = window.setInterval(syncAuthState, 3000);

    return () => {
      window.removeEventListener('focus', syncAuthState);
      window.clearInterval(intervalId);
    };
  }, [accessToken, dispatch, isAuthenticated]);

  return null;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStateSync />
      {children}
    </Provider>
  );
}
