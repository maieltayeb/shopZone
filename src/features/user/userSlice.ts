import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [{
     name: '',username: '', email: '', password: ''  ,
    }],
    currentUser: null,
    isLoggedIn: false
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.currentUser = null
      state.isLoggedIn = false
    },
    register: (state, action) => {
      state.users.push(action.payload)
      state.isLoggedIn = false
    }
  }
})

export const { login, logout, register } = userSlice.actions
export default userSlice.reducer