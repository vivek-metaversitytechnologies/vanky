'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { login, demoLogin } from '../../store/actions/auth';
import type { RootState } from '../../store/store';
import '../../styles/login.css';

export default function LoginForm() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState({ userId: false, password: false });

  const { loading, error, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token = Cookies.get('accessToken');

    if (isAuthenticated || accessToken || token) {
      router.replace('/home');
    }
  }, [accessToken, isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userIdError = userId.trim() === '';
    const passwordError = password.trim() === '';

    setValidationError({
      userId: userIdError,
      password: passwordError,
    });

    if (userIdError || passwordError) {
      return;
    }

    const result = await login(userId, password);

    if (result.success) {
      router.replace('/home');
    }
  };

  const handleDemoLogin = async () => {
    const result = await demoLogin();

    if (result.success) {
      router.replace('/home');
    }
  };

  if (isAuthenticated || accessToken || Cookies.get('accessToken')) {
    return null;
  }

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-box">
        <div className="login-logo">
          <Image
            src="/assets/images/vanky-red.svg"
            alt="logo"
            width={90}
            height={32}
            className="logo-img"
          />
        </div>

        {error && (
          <div className="login-error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="login-field">
          <label className="login-label">
            <i className="fa-solid fa-user icon"></i>
            User ID
          </label>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className={`login-input ${validationError.userId ? 'error' : ''}`}
            disabled={loading}
          />

          {validationError.userId && (
            <span className="error-text">User ID is required.</span>
          )}
        </div>

        <div className="login-field">
          <label className="login-label">
            <i className="fa-solid fa-lock icon"></i>
            Password
          </label>

          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`login-input ${validationError.password ? 'error' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label="Toggle password visibility"
            >
              <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
            </button>
          </div>

          {validationError.password && (
            <span className="error-text">Password is required.</span>
          )}
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? (
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

        <button
          type="button"
          className="demo-login-btn"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fas fa-gamepad"></i>
              Demo Login
            </>
          )}
        </button>

        <div className="login-warning">
          Note - Only 10 Wrong Password attempts are valid.
        </div>

        <p className="footer-note">
          ⚠️ Note - This Website is not for Indian Territory.
        </p>
      </form>
    </div>
  );
}
