import store from "../store";
import { authActions } from "../reducers/auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { URB_API_BASE_URL, urbApiClient } from "../../config/axiosConfig";

const { dispatch } = store;

export const login = async (userId, password) => {
  dispatch(authActions.requestStart());

  try {
    const fullUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const urlWithoutProtocol = fullUrl.replace(/^https?:\/\//, '');

    const payload = {
      userId,
      password,
      // url: urlWithoutProtocol,
      // url: "antpro.co"
      url: "9xpro.co"
    };
    const url = `${URB_API_BASE_URL}/login/cleint-login`;

    const response = await urbApiClient.post(url, payload);

    const { data } = response;

    // Check if login was successful
    if (!data || !data.token) {
      throw new Error(data?.message || "Invalid credentials");
    }

    // Extract data from API response
    const accessToken = data.token;
    const user = {
      userId: data.userId,
      username: data.username,
      userTypeInfo: data.userTypeInfo,
      ps: data.ps,
    };

    // Store token in cookies (expires in ~50 minutes)
    Cookies.set("accessToken", accessToken, {
      expires: 50 / (24 * 60),
      path: '/',
      sameSite: 'lax',
    });

    // Set flag to show rules popup (will be cleared when user agrees/cancels)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem("showRulesPopup", "true");
    }

    dispatch(authActions.loadUser({ user, accessToken }));
    toast.success("Login successful!");

    return { success: true };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.msg ||
      err.message ||
      "Invalid User ID or Password";

    dispatch(authActions.requestFail(errorMessage));
    toast.error(errorMessage);

    return { success: false, error: errorMessage };
  }
};

export const loadUser = async (accessToken) => {
  dispatch(authActions.requestStart());

  try {
    // If you have a user info endpoint, use it here
    const response = await urbApiClient.get(`${URB_API_BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = response.data;

    dispatch(authActions.loadUser({ user, accessToken }));
  } catch (err) {
    dispatch(authActions.requestFail(err.message));
    dispatch(authActions.resetAuth());
    // Clear invalid token
    Cookies.remove("accessToken");
  }
};

export const logout = () => {
  dispatch(authActions.logOut());
  Cookies.remove("accessToken", { path: '/' });
  // Clear the rules popup flag on logout
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem("showRulesPopup");
  }
  toast.info("Logged out successfully");
};

export const demoLogin = async () => {
  dispatch(authActions.requestStart());

  try {
    // Use a separate axios instance so global auth interceptors are not applied.
    const response = await urbApiClient.post(`${URB_API_BASE_URL}/login/demo-login`);
    const { data } = response;

    if (!data || !data.token) {
      throw new Error(data?.message || "Demo login failed");
    }

    const accessToken = data.token;
    const user = {
      userId: data.userId,
      username: data.username,
      userTypeInfo: data.userTypeInfo,
      ps: data.ps,
    };

    Cookies.set("accessToken", accessToken, {
      expires: 50 / (24 * 60),
      path: '/',
      sameSite: 'lax',
    });
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem("showRulesPopup", "true");
    }

    dispatch(authActions.loadUser({ user, accessToken }));
    toast.success("Demo login successful!");

    return { success: true };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.msg ||
      err.message ||
      "Demo login failed";

    dispatch(authActions.requestFail(errorMessage));
    toast.error(errorMessage);

    return { success: false, error: errorMessage };
  }
};
