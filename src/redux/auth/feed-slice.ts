import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactionTypes } from "../../types/reaction.type.enum";

export type FeedType = {
  error: boolean;
  isLoading: boolean;
  posts: {
    _id: string;
    content: string;
    createdAt: Date;
    visibility: "only_me" | "friends" | "public";
    reactions: {
      _id: string;
      type: ReactionTypes;
      user: {
        userName: string;
        _id: string;
        profile: {
          picture: string;
        };
      };
    }[];
    comments: {
      _id: string;
      content: string;
      createdAt: Date;
      user: {
        userName: string;
        _id: string;
        profile: {
          picture: string;
        };
      };
    }[];
    images: string[];
    user: {
      _id: string;
      userName: string;
      profile: {
        picture: string;
      };
    };
  }[];
};

const initialState: FeedType = {
  error: false,
  isLoading: false,
  posts: [],
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    getFeedStart(state) {
      state.isLoading = true;
    },
    fetchFeedSuccess(state, action: PayloadAction<any>) {
      state.posts = action.payload;
      state.isLoading = false;
      state.error = false;
    },

    fetchFeedFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload;
      state.posts = [];
    },
    resetFeed(state) {
      state.isLoading = false;
      state.error = false;
      state.posts = [];
    },
    addPost(state, action: PayloadAction<any>) {
      state.posts.unshift(action.payload.newPost);
    },

    addPosts(state, action: PayloadAction<any>) {
      state.posts.push(action.payload.posts);
      state.isLoading = false;
    },
    addReaction(state, action: PayloadAction<any>) {
      for (const post of state.posts) {
        if (post._id === action.payload.postId) {
          post.reactions = post.reactions.filter(
            (reaction) => reaction?.user?._id !== action.payload?.userId
          );
          post.reactions.push(action.payload.reaction);
        }
      }
    },
    deleteReaction(state, action: PayloadAction<any>) {
      for (const post of state.posts) {
        if (post._id === action.payload.postId) {
          post.reactions = post.reactions.filter(
            (reaction) => reaction.user._id !== action.payload?.userId
          );
        }
      }
    },
    addComment(state, action: PayloadAction<any>) {
      for (const post of state.posts) {
        if (post._id === action.payload.postId) {
          post.comments.push(action.payload.comment);
        }
      }
    },
  },
});

export const {
  fetchFeedFailure,
  fetchFeedSuccess,
  getFeedStart,
  resetFeed,
  addPost,
  addReaction,
  addComment,
  deleteReaction,
} = feedSlice.actions;
export default feedSlice.reducer;
