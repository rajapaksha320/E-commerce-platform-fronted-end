// src/hooks/useSellerListing.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  createSellerListing,
  getSellerListings,
  getSellerListingById,
  getSellerListingsByStatus,
  filterSellerListings,
  deleteSellerListing,
  updateSellerListing,
  uploadSellerImage,
  clearSellerListingError,
  clearSellerListingSuccess,
  setSellerListingFilters,
  clearSellerListingFilters,
  saveDraftListing,
  clearDraftListing,
  updateListingStatus,
  selectSellerListings,
  selectCurrentListing,
  selectListingPagination,
  selectListingFilters,
  selectListingStatusCounts,
  selectListingLoading,
  selectListingError,
  selectListingSuccess,
  selectListingMessage,
  selectUploadedImages,
  selectDraftListing,
} from '../store/slices/sellerListingSlice';

export const useSellerListing = () => {
  const dispatch = useDispatch();

  // Selectors
  const listings = useSelector(selectSellerListings);
  const currentListing = useSelector(selectCurrentListing);
  const pagination = useSelector(selectListingPagination);
  const filters = useSelector(selectListingFilters);
  const statusCounts = useSelector(selectListingStatusCounts);
  const loading = useSelector(selectListingLoading);
  const error = useSelector(selectListingError);
  const success = useSelector(selectListingSuccess);
  const message = useSelector(selectListingMessage);
  const uploadedImages = useSelector(selectUploadedImages);
  const draftListing = useSelector(selectDraftListing);

  // Actions
  const createListing = useCallback(
    (listingData) => dispatch(createSellerListing(listingData)),
    [dispatch]
  );

  const fetchListings = useCallback(
    (page, pageSize) => dispatch(getSellerListings({ page, pageSize })),
    [dispatch]
  );

  const fetchListingById = useCallback(
    (listingId) => dispatch(getSellerListingById(listingId)),
    [dispatch]
  );

  const fetchListingsByStatus = useCallback(
    (status, page, pageSize) => 
      dispatch(getSellerListingsByStatus({ status, page, pageSize })),
    [dispatch]
  );

  const filterListings = useCallback(
    (filterParams) => dispatch(filterSellerListings(filterParams)),
    [dispatch]
  );

  const deleteListing = useCallback(
    (listingId) => dispatch(deleteSellerListing(listingId)),
    [dispatch]
  );

  const updateListing = useCallback(
    (listingId, updateData) => 
      dispatch(updateSellerListing({ listingId, updateData })),
    [dispatch]
  );

  const uploadImage = useCallback(
    (imageFile) => dispatch(uploadSellerImage(imageFile)),
    [dispatch]
  );

  const setFilters = useCallback(
    (filters) => dispatch(setSellerListingFilters(filters)),
    [dispatch]
  );

  const clearFilters = useCallback(
    () => dispatch(clearSellerListingFilters()),
    [dispatch]
  );

  const saveDraft = useCallback(
    (draftData) => dispatch(saveDraftListing(draftData)),
    [dispatch]
  );

  const clearDraft = useCallback(
    () => dispatch(clearDraftListing()),
    [dispatch]
  );

  const changeListingStatus = useCallback(
    (listingId, status) => dispatch(updateListingStatus({ listingId, status })),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearSellerListingError()),
    [dispatch]
  );

  const clearSuccess = useCallback(
    () => dispatch(clearSellerListingSuccess()),
    [dispatch]
  );

  return {
    // State
    listings,
    currentListing,
    pagination,
    filters,
    statusCounts,
    loading,
    error,
    success,
    message,
    uploadedImages,
    draftListing,

    // Actions
    createListing,
    fetchListings,
    fetchListingById,
    fetchListingsByStatus,
    filterListings,
    deleteListing,
    updateListing,
    uploadImage,
    setFilters,
    clearFilters,
    saveDraft,
    clearDraft,
    changeListingStatus,
    clearError,
    clearSuccess,
  };
};

