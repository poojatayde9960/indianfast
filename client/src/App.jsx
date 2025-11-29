import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./componants/Layout";
import Dashboard from "./pages/dashboad/Dashboard";
import FoodItem from "./pages/catogries/FoodItem";
import AddCategories from "./pages/catogries/addCatogries";
import Transactions from "./pages/Transactions";
import TotalOrders from "./pages/dashboad/TotalOrders";
import AddBanner from "./pages/banner/AddBanner";
import SeeApprovedBanners from "./pages/banner/SeeApprovedBanners";
import Orders from "./pages/Orders";
import Complaints from "./pages/Complaints";
import Coupons from "./pages/coupon/CouponCode";
import PersonalDetails from "./pages/PersonalDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorProtected from "./share/vendorProtected";
import Review from "./pages/Review";
import "react-datepicker/dist/react-datepicker.css";
import AttendanceTimer from "./pages/dashboad/AttendanceTimer";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          {/* Default route should go to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route path="/" element={<VendorProtected compo={<Layout />} />}    >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="foodItems" element={<FoodItem />} />
            <Route path="addCategories" element={<AddCategories />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="totalOrders" element={<TotalOrders />} />
            <Route path="addBanner" element={<AddBanner />} />
            <Route path="orders" element={<Orders />} />
            <Route path="review" element={<Review />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="personalDetails" element={<PersonalDetails />} />
            <Route path="attendanceTimer" element={<AttendanceTimer />} />
            <Route path="approved-banners" element={<SeeApprovedBanners />} />
          </Route>

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
