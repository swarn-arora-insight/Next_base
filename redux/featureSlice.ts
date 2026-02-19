import { ApiFeatureGroup } from "@/app/(routes)/user-management/component/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeatureState {
  features: ApiFeatureGroup[];
}

const initialState: FeatureState = {
  features: [],
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<ApiFeatureGroup[]>) => {
      state.features = action.payload;
    },
  },
});

export const { setFeatures } = featureSlice.actions;
export default featureSlice.reducer;
