// src/hooks/useSellerStore.js

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  createSellerStore,
  getSellerStoreProfile,
  updateSellerStore,
  uploadStoreLogo,
  uploadStoreBanner,
  clearSellerStoreError,
  clearSellerStoreSuccess,
  updateStoreDataLocally,
  setStoreStatus,
  selectStoreProfile,
  selectStoreStats,
  selectStoreLoading,
  selectStoreError,
  selectStoreSuccess,
  selectStoreMessage,
  selectHasStore,
  selectStoreStatus,
  selectStoreName,
  selectStoreId,
  selectStoreDashboardData,
} from '../store/slices/sellerStoreSlice';

export const useSellerStore = () => {
  const dispatch = useDispatch();

  // Selectors
  const storeProfile = useSelector(selectStoreProfile);
  const storeStats = useSelector(selectStoreStats);
  const loading = useSelector(selectStoreLoading);
  const error = useSelector(selectStoreError);
  const success = useSelector(selectStoreSuccess);
  const message = useSelector(selectStoreMessage);
  const hasStore = useSelector(selectHasStore);
  const storeStatus = useSelector(selectStoreStatus);
  const storeName = useSelector(selectStoreName);
  const storeId = useSelector(selectStoreId);
  const dashboardData = useSelector(selectStoreDashboardData);

  // Actions
  const createStore = useCallback(
    (storeData) => dispatch(createSellerStore(storeData)),
    [dispatch]
  );

  const fetchStoreProfile = useCallback(
    (role = 'seller') => dispatch(getSellerStoreProfile({ role })),
    [dispatch]
  );

  const updateStore = useCallback(
    (storeId, updateData) => dispatch(updateSellerStore({ storeId, updateData })),
    [dispatch]
  );

  const uploadLogo = useCallback(
    (imageFile) => dispatch(uploadStoreLogo(imageFile)),
    [dispatch]
  );

  const uploadBanner = useCallback(
    (imageFile) => dispatch(uploadStoreBanner(imageFile)),
    [dispatch]
  );

  const updateStoreLocally = useCallback(
    (data) => dispatch(updateStoreDataLocally(data)),
    [dispatch]
  );

  const changeStoreStatus = useCallback(
    (status) => dispatch(setStoreStatus(status)),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearSellerStoreError()),
    [dispatch]
  );

  const clearSuccess = useCallback(
    () => dispatch(clearSellerStoreSuccess()),
    [dispatch]
  );

  return {
    // State
    storeProfile,
    storeStats,
    loading,
    error,
    success,
    message,
    hasStore,
    storeStatus,
    storeName,
    storeId,
    dashboardData,

    // Actions
    createStore,
    fetchStoreProfile,
    updateStore,
    uploadLogo,
    uploadBanner,
    updateStoreLocally,
    changeStoreStatus,
    clearError,
    clearSuccess,
  };
};