import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  hexColor: string;
}

const initialState: ThemeState = {
  hexColor: "#431566",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.hexColor = action.payload;
    },
    resetThemeColor: (state) => {
      state.hexColor = "#431566";
    },
  },
});

export const { setThemeColor, resetThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
