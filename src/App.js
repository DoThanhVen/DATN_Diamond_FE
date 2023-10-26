import React from "react";
import Home from "./pages/user/Home";
import Login from "./pages/account/Login";
import Cart from "./pages/user/Cart";
import Product from "./pages/user/Product";
import Detail from "./pages/user/Detail"
import NewProducts from "./pages/user/NewProducts";

import OrderDetail from "./pages/user/OrderDetail"
import Checkout from "./pages/user/Checkout"
import Profile from "./pages/user/Profile"
import Order from "./pages/user/Order"

import SuggestedProducts from "./pages/user/SuggestedProducts";
import RecommendedProducts from "./pages/user/RecommendedProducts";

import HomeAdmin from "./components/admin/HomeAdmin"

import Otp from "./pages/account/Otp";

// import AdminDashBoard from "./componentadmin/AdminDashBoard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/cart" element={<Cart />}/>
      <Route path="/products/:id" element={<Product />}/>
      <Route path="/detail" element={<Detail/>}/>
      <Route path="/newProducts" element={<NewProducts/>}/>
      <Route path="/orderDetail" element={<OrderDetail/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/order" element={<Order/>}/>

       <Route path="/homeAdmin" element={<HomeAdmin/>}/>
       <Route path="/suggestedProducts" element={<SuggestedProducts/>}/>
       <Route path="/recommendedProducts" element={<RecommendedProducts />}/>
      
      <Route path="/otp" element={<Otp/>} />
    </Routes>
  );
}

export default App;
