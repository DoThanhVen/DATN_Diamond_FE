import React, { useEffect, useReducer } from "react";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/responsive.css";
import "../css/user/home.css";
import "../css/user/modal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-awesome-slider/dist/styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewProducts from "./NewProducts";
import SidebarM from "./SuggestedProducts";
import RecommendedProducts from "./RecommendedProducts";
import ProductSmall from "./ProductSmall";
import ProductIntroduction from "./ProductIntroduction";
import { useSelector, useDispatch } from "react-redux";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const items = [
    {
      imgSrc: "images/best-saler-4.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: false,
    },
    {
      imgSrc: "images/best-saler-3.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-2.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: false,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
    {
      imgSrc: "images/best-saler-1.jpg",
      discount: "-50%",
      name: "HP Notebook",
      price: "$999",
      available: 6,
      stars: 5,
      isNew: true,
    },
  ];
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <ProductSmall />
      <ProductIntroduction />
      <div style={{ backgroundColor: "#f5f5fa" }}>
        <div className="container pt-4 pb-4">
          <div className=" row ">
            <div className="col-xs-12 col-sm-12 col-md-3 ">
              <SidebarM />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 ">
              <div
                className="container bg-white p-2 "
                style={{ borderRadius: "8px" }}
              >
                <div className="gird-container">
                  <div
                    className="gird-item tall"
                    style={{ backgroundImage: "url('images/bn8.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/acrodeoncss/index.html">PHONG CÁCH</a>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn9.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/caja/index.html">CAJA 2</a>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn4.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/card.boostrap/index.html">CAJA 3</a>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn5.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/Flex.images/index.html">CAJA 4</a>
                    </div>
                  </div>
                  {/* <div className="gird-item wide" style={{ backgroundImage: "url('images/best-saler-4.jpg')" }}>
                    <div className="ejercico">
                      <a href="archivos/Form.boostrap/index.html">
                        CAJA 5
                      </a>
                    </div>
                  </div> */}
                  <div
                    className="gird-item tall"
                    style={{ backgroundImage: "url('images/bn2.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/form.parpadei/index.html">CAJA 6</a>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn6.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/Flex.images/index.html">CAJA 4</a>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn7.jpg')" }}
                  >
                    <div className="ejercico">
                      <a href="archivos/Flex.images/index.html">CAJA 4</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content mt-4" style={{ borderRadius: "8px" }}>
                <div className="titile">
                  <div className="container bg-white">
                    <nav className="navbar navbar-expand-md navbar-light bg-white">
                      <div className="container-fluid p-0">
                        {" "}
                        <a
                          className="navbar-brand text-uppercase fw-800"
                          href="#"
                        >
                          <span className="border-red pe-2">
                            SẢN PHẨM MỚI NHẤT
                          </span>
                        </a>{" "}
                        <button
                          className="navbar-toggler"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#myNav"
                          aria-controls="myNav"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          {" "}
                          <span className="fas fa-bars"></span>{" "}
                        </button>
                        <div className="collapse navbar-collapse" id="myNav">
                          <div className="navbar-nav ms-auto">
                            <a
                              className="nav-link active"
                              aria-current="page"
                              href="#"
                            >
                              Xem nhiều hơn
                            </a>
                          </div>
                        </div>
                      </div>
                    </nav>
                    <div className="row">
                      <NewProducts />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mb-3 bg-white p-4 mb-4"
                style={{ marginTop: "40px", borderRadius: "8px" }}
              >
                <div className="row px-xl-2">
                  <div className="col-lg-6">
                    <div
                      className="product-offer mb-30"
                      style={{ height: "200px" }}
                    >
                      <img
                        className="img-fluid"
                        src="images/home_banner2.jpg"
                        alt=""
                      />
                      <div className="offer-text">
                        <h6 className="text-white text-uppercase">Tại đây</h6>
                        <h4 className="text-white text-uppercase mb-3">
                          Sản phẩm đa dạng
                        </h4>
                        <a
                          href="/product"
                          className="btn"
                          style={{ background: "#319F43 ", color: "#fff" }}
                        >
                          Mua sắm ngay
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div
                      className="product-offer mb-30"
                      style={{ height: "200px" }}
                    >
                      <img
                        className="img-fluid"
                        src="images/home_banner1.jpg"
                        alt=""
                      />
                      <div className="offer-text">
                        <h6 className="text-white text-uppercase">Tại đây</h6>
                        <h4 className="text-white mb-3 text-uppercase">
                          Có tất cả những gì mà bạn cần
                        </h4>
                        <a
                          href="/"
                          className="btn"
                          style={{ background: "#319F43 ", color: "#fff" }}
                        >
                          Mua sắm ngay
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <RecommendedProducts />
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}
export default Home;