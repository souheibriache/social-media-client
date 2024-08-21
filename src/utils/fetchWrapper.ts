import { refreshAccessToken } from "./api";
import { resetAuth, signInSuccess } from "../redux/auth/auth-slice";
import { store } from "../redux/store";
import { resetUser } from "../redux/auth/user-slice";
import { jwtDecode } from "jwt-decode";
import { resetChat } from "../redux/auth/chat-slice";

const fetchWithAuth = async (url: string, options: any = {}) => {
  let { accessToken, refreshToken } = store.getState().auth;
  const dispatch = store.dispatch;

  const headers: any = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  // Only add Content-Type if the body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(url, fetchOptions);

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
        return await fetch(url, fetchOptions);
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
