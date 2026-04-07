import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  firstname: string;
  lastname: string;
}

interface AuthState {
  user: User | null;
  apiToken: string | null;
}

const initialState: AuthState = {
  user: null,
  apiToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    setApiToken(state, action: PayloadAction<string>) {
      state.apiToken = action.payload;
    },

    logout(state) {
      state.user = null;
      state.apiToken = null;
    },
  },
});

export const { setUser, setApiToken, logout } = authSlice.actions;
export default authSlice.reducer;
