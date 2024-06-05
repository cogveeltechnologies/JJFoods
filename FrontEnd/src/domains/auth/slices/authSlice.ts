import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  isAuthenticated: false,
  isGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{
      token: string;
      isAuthenticated: boolean;
      isGuest: boolean;
    }>) => {
      const { token, isAuthenticated, isGuest } = action.payload;
      state.token = token;
      state.isAuthenticated = isAuthenticated;
      state.isGuest = isGuest;
    },
    logout: (state) => {
      state = initialState;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
