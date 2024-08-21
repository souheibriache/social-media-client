import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  currentUser: null;
  loading: boolean;
  error: boolean;
};

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    fetchUserFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = null;
    },
    resetUser(state) {
      state.loading = false;
      state.error = false;
      state.currentUser = null;
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, resetUser } =
  userSlice.actions;

export default userSlice.reducer;
