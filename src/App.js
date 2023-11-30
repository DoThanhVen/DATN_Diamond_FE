import React, { useEffect, useState } from 'react'
import AdminDashBoard from './admin/AdminDashBoard'
import BusinessDashBoard from './business/BusinessDashBoard'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import Home from './page_user/user/Home'
import Login from './account/Login'
import Cart from './page_user/user/Cart'
import Product from './page_user/user/Product'
import Detail from './page_user/user/Detail'
import NewProducts from './page_user/user/NewProducts'

import OrderDetail from './page_user/user/OrderDetail'
import Checkout from './page_user/user/Checkout'
import Profile from './account/Profile'
import Order from './page_user/user/Order'

import SuggestedProducts from './page_user/user/SuggestedProducts'
import RecommendedProducts from './page_user/user/RecommendedProducts'
import Register from './account/Register'
import SalesRegistration from './account/SalesRegistration'
import ForgotPass from './account/ForgotPass'
import ContactInfo from './page_user/user/ContactInfo'
import Policy from './page_user/user/Policy'
import LikeProduct from './page_user/user/LikeProduct'
import Shop from './page_user/user/Shop'

import NotFoundPage from './page_user/user/NotFoundPage'
import { GetDataLogin } from './service/DataLogin'
import VNPayBankSelection from './pay/pay'
import ChatApp from './chatApp/chatApp'

function App () {
  const [accountLogin, setAccountLogin] = useState(null)
  const navigate = useNavigate()

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin()

    if (accountLogin !== undefined) {
      try {
        setAccountLogin(accountLogin)
      } catch (error) {
        console.log(error)
      }
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    getAccountFromSession()
  }, [])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/category/:id' element={<Product />} exact />
      <Route path='/product/:productId' element={<Detail />} exact />
      <Route path='/newProducts' element={<NewProducts />} />
      <Route path='/orderDetail' element={<OrderDetail />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/order' element={<Order />} />
      <Route path='/suggestedProducts' element={<SuggestedProducts />} />
      <Route path='/recommendedProducts' element={<RecommendedProducts />} />
      <Route path='/forgotPassword' element={<ForgotPass />} />
      <Route path='/register' element={<Register />} />
      <Route path='/salesRegistration' element={<SalesRegistration />} />
      <Route path='/contact' element={<ContactInfo />} />
      <Route path='/policy' element={<Policy />} />
      <Route path='/likeProduct' element={<LikeProduct />} />
      <Route path='/shops/:productId/shop' element={<Shop />} />
      <Route path='*' element={<Navigate to="/not-found" />} />
      <Route path='/not-found' element={<NotFoundPage />} />


      <Route path="*" element={<Navigate to="/not-found" />} />
      <Route path="/not-found" element={<NotFoundPage />} />

      <Route path="/admin/*" element={<AdminDashBoard />} />
      <Route path="/business/*" element={<BusinessDashBoard />} />

      {/* Mdung test pay */}
      <Route path="/pay" element={<VNPayBankSelection />} />

      <Route path="/chatApp" element={<ChatApp />} />
    </Routes>
  )
}

export default App
