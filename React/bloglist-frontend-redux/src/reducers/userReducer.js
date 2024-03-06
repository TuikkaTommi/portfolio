import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const initialState = {
  name: null,
  token: null,
  username: null,
  loggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state = { ...state, ...action.payload, loggedIn: true };
      console.log(state);
      return action.payload;
    },
    clearUser(state, action) {
      console.log(action);
      state = initialState;
      return state;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setUser(user));
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 100, true));
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
  };
};

export default userSlice.reducer;
