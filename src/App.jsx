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
        </Route>

        {/* Routes that don't use the Layout (standalone pages) */}
        <Route path="/seller-registration" element={<SellerRegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
