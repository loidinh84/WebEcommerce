import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { StoreContext } from "./context/StoreContext";
import PrivateRoute from "./components/PrivateRoute";
import Maintenance from "./pages/Maintenance";
import BASE_URL from "./config/api";
import StoreSettings from "./pages/admin/StoreSetting";
import Home from "./pages/Home";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/register";
import Product from "./pages/admin/Product";
import ProductDetail from "./pages/ProductDetail";
import UserProfile from "./pages/UserProfile";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Categories from "./pages/admin/Categories";
import Order from "./pages/admin/Order";
import Customer from "./pages/admin/Customer";
import Inventory from "./pages/admin/Inventory";
import InventoryCheck from "./pages/admin/InventoryCheck";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Banner from "./pages/admin/Banner";
import CheckoutSetting from "./pages/admin/CheckoutSetting";
import Memberships from "./pages/admin/TheThanhVienList";
import DienThoai from "./pages/DienThoai";

// import { TheThanhVien } from "../../backend/models";

const API_URL = BASE_URL;

function App() {
  const { storeConfig } = useContext(StoreContext);
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (storeConfig) {
      document.title = storeConfig.ten_cua_hang || "LTL Shop";

      if (storeConfig.logo_url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = `${API_URL}${storeConfig.logo_url}`;
      }
    }
  }, [storeConfig]);

  if (storeConfig?.bao_tri_he_thong && !isAdminPath) {
    return <Maintenance />;
  }

  return (
    <Routes>
      {/* Nhánh khách hàng */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/order-detail/:id" element={<OrderDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/dienthoai" element={<DienThoai />} />

      {/* Nhánh Admin */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Order />} />
          <Route path="customers" element={<Customer />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory-check" element={<InventoryCheck />} />
          <Route path="settings" element={<StoreSettings />} />
          <Route path="banners" element={<Banner />} />
          <Route path="checkout-settings" element={<CheckoutSetting />} />
          <Route path="memberships" element={<Memberships />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
