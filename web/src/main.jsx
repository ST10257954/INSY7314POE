import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css"; // <- this must exist

import App from "./pages/App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Payments from "./pages/Payment.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route index element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payments" element={<Payments />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
