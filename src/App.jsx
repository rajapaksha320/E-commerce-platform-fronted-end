// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../src/store/index';

// Import components
import ProtectedRoute from './components/auth/ProtectedRoute';
import SellerLayout from './components/layout/Layout';
import MultiStepSellerForm from './components/sellerComponents/sellerRegistrationComponents/sellerRegisterForm';

// Import pages (you'll need to create these)
import HomePage from './pages/homePage/HomePage';
import WishListPage from './pages/wishListPage/WishList';
import ShoppingCartPage from './pages/shoppingCartPage/ShoppingCartPage';
import ProfilePage from './pages/profilePage/Profile';
import OrdersPage from './pages/ordersPage/Orders';
import TrackParcelPage from './pages/trackingPage/TrackParcel';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/seller-registration" element={<MultiStepSellerForm />} />

          {/* Buyer Protected Routes */}
          <Route
            path="/wish-list"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <WishListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopping-cart"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <ShoppingCartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-parcel"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <TrackParcelPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Protected Routes */}
          <Route
            path="/seller-dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout>
                  {/* Create Listing Component */}
                </SellerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;