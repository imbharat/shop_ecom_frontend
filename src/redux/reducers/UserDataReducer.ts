import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "@/types/Types";

const initialState: UserData = {
  user_name: "",
  first_name: "",
  last_name: "",
  display_name: "",
  email: "",
  phone: "",
  is_admin: false,
  permissions: [],
  locations: [],
};

export const userDataSlice = createSlice({
  name: "user_data",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state = action.payload;
    },
  },
});

export const { updateUser } = userDataSlice.actions;

export default userDataSlice.reducer;
