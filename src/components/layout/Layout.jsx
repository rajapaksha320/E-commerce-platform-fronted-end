// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import NavBar from "../homePageComponents/navBar/NavBar";
import Footer from "../homePageComponents/footer/Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
