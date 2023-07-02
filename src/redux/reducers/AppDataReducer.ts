import { AnyAction, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { AppData } from "@/types/Types";
import { getTopLocations } from "@/services/locations.service";

const initialState: AppData = {
  locations: [],
  vendors: [],
  qcs: [],
  types: [],
  categories: [],
};

export const appDataSlice = createSlice({
  name: "app_data",
  initialState,
  reducers: {
    updateLocations: (state, action) => {
      state.locations = action.payload;
    },
    updateVendors: (state, action) => {
      state.vendors = action.payload;
    },
    updateTypes: (state, action) => {
      state.types = action.payload;
    },
    updateQCs: (state, action) => {
      state.qcs = action.payload;
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    // fetchLocations: () => {
    //   return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) =>  {
    //     const locations = await getTopLocations();
    //     dispatch(updateLocations(locations));
    //   };
    // },
  },
});

export const {
  updateLocations,
  updateVendors,
  updateTypes,
  updateQCs,
  updateCategories,
  //   fetchLocations,
} = appDataSlice.actions;
export default appDataSlice.reducer;
