// authReducer.js

import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './authActions';

const initialState = {
  isAuthenticated: !!localStorage.getItem('auth_token'),
  token: localStorage.getItem('auth_token') || null,
  user_id: localStorage.getItem('user_id') || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('auth_token', action.payload.access_token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.access_token,
        user_id: action.payload.user_id,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('auth_token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user_id: null
      };
    default:
      return state;
  }
};

export default authReducer;
