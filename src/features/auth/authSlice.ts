import {AuthState} from "../../types";  
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,       
  isLoading: true,  
  error: null,      
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login
   setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    //logout
    userLogout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },

  
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

   
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {setUser, userLogout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;