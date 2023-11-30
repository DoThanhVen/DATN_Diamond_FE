import React, { useState, useEffect, useReducer } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import style from "../css/user/likeProduct.module.css";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import "../css/user/likeProduct.css";

import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/product.css";
import "../css/user/home.css";
import "../css/user/slider.css";
import "../css/user/responsive.css";
import swal from "sweetalert";
import { GetDataLogin } from "../../service/DataLogin";
import LazyLoad from "react-lazy-load";

const API_BASE_URL = "http://localhost:8080";

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function valuetext(value) {
  return `${value}°C`;
}

function LikeProduct() {
  const [valueMin, setValueMin] = useState(0);
  const [valueMax, setValueMax] = useState(1000000);
  const [value, setValue] = useState([0, 1000000]);

  const handleSetValuePrice = (min, max) => {
    setValueMin(min);
    setValueMax(max);
    setValue([min, max]);

    handleSortValueMinMax(min, max);
  };
  const handleSortValueMinMax = (min, max) => {
    const delay = setTimeout(() => {
      const sortList = [...storageProduct];
      const filteredProducts = sortList.filter((product) => {
        const price = product.p[0].price;
        return price >= min && price <= max;
      });
      setSortedProducts(filteredProducts);
    }, 800);
    return () => clearTimeout(delay);
  };
  const [sortedProducts, setSortedProducts] = useState([]);
  const [storageProduct, setStorageProduct] = useState([]);
  const navigate = useNavigate();
  const [ACCOUNT_ID, setACCOUNT_ID] = useState("");
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== undefined) {
      try {
        setACCOUNT_ID(accountLogin.id_account);
        fetchData(accountLogin.id_account);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getAccountFromSession();
  }, []);

  const fetchData = (id) => {
    axios
      .get(`${API_BASE_URL}/api/likeProducts?accountId=${id}`)
      .then((response) => {
        setSortedProducts(response.data);
        setStorageProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSortPrice = (sort) => {
    const filteredProducts = sortedProducts.filter((product) => {
      const price = product.p[0].price;
      return price >= valueMin && price <= valueMax;
    });

    const productsCopy = [...filteredProducts];
    if (sort === "ascending") {
      productsCopy.sort((a, b) => a.p[0].price - b.p[0].price);
    } else if (sort === "descending") {
      productsCopy.sort((a, b) => b.p[0].price - a.p[0].price);
    }
    setSortedProducts(productsCopy);
  };

  const handleUnlikeProduct = (productId) => {
    axios
      .delete(
        `${API_BASE_URL}/api/unlike_Products?accountId=${ACCOUNT_ID}&productId=${productId}`
      )
      .then((response) => {
        if (response.data === "Sản phẩm đã được unlike.") {
          swal("Thông báo", "Đã xóa sản phẩm yêu thích.", "success");

          // Cập nhật danh sách sản phẩm
          const updatedProducts = sortedProducts.filter(
            (product) => product.id_product !== productId
          );
          setSortedProducts(updatedProducts);
        } else {
          swal("Thông báo", "Sản phẩm chưa được like.", "info");
        }
      })
      .catch((error) => {
        console.error(error);
        swal("Lỗi", "Đã xảy ra lỗi khi thực hiện thao tác.", "error");
      });
  };

  return (
    <>
      <nav>
        <MainNavbar />
      </nav>

      <div className="product">
        <section
          className="breadcrumb-section container"
          style={{
            backgroundImage: "url('/images/product_banner.jpg')",
            backgroundSize: "cover",
            width: "100%"
          }}
        >
          <Container>
            <Row>
              <Col lg={12} className="text-center">
                <div className="breadcrumb__text">
                  <h2>Diamond Shop</h2>
                  <p>
                    Khám phá một thế giới biến đổi với các sản phẩm của chúng
                    tôi. Cho dù bạn đang tìm cách nâng cấp phong cách của mình,
                    duy trì kết nối hay làm cho ngôi nhà của bạn thông minh hơn,
                    chúng tôi có mọi thứ bạn cần để thay đổi cuộc sống của bạn
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <div className={style.container}>
          <div className={style.sidebar}>
            <div
              className="sidebar mt-4"
              style={{ position: "sticky", top: "20px" }}
            >
              <div className="sidebar__item mt-4">
                <h5>Giá</h5>
                <div className="price-range-wrap pb-4">
                  <Box sx={{ width: 300 }}>
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      onChange={(event, newValue) => {
                        handleSetValuePrice(newValue[0], newValue[1]);
                      }}
                      value={value}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={0}
                      max={1000000}
                    />

                    <Typography variant="body2">
                      <span style={{ color: "#FF0000" }}>Giá:</span> {valueMin} - {valueMax}
                    </Typography>
                  </Box>
                </div>

                <div className="sidebar__item sidebar__item__color--option">
                  <h5>Sắp xếp giá</h5>
                  <FormControl component="fieldset">
                    <RadioGroup aria-label="priceSorting" name="priceSorting">
                      <FormControlLabel
                        value="ascending"
                        control={<Radio />}
                        label="Sắp xếp theo tăng dần"
                        onChange={(e) => handleSortPrice(e.target.value)}
                      />
                      <FormControlLabel
                        value="descending"
                        control={<Radio />}
                        label="Sắp xếp theo giảm dần"
                        onChange={(e) => handleSortPrice(e.target.value)}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className={style.content}>
            <div className={style.listProduct}>
              <label className={style.heading}>DANH SÁCH SẢN PHẨM</label>
              <div className={style.list_product}>
                {sortedProducts.map((value, index) => (
                  <LazyLoad
                    once={true}
                    key={index}
                    className={style.item_product}
                  >
                    <Link to={`/product/${value.id_product}`}>
                      <img
                        key={value.id}
                        src={`${API_BASE_URL}/api/uploadImageProduct/${
                          value.p[0].image_urls[
                            value.p[0].image_urls.length - 1
                          ].url
                        }`}
                        alt={`Image ${
                          value.p[0].image_urls[
                            value.p[0].image_urls.length - 1
                          ].url
                        }`}
                        className={style.image}
                      />
                      <div className={style.name}>
                        {value.p[0].product_name}
                      </div>
                      <div className={style.info}>
                        <label className={style.price}>
                          {formatCurrency(value.p[0].price, 0)}
                        </label>
                        <label className={style.amount_sell}>Đã bán 999</label>
                      </div>
                      <div className={style.show_detail}>Xem chi tiết</div>
                    </Link>
                  </LazyLoad>
                ))}
              </div>
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
export default LikeProduct;
