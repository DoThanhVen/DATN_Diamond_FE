import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./nav.css";
import "../css/user/responsive.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { GetDataLogin } from "../../service/DataLogin";
import { cartSelector } from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
const MainNavbar = () => {

  const cart = useSelector(cartSelector);
  let total = 0;
  cart&& cart.map((item,index) => {
    total = index + 1
  })

  const [accountLogin, setAccountLogin] = useState(null);

  useEffect(() => {
    setAccountLogin(GetDataLogin());
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate.push(`/search?name=${searchQuery}`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accountLogin");
    const delay = setTimeout(() => {
      navigate("/");
    }, 800);
    return () => clearTimeout(delay);
  };
  return (
    <>
      <header className="header shop">
        {/* Topbar */}
        <div className="topbar">
          <div className="container">
            <div className="row pt-2">
              <div className="col-lg-4 col-md-12 col-12">
                {/* Top Left */}
                <div className="top-left">
                  <ul className="list-main">
                    <li>
                      <i className="ti-email"></i> feads.bussiness@gmail.com
                    </li>
                  </ul>
                </div>
                {/*/ End Top Left */}
              </div>
              <div className="col-lg-8 col-md-12 col-12">
                {/* Top Right */}
                <div className="right-content">
                  <ul className="list-main">
                    {accountLogin &&
                    accountLogin.shop &&
                    accountLogin.shop.status === 1 ? (
                      <li>
                        <i className="ti-location-pin"></i>{" "}
                        <a href="/business">Kênh bán hàng</a>
                      </li>
                    ) : (
                      <li>
                        <i className="ti-location-pin"></i>
                        <a href="/salesRegistration">Đăng ký bán hàng</a>
                      </li>
                    )}
                    <li>
                      <i className="ti-user"></i>{" "}
                      <a href="/profile">Tài khoản của tôi</a>
                    </li>
                    <li>
                      {accountLogin !== null ? (
                        accountLogin.username
                      ) : (
                        <div>
                          <i className="ti-power-off"></i>
                          <a href="/login">Đăng nhập</a>
                        </div>
                      )}
                    </li>
                    {accountLogin !== null ? (
                      <li>
                        <div>
                          <i className="bi bi-door-open"></i>
                          <a href="" onClick={() => handleLogout()}>
                            Đăng xuất
                          </a>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
                {/* End Top Right */}
              </div>
            </div>
          </div>
        </div>
        {/* End Topbar */}
        <div className="middle-inner border-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-2 col-12">
                {/* Logo */}
                <div
                  className="logo "
                  style={{ marginTop: "12px", marginLeft: "80px" }}
                >
                  <a href="/">
                    <img
                      src="/images/LogoFEADS.png"
                      alt=""
                      style={{ width: "115px" }}
                    />
                  </a>
                </div>
                {/*/ End Logo */}
                {/* Search Form */}
                <div className="search-top">
                  <div className="top-search">
                    <a href="#0">
                      <i className="ti-search"></i>
                    </a>
                  </div>
                  {/* Search Form */}
                  <div className="search-top">
                    <form className="search-form">
                      <input
                        type="text"
                        placeholder="Search here..."
                        name="search"
                      />
                      <button value="search" type="submit">
                        <i className="ti-search"></i>
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mobile-nav"></div>
              </div>
              <div className="col-lg-8 col-md-7 mt-4 col-12">
                <Form role="search" onSubmit={handleSearch}>
                  <div className="input-group">
                    <FormControl
                      type="search"
                      placeholder="Tìm kiếm sản phẩm của bạn"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="light" type="submit">
                      <i className="fa fa-search"></i>
                    </Button>
                  </div>
                </Form>
                <Navbar expand="lg">
                  <div className="">
                    {/* <Link className="d-block d-sm-block d-md-none d-lg-none" to="/">
                      <img src="/images/Diamond.png" alt="Logo" style={{ width: '60px' }} />
                    </Link> */}
                    <Navbar.Toggle
                      style={{ marginTop: "2px" }}
                      aria-controls="basic-navbar-nav"
                    />
                    <Navbar.Collapse id="basic-navbar-nav ">
                      <Nav
                        className="me-auto  mb-lg-0 container "
                        style={{ paddingTop: "5px" }}
                      >
                        <Nav.Link href="/" style={{ fontSize: "14px" }}>
                          Trang chủ
                        </Nav.Link>
                        <Nav.Link href="/cart" style={{ fontSize: "14px" }}>
                          Giỏ hàng
                        </Nav.Link>
                        <Nav.Link href="/order" style={{ fontSize: "14px" }}>
                          Đơn hàng của tôi
                        </Nav.Link>
                        <Nav.Link
                          href="/likeProduct"
                          style={{ fontSize: "14px" }}
                        >
                          Danh sách yêu thích
                        </Nav.Link>
                        <Nav.Link href="/policy" style={{ fontSize: "14px" }}>
                          Chính sách
                        </Nav.Link>
                        <Nav.Link href="/contact" style={{ fontSize: "14px" }}>
                          Thông tin liên hệ
                        </Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                  </div>
                </Navbar>
              </div>
              <div className="col-lg-2 col-md-3 col-12">
                <div className="right-bar">
                  {/* Search Form */}
                  <div className="sinlge-bar">
                    <a href="/likeProduct" className="single-icon">
                      <i className="fa-regular fa-heart"></i>
                    </a>
                  </div>
                  <div className="sinlge-bar">
                    <a href="/profile" className="single-icon">
                      <i className="fa-solid fa-user"></i>
                    </a>
                  </div>
                  <div className="sinlge-bar shopping">
                    <a href="/cart" className="single-icon">
                      <i className="fa-solid fa-bag-shopping"></i>{" "}
                      <span className="total-count">{total}</span>
                    </a>
                    {/* Shopping Item */}
                    <div className="shopping-item">
                      <div className="dropdown-cart-header">
                        <span>{total} sản phẩm</span>
                        <a href="/cart">Xem giỏ hàng</a>
                      </div>
                      <ul className="shopping-list">
                        {cart?.map((item,index) => (
                          <li key={index}>
                          <a
                            href="#"
                            className="remove"
                            title="Remove this item"
                          >
                            <i className="fa fa-remove"></i>
                          </a>
                          <a className="cart-img" href="#">
                            <img
                              src="https://via.placeholder.com/70x70"
                              alt="#"
                            />
                          </a>
                          <h4>
                            <a href="#">{item.product_name}</a>
                          </h4>
                          <p className="quantity">
                            1 - <span className="amount">{item.quantity}</span>
                          </p>
                        </li>
                        ))}
                        
                       
                      </ul>
                      <div className="bottom">
                        <div className="total">
                          <span>Tổng</span>
                          <span className="total-amount">$134.00</span>
                        </div>
                        <a href="/checkout" className="btn animate">
                          Thanh toán
                        </a>
                      </div>
                    </div>
                    {/*/ End Shopping Item */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default MainNavbar;
