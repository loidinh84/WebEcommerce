import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Nhánh khách hàng */}
        <Route path="/" element={<Home />} />

        {/* Nhánh Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      
      </Routes>
    </Router>
  );
}

export default App;
