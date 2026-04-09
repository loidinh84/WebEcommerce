import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/register";
import Product from "./pages/admin/Product";
import Cart from "./pages/Cart";
import AiBuilder from "./pages/AiBuilder";
import HangKhuyenMai from "./pages/HangKhuyenMai";
import SoSanhSanPham from "./pages/SoSanhSanPham";
import Laptop from "./pages/Laptop";
import ManHinh from "./pages/ManHinh";

function App() {
  return (
    <Router>
      <Routes>
        {/* Nhánh khách hàng */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/aibuilder" element={<AiBuilder />} />
        <Route path="/hangkhuyenmai" element={<HangKhuyenMai />} />
        <Route path="/sosanhsanpham" element={<SoSanhSanPham />} />
        <Route path="/laptop" element={<Laptop />} />
        <Route path="/manhinh" element={<ManHinh />} />

        {/* Nhánh Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
