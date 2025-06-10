import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homePage/HomePage";
import NavBar from "./components/homePageComponents/navBar/NavBar";
import Footer from "./components/homePageComponents/footer/Footer";
import SellerRegisterForm from "./components/sellerComponents/sellerRegistrationComponents/sellerRegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page with NavBar and Footer */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-grow">
                <HomePage />
              </main>
              <Footer />
            </div>
          }
        />

        <Route path="/seller-registration" element={<SellerRegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
