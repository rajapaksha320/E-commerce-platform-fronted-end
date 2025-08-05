
// utils/tokenManager.js

import { setCookie, removeCookie } from './cookieManager';

export const setAuthToken = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }
  
  if (refreshToken) {
    // Set refresh token in cookie
    setCookie('refreshToken', refreshToken, 7); // 7 days expiry
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  removeCookie('refreshToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};


