import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserinfo } from "@/types/globelTypes";

// Define initial state
interface IUserData {
  userData: IUserinfo | null;
}

const initialState: IUserData = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUserinfo | null>) => {
      state.userData = action.payload;
    },
    updateUserData: (state, action: PayloadAction<Partial<IUserinfo>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      } else {
        state.userData = action.payload as IUserinfo;
      }
    },
  },
});

export const { setUserData, updateUserData } = userSlice.actions;
export default userSlice.reducer;
