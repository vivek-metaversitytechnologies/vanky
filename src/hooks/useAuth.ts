import { useSelector } from 'react-redux';
import { logout } from '../store/actions/auth';
import type { RootState } from '../store/store';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    logout,
  };
};

export default useAuth;
