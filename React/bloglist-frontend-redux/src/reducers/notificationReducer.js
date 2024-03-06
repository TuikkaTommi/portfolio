import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: '',
  isError: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationToState(state, action) {
      console.log(action);
      state = {
        ...state,
        ...action.payload,
      };
      return state;
    },
    clearNotification(state, action) {
      console.log(action);
      state = initialState;
      return state;
    },
  },
});

export const { setNotificationToState, clearNotification } =
  notificationSlice.actions;

export const setNotification = (content, time, isError = false) => {
  return (dispatch) => {
    dispatch(
      setNotificationToState({ notification: content, isError: isError })
    );
    setTimeout(() => dispatch(clearNotification()), time * 1000);
  };
};

export default notificationSlice.reducer;
