import { toast } from "sonner";
import fetchWithAuth from "./fetchWrapper";
import { UserInput } from "../types/loginInput";
import { store } from "../redux/store";
import { signInSuccess } from "../redux/auth/auth-slice";
import { jwtDecode } from "jwt-decode";
import { ReactionTypes } from "../types/reaction.type.enum";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const getCurrentUser = async () => {
  try {
    const data = await fetchWithAuth("/api/profile", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.ok) {
      const errorResponse = await data;
      if (errorResponse.message === "Profile not found") {
        console.log("Profile not found, redirecting to Complete Sign-Up");
        return { profileNotFound: true };
      }
    }

    const jsonData = await data;
    return jsonData;
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    throw err;
  }
};
export const signIn = async (formData: UserInput) => {
  try {
    const res = await fetch(baseUrl + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const dispatch = store.dispatch;
    const res = await fetch(baseUrl + "/api/refreshToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const jsonData = await res.json();
    const accessTokenPayload: { hasProfile: boolean } = jwtDecode(
      jsonData.payload.accessToken
    );
    dispatch(
      signInSuccess({
        refreshToken,
        accessToken: jsonData.payload.accessToken,
        hasProfile: accessTokenPayload.hasProfile,
      })
    );
    return jsonData;
  } catch (err) {
    console.log(err);
  }
};

export const searchUsers = async (searchQuery: string) => {
  const query = `/api/profile/search?page=1&search=${searchQuery}`;
  try {
    const res = await fetchWithAuth(query, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Search users failed: " + error);
    toast.error("Error fetching users");
  }
};

export const addFriend = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/invitations/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Add friend failed: " + error);
    toast.error("Error adding friend");
  }
};

export const cancelRequest = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/invitations/${userId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Error canceling invitation: " + error);
    toast.error("Error canceling invitation");
  }
};

export const acceptFriendRequest = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/invitations/${userId}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Error accepting invitation: " + error);
    toast.error("Error accepting invitation");
  }
};

export const rejectFriendRequest = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/invitations/${userId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Error rejecting invitation: " + error);
    toast.error("Error rejecting invitation");
  }
};

export const unfriendUser = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/invitations/${userId}/unfriend`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Error unfriending user: " + error);
    toast.error("Error unfriending user");
  }
};

export const getUserById = async (userId: string) => {
  try {
    const res = await fetchWithAuth(`/api/profile/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Get user by id failed: " + error);
    toast.error("Error fetching user");
  }
};

export const getChatByRecipientId = async (recipientId: string) => {
  try {
    const res = await fetchWithAuth(`/api/chat//${recipientId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Get user by id failed: " + error);
    toast.error("Error fetching user chat");
  }
};
export const completeSignup = async (formData: FormData) => {
  try {
    const data = await fetchWithAuth("/api/profile", {
      method: "POST",
      body: formData,
    });

    return data;
  } catch (error) {
    console.error("Error in completeSignup:", error);
    throw error;
  }
};

export const createPost = async (formData: FormData) => {
  try {
    const data = await fetchWithAuth("/api/posts", {
      method: "POST",
      body: formData,
    });

    return data;
  } catch (error) {
    console.error("Error in completeSignup:", error);
    throw error;
  }
};

export const getFeed = async (page: number) => {
  const query = `/api/feed?page=${page}`;
  try {
    const res = await fetchWithAuth(query, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error) {
    console.log("Fetching feed posts failed: " + error);
    toast.error("Error fetching feed posts");
  }
};

export const react = async (postId: string, type: ReactionTypes) => {
  const query = `/api/posts/${postId}/reactions`;
  try {
    const res = await fetchWithAuth(query, {
      method: "POST",
      body: JSON.stringify({ type }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Reaction failed: " + error);
    toast.error(error.message);
  }
};

export const postComment = async (postId: string, content: string) => {
  const query = `/api/posts/${postId}/comments`;
  try {
    const res = await fetchWithAuth(query, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Posting comment failed: " + error);
    toast.error(error.message);
  }
};

export const removeReaction = async (postId: string) => {
  const query = `/api/posts/${postId}/reactions`;
  try {
    const res = await fetchWithAuth(query, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Fetching feed posts failed: " + error);
    toast.error(error.message);
  }
};

export const fetchPostReactions = async (postId: string) => {
  const query = `/api/posts/${postId}/reactions`;
  try {
    const res = await fetchWithAuth(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Getting post reactions failed " + error);
    toast.error(error.message);
  }
};
export const fetchPostComments = async (postId: string) => {
  const query = `/api/posts/${postId}/comments`;
  try {
    const res = await fetchWithAuth(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Fetching comment failed: " + error);
    toast.error(error.message);
  }
};

export const fetchInvitations = async () => {
  const query = `/api/invitations/received`;
  try {
    const res = await fetchWithAuth(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Fetching invitations failed: " + error);
    toast.error(error.message);
  }
};

export const fetchFriends = async () => {
  const query = `/api/invitations/friends`;
  try {
    const res = await fetchWithAuth(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res;
  } catch (error: any) {
    console.log("Fetching invitations failed: " + error);
    toast.error(error.message);
  }
};
