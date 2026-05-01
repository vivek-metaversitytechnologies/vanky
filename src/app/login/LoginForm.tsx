'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { login, demoLogin } from '../../store/actions/auth';
import { authActions } from '../../store/reducers/auth';
import type { RootState } from '../../store/store';
import '../../styles/login.css';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState({ userId: false, password: false });

  const { error, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    setIsHydrated(true);
    setHasAccessToken(!!Cookies.get('accessToken'));
    dispatch(authActions.clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) return;

    const token = Cookies.get('accessToken');
    setHasAccessToken(!!token);

    if (!token && (isAuthenticated || accessToken)) {
      dispatch(authActions.resetAuth());
      return;
    }

    if (token) {
      router.replace('/home');
    }
  }, [accessToken, dispatch, isAuthenticated, isHydrated, router]);

  const handleLogin = async (e?) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    const userIdError = userId.trim() === '';
    const passwordError = password.trim() === '';

    setValidationError({
      userId: userIdError,
      password: passwordError,
    });

    if (userIdError || passwordError) {
      return;
    }

    setIsSubmitting(true);
    const result = await login(userId, password);
    setIsSubmitting(false);

    if (result.success) {
      router.replace('/home');
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    const result = await demoLogin();
    setIsSubmitting(false);

    if (result.success) {
      router.replace('/home');
    }
  };

  if (hasAccessToken) {
    return null;
  }

  return (
    <div className="login-wrapper">
      <div className="login-box" role="form" aria-label="Login form">
        <div className="login-logo">
          <Image
            src="/assets/images/vanky-red.svg"
            alt="logo"
            width={90}
            height={32}
            priority
            loading="eager"
            className="logo-img"
          />
        </div>

        {isHydrated && error && (
          <div className="login-error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="login-field">
          <label className="login-label">
            <Image
              src="/assets/home/user.svg"
              alt="user icon"
              width={18}
              height={18}
              className="icon"
            />
            User ID
          </label>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
            placeholder="Enter User ID"
            className={`login-input ${validationError.userId ? 'error' : ''}`}
            disabled={isSubmitting}
          />

          {validationError.userId && (
            <span className="error-text">User ID is required.</span>
          )}
        </div>

        <div className="login-field">
          <label className="login-label">
            <Image
              src="/assets/home/password.svg"
              alt="password icon"
              width={18}
              height={18}
              className="icon"
            />
            Password
          </label>

          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              placeholder="Enter Password"
              className={`login-input ${validationError.password ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              aria-label="Toggle password visibility"
            >
              <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
            </button>
          </div>

          {validationError.password && (
            <span className="error-text">Password is required.</span>
          )}
        </div>

        <button
          type="button"
          className="login-btn"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Logging in...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              Log In Now
            </>
          )}
        </button>

        <div className="login-warning">
          Note - Only 10 Wrong Password attempts are valid.
        </div>

        <p className="footer-note">
          <Image
            src="/assets/home/important-icon.abca35b106a3f344.svg"
            alt="alert icon"
            width={14}
            height={14}
            style={{ marginRight: '2px', display: 'inline', marginBottom: '1px' }}
          />
          Note - This Website is not for Indian Territory.
        </p>
      </div>
    </div>
  );
}
