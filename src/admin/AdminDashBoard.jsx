import React, { useState, useEffect } from "react";
import Home from "./Home";
import Account from "./account/Account";
import Shop from "./shop/Shop";
import ShopDetail from "./shop/Shopdetail.jsx";
import Bill from "./bill/Bill";
import Category from "./category/Category";
import ProductAdmin from "./product/ProductAdmin";
import Statistical from "./statisitcal/Statistical";
import style from "../css/admin/nav.module.css";
import { Link, useLocation } from "react-router-dom";
import { callAPI } from "../service/API.js";
import axios from "axios";

function AdminDashboard() {
  //ROUTER
  const location = useLocation();
  const isActiveHome = location.pathname === "/admin";
  const isActiveAccount = location.pathname === "/admin/accounts";
  const isActiveShop = location.pathname === "/admin/shops";
  const isActiveShopDetail = location.pathname === "/admin/shop/shopdetail";
  const isActiveTypeProduct = location.pathname === "/admin/categories";
  const isActiveListProduct = location.pathname === "/admin/products";
  const isActiveStatistical = location.pathname === "/admin/statistical";
  const isActiveListOrder = location.pathname === "/admin/bills";
  const isActiveOrderDetail = location.pathname === "/admin/bills/billdetail";
  //ListMenu
  const listMenu = [
    {
      id: "0",
      value: "Trang Chủ",
      icon: "bi bi-house",
      mapping: "/admin",
      active: isActiveHome,
      activeDetail: null
    },
    {
      id: "1",
      value: "Quản Lý Tài Khoản",
      icon: "bi bi-person-circle",
      mapping: "/admin/accounts",
      active: isActiveAccount,
      activeDetail: null
    },
    {
      id: "2",
      value: "Quản Lý Cửa Hàng",
      icon: "bi bi-shop",
      mapping: "/admin/shops",
      active: isActiveShop,
      activeDetail: isActiveShopDetail
    },
    {
      id: "3",
      value: "Quản Lý Sản Phẩm",
      icon: "bi bi-handbag",
      mapping: "/admin/products",
      active: isActiveListProduct,
      activeDetail: null
    },
    {
      id: "4",
      value: "Phân Loại Sản Phẩm",
      icon: "bi bi-tags",
      mapping: "/admin/categories",
      active: isActiveTypeProduct,
      activeDetail: null
    },
    {
      id: "5",
      value: "Quản Lý Đơn Hàng",
      icon: "bi bi-receipt",
      mapping: "/admin/bills",
      active: isActiveListOrder,
      activeDetail: isActiveOrderDetail
    },
    {
      id: "6",
      value: "Thống Kê",
      icon: "bi bi-graph-up-arrow",
      mapping: "/admin/statistical",
      active: isActiveStatistical,
      activeDetail: null
    },
    {
      id: "7",
      value: "Đăng Xuất",
      icon: "bi bi-door-open",
      mapping: "/admin",
      active: null,
      activeDetail: null
    }
  ];

  const styleMenuActive = {
    color: "#8F6D02",
    backgroundColor: "#F8EECE",
    borderRadius: "10px"
  };

  return (
    <React.Fragment>
      <div id={style.adminDashBoard}>
        <div className={style.sidebar}>
          <div className={style.logo}>
            <img className={style.image} src="/images/diamond.png" alt="LOGO" />
          </div>
          <ul className={style.menu}>
            {listMenu.map((value, index) =>
              <li
                key={index}
                className={`${style.menuItem}`}
                style={
                  value.active || value.activeDetail ? styleMenuActive : {}
                }
              >
                <Link
                  className={style.link}
                  to={value.mapping}
                  style={{
                    color:
                      value.active || value.activeDetail ? "#8F6D02" : "black"
                  }}
                >
                  <i className={value.icon} /> {value.value}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div id={style.content}>
          {isActiveHome ? <Home /> : null}
          {isActiveAccount ? <Account /> : null}
          {isActiveShop? <Shop /> : null}
          {isActiveShopDetail? <ShopDetail /> : null}
          {isActiveTypeProduct ? <Category /> : null}
          {isActiveListProduct ? <ProductAdmin /> : null}
          {isActiveStatistical ? <Statistical /> : null}
          {isActiveListOrder || isActiveOrderDetail ? <Bill /> : null}
        </div>
      </div>
    </React.Fragment>
  );
}
export default AdminDashboard;
