import React, { useEffect, useReducer, useState } from "react";
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
import style from "../css/user/home.module.css";
import ChatApp from "../../chatApp/chatApp";
import { GetDataLogin } from "../../service/DataLogin";

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
  const [isLogin, setIsLogin] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false)
  const [showIconMess, setShowIconMess] = useState(true)
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  useEffect(() => {
    getDataLogin()
  }, [])
  
  const getDataLogin = () => {
    const accountLogin = GetDataLogin();
    if (accountLogin) {
      setIsLogin(true)
      console.log(accountLogin)
    }
  }
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div style={{ backgroundColor: "#f5f5fa" }}>
        <div className="p-4">
          <div className={style.container}>
            <SidebarM />
            <div className={style.content}>
              <div
                className="container bg-white"
                style={{ borderRadius: "8px" }}
              >
                <div className="gird-container">
                  <div
                    className="gird-item tall"
                    style={{ backgroundImage: "url('images/bn8.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>PHONG CÁCH</label>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn9.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>LỊCH LÃM</label>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn4.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>HIỆN ĐẠI</label>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn5.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>TIỆN NGHI</label>
                    </div>
                  </div>
                  <div
                    className="gird-item tall"
                    style={{ backgroundImage: "url('images/bn2.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>QUYẾN RŨ</label>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn6.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>LÀM ĐẸP</label>
                    </div>
                  </div>
                  <div
                    className="gird-item"
                    style={{ backgroundImage: "url('images/bn7.jpg')" }}
                  >
                    <div className="ejercico">
                      <label>ĐA DẠNG</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={style.listNewProduct}>
                <label className={style.heading}>DANH SÁCH SẢN PHẨM MỚI</label>
                <NewProducts />
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
              <div className={style.listRecommended}>
                <label className={style.heading}>SẢN PHẨM DÀNH CHO BẠN</label>
                <RecommendedProducts />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
      {isLogin && showIconMess ? (
        <i className={`bi bi-chat-dots-fill ${isShowChat}`} onClick={() => { setIsShowChat(!isShowChat); setShowIconMess(false) }}></i>
      ) : null}
      {isLogin && isShowChat ? (
        <div id="chat">
          <i class="bi bi-x-lg" onClick={() => { setIsShowChat(false); setShowIconMess(true) }} style={{ fontSize: '30px', color: 'blue' }}></i>
          <ChatApp shop={null} />
        </div>
      ) : null}
    </>
  );
}
export default Home;
