import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage/HomePage";
import Layout from "./components/layout/Layout";
import SellerRegisterForm from "./components/sellerComponents/sellerRegistrationComponents/sellerRegisterForm";
import ShopCollection from "./components/shopComponents/ShopCollection";
import ScrollToTop from "./components/common/ScrollToTop";
import CategoriesCollection from "./components/categoriesComponent/categoriesCollection";
import ProductCollection from "./components/popularProducts/ProductCollection";
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
import ShopView from "./components/shopComponents/ShopView/ShopView";
import ShopProducts from "./components/shopComponents/shopProducts/shopProducts";
import ContactShop from "./components/shopComponents/contactShop/ContactShop";
import MainSearchResult from "./pages/searchResultPage/MainSearchResult";
import ProductPage from "./pages/productPage/ProductPage";
import WishList from "./pages/wishListPage/WishList";
import ShoppingCartPage from "./pages/shoppingCartPage/ShoppingCartPage";
import CheckoutPage from "./pages/checkoutPage/CheckoutPage";
import Orders from "./pages/ordersPage/Orders";
import Profile from "./pages/profilePage/Profile";
import SellerLayout from "./components/sellerComponents/layout/SellerLayout";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Routes that use the Layout (with NavBar and Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop-collections" element={<ShopCollection />} />
          <Route
            path="category-collections"
            element={<CategoriesCollection />}
          />
          <Route path="product-collections" element={<ProductCollection />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="faqs" element={<FAQ />} />
          <Route path="returns-and-refund" element={<ReturnAndRefunds />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="our-story" element={<OurStory />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog/:id" element={<BlogPostView />} />
          <Route path="shipping-info" element={<ShippingInfo />} />
          <Route path="size-guide" element={<SizeGuide />} />
          <Route path="track-parcel" element={<TrackParcel />} />
          <Route path="leave-review" element={<LeaveReview />} />
          <Route path="deals" element={<Deals />} />
          <Route path="shop/:shopId" element={<ShopView />} />
          <Route path="shop-products/:shopId" element={<ShopProducts />} />
          <Route path="contact-shop/:shopId" element={<ContactShop />} />
          <Route path="/search" element={<MainSearchResult />} />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route path="/wish-list" element={<WishList />} />
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* Routes that don't use the Layout (standalone pages) */}
        <Route path="/seller-registration" element={<SellerRegisterForm />} />
        <Route path="/seller-dashboard" element={<SellerLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
