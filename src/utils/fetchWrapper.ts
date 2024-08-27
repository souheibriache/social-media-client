import { refreshAccessToken } from "./api";
import { resetAuth, signInSuccess } from "../redux/auth/auth-slice";
import { store } from "../redux/store";
import { resetUser } from "../redux/auth/user-slice";
import { jwtDecode } from "jwt-decode";
import { resetChat } from "../redux/auth/chat-slice";

const fetchWithAuth = async (url: string, options: any = {}) => {
  let { accessToken, refreshToken } = store.getState().auth;
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = store.dispatch;

  const headers: any = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // Do not set Content-Type if it's FormData, the browser will handle it
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(baseUrl + url, fetchOptions);

  if (response.status === 401) {
    return await refreshAccessToken(refreshToken || "")
      .then(async (refreshResponse) => {
        const accessTokenPayload: { hasProfile: boolean } = jwtDecode(
          refreshResponse.accessToken
        );
        dispatch(
          signInSuccess({
            refreshToken: refreshResponse.refreshToken || refreshToken,
            accessToken: refreshResponse.accessToken,
            hasProfile: accessTokenPayload.hasProfile,
          })
        );

        fetchOptions.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
        return await fetch(baseUrl + url, fetchOptions);
      })
      .catch(() => {
        dispatch(resetAuth());
        dispatch(resetUser());
        dispatch(resetChat());
        window.location.href = "/sign-in";
        return;
      });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Request failed: ${response.status}`, errorData);
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  const responseData = await response.json().catch(() => ({}));
  return responseData;
};

export default fetchWithAuth;
