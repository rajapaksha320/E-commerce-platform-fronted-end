import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import "./App.css";

// Import components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from "./components/layout/Layout";
import SellerLayout from "./components/sellerComponents/layout/SellerLayout";
import ScrollToTop from "./components/common/ScrollToTop";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";

// Import components for routes
import SellerRegisterForm from "./components/sellerComponents/sellerRegistrationComponents/sellerRegisterForm";
import ShopCollection from "./components/shopComponents/ShopCollection";
import CategoriesCollection from "./components/categoriesComponent/categoriesCollection";
import ProductCollection from "./components/popularProducts/ProductCollection";
import ShopView from "./components/shopComponents/ShopView/ShopView";
import ShopProducts from "./components/shopComponents/shopProducts/shopProducts";
import ContactShop from "./components/shopComponents/contactShop/ContactShop";

// Import pages
import HomePage from "./pages/homePage/HomePage";
import ContactUsPage from "./pages/contactUsPage/ContactUsPage";
import FAQ from "./pages/faqPage/FAQ";
import ReturnAndRefunds from "./pages/returnPage/ReturnAndRefunds";
import AboutUs from "./pages/aboutUsPage/AboutUs";
import OurStory from "./pages/outStoryPage/OurStory";
import Blogs from "./pages/blogPage/Blogs";
import BlogPostView from "./pages/blogPage/BlogPostView";
import ShippingInfo from "./pages/shippingInfoPage/ShippingInfo";
import SizeGuide from "./pages/sizeGuide/SizeGuide";
import TrackParcel from "./pages/trackingPage/TrackParcel";
import LeaveReview from "./pages/leaveReviewPage/LeaveReview";
import Deals from "./pages/deals/Deals";
import MainSearchResult from "./pages/searchResultPage/MainSearchResult";
import ProductPage from "./pages/productPage/ProductPage";
import WishList from "./pages/wishListPage/WishList";
import ShoppingCartPage from "./pages/shoppingCartPage/ShoppingCartPage";
import CheckoutPage from "./pages/checkoutPage/CheckoutPage";
import Orders from "./pages/ordersPage/Orders";
import Profile from "./pages/profilePage/Profile";
import Listing from "./pages/createListing/Listing";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* PUBLIC ROUTES - No authentication required */}
          <Route path="/" element={<Layout />}>
            {/* Homepage */}
            <Route index element={<HomePage />} />
            
            {/* Product & Shop Browsing - All Public */}
            <Route path="shop-collections" element={<ShopCollection />} />
            <Route path="category-collections" element={<CategoriesCollection />} />
            <Route path="product-collections" element={<ProductCollection />} />
            <Route path="shop/:shopId" element={<ShopView />} />
            <Route path="shop-products/:shopId" element={<ShopProducts />} />
            <Route path="contact-shop/:shopId" element={<ContactShop />} />
            <Route path="search" element={<MainSearchResult />} />
            <Route path="product/:productId" element={<ProductPage />} />
            <Route path="deals" element={<Deals />} />
            
            
            {/* Static/Information Pages - All Public */}
            <Route path="contact-us" element={<ContactUsPage />} />
            <Route path="faqs" element={<FAQ />} />
            <Route path="returns-and-refund" element={<ReturnAndRefunds />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="our-story" element={<OurStory />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blog/:id" element={<BlogPostView />} />
            <Route path="shipping-info" element={<ShippingInfo />} />
            <Route path="size-guide" element={<SizeGuide />} />
            
            {/* PROTECTED ROUTES - Authentication required (will show auth modal) */}
            
            {/* User Account Management */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Order Management */}
            <Route 
              path="orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            
            {/* Wishlist */}
            <Route 
              path="wish-list" 
              element={
                <ProtectedRoute>
                  <WishList />
                </ProtectedRoute>
              } 
            />

            {/* Shopping Cart */}
            <Route 
              path="shopping-cart" 
              element={
                <ProtectedRoute>
                  <ShoppingCartPage />
                </ProtectedRoute>
              }
            />
            
            {/* Checkout Process */}
            <Route 
              path="checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Order Tracking */}
            <Route 
              path="track-parcel" 
              element={
                <ProtectedRoute>
                  <TrackParcel />
                </ProtectedRoute>
              } 
            />
            
            {/* Review System */}
            <Route 
              path="leave-review" 
              element={
                <ProtectedRoute>
                  <LeaveReview />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* SELLER REGISTRATION - Public route (standalone page) */}
          <Route path="/seller-registration" element={<SellerRegisterForm />} />

          {/* SELLER PROTECTED ROUTES - Seller role required */}
          
          {/* Seller Dashboard */}
          <Route 
            path="/seller-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Create Listing - Seller only */}
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout>
                  <Listing />
                </SellerLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all for other seller routes */}
          <Route 
            path="/seller/*" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerLayout />
              </ProtectedRoute>
            } 
          />

          {/* 404 - Catch all unmatched routes */}
          <Route 
            path="*" 
            element={
              <NotFoundPage />
            } 
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;