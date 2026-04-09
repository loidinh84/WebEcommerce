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
import Order from "./pages/admin/Order";
import Customer from "./pages/admin/Customer";
import Inventory from "./pages/admin/Inventory";
import Profile from "./pages/admin/Profile";
import Categories from "./pages/admin/Categories";

function App() {
  return (  
    <Router>
      <Routes>
        {/* Nhánh khách hàng */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/aibuilder" element={<AiBuilder />} />

        {/* Nhánh Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Product />} />
          <Route path="orders" element={<Order />} />
          <Route path="customers" element={<Customer />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
