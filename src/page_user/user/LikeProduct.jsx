import React, { useState, useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../css/user/likeProduct.css";

import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/product.css";
import "../css/user/home.css";
import "../css/user/slider.css";
import "../css/user/responsive.css";
import swal from "sweetalert";

const API_BASE_URL = "http://localhost:8080";
const ACCOUNT_ID = 6;

function valuetext(value) {
  return `${value}°C`;
}

function productReducer(state, action) {
  switch (action.type) {
    case "SET_FILTER_OPTIONS":
      return {
        ...state,
        filterOptions: { ...state.filterOptions, ...action.filterOptions },
      };
    case "SET_PRODUCTS":
      return { ...state, products: action.products };
    case "SET_RATING_FILTER":
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          ratingFilter: action.ratingFilter,
        },
      };
    case "SET_PRICE_SORTING":
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          priceSorting: action.priceSorting,
        },
      };
    default:
      return state;
  }
}

function LikeProduct() {
  const [localState, dispatch] = useReducer(productReducer, {
    filterOptions: {
      value1: [0, 1000000],
      valueMin: 0,
      valueMax: 1000000,
      dateSorting: "ascending",
      priceSorting: "ascending",
      ratingFilter: "5",
    },
    products: [],
  });

  const { filterOptions, products } = localState;

  const { priceSorting } = localState;

  const { ratingFilter } = localState;

  const handleRatingFilterChange = (e) => {
    dispatch({ type: "SET_RATING_FILTER", ratingFilter: e.target.value });
  };

  const handlePriceSortingChange = (e) => {
    dispatch({ type: "SET_PRICE_SORTING", priceSorting: e.target.value });
  };
  const handleChangeFilter = (newFilterOptions) => {
    dispatch({ type: "SET_FILTER_OPTIONS", filterOptions: newFilterOptions });
  };

  const [sortedProducts, setSortedProducts] = useState([]);

  const { id } = useParams();

  const getListProduct = () => {
    axios
      .get(`${API_BASE_URL}/api/product`)
      .then((response) => {
        dispatch({ type: "SET_PRODUCTS", products: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [filterOptions, id]);

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api/likeProducts?accountId=${ACCOUNT_ID}`)
      .then((response) => {
        dispatch({ type: "SET_PRODUCTS", products: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (Array.isArray(localState.products)) {
      const filteredProducts = localState.products.filter((product) => {
        const price = product.p[0].price;
        return (
          price >= localState.filterOptions.valueMin &&
          price <= localState.filterOptions.valueMax
        );
      });

      const productsCopy = [...filteredProducts];
      if (localState.filterOptions.priceSorting === "ascending") {
        productsCopy.sort((a, b) => a.p[0].price - b.p[0].price);
      } else if (localState.filterOptions.priceSorting === "descending") {
        productsCopy.sort((a, b) => b.p[0].price - a.p[0].price);
      }
      setSortedProducts(productsCopy);
    }
  }, [localState.filterOptions, localState.products]);

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
            width: "100%",
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
        <section className="product spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-5">
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
                          value={filterOptions.value1}
                          onChange={(_, newValue) => {
                            handleChangeFilter({
                              ...filterOptions,
                              value1: newValue,
                              valueMin: newValue[0],
                              valueMax: newValue[1],
                            });
                          }}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          min={0}
                          max={1000000}
                        />
                        <Typography variant="body2">
                          <span style={{ color: "#FF0000" }}>Value:</span>
                          {filterOptions.value1[0]} - {filterOptions.value1[1]}
                        </Typography>
                      </Box>
                    </div>

                    <div className="sidebar__item sidebar__item__color--option">
                      <h5>Sắp xếp giá</h5>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="priceSorting"
                          name="priceSorting"
                          value={priceSorting}
                          onChange={handlePriceSortingChange}
                        >
                          <FormControlLabel
                            value="ascending"
                            control={<Radio />}
                            label="Sắp xếp theo tăng dần"
                          />
                          <FormControlLabel
                            value="descending"
                            control={<Radio />}
                            label="Sắp xếp theo giảm dần"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>

                    <div className="sidebar__item sidebar__item__color--option">
                      <h5>Đánh giá</h5>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="ratingFilter"
                          name="ratingFilter"
                          value={ratingFilter}
                          onChange={handleRatingFilterChange}
                        >
                          <FormControlLabel
                            value="5"
                            control={<Radio />}
                            label="5 sao"
                          />
                          <FormControlLabel
                            value="4"
                            control={<Radio />}
                            label="4 sao"
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio />}
                            label="3 sao"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="2 sao"
                          />
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="1 sao"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-7">
                <div className="product__discount">
                  <div>
                    {sortedProducts.length > 0 ? (
                      <div className=" ">
                        <nav className="navbar navbar-expand-md navbar-light bg-white">
                          <div className=" p-0">
                            <a
                              className="navbar-brand text-uppercase fw-800"
                              href="/#"
                            >
                              <span className="border-red pe-2">
                                DANH SÁCH SẢN PHẨM YÊU THÍCH CỦA BẠN
                              </span>
                            </a>
                            <button
                              className="navbar-toggler"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#myNav"
                              aria-controls="myNav"
                              aria-expanded="false"
                              aria-label="Toggle navigation"
                            >
                              <span className="fas fa-bars"></span>
                            </button>
                            <div
                              className="collapse navbar-collapse"
                              id="myNav"
                            ></div>
                          </div>
                        </nav>
                        <div className="all-items">
                          <div className="container bg-white d-flex justify-content-around flex-wrap">
                            {sortedProducts.map((product, index) => (
                              <div
                                key={index}
                                className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3"
                              >
                                <div className="product">
                                  {product.p[0].image_urls &&
                                    product.p[0].image_urls.map(
                                      (image, imageIndex) => (
                                        <img
                                          key={imageIndex}
                                          src={
                                            `${API_BASE_URL}/api/uploadImageProduct/` +
                                            image.url
                                          }
                                          alt={`Image ${imageIndex}`}
                                        />
                                      )
                                    )}

                                  <div className="trash-button">
                                    <button
                                      onClick={() =>
                                        handleUnlikeProduct(product.id_product)
                                      }
                                      style={{
                                        paddingBottom: "5px",
                                        paddingTop: "5px",
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                      }}
                                      className="btn btn-danger"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </div>
                                  {/* <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                    <li className="icon">
                                      <span className="fas fa-expand-arrows-alt"></span>
                                    </li>
                                    <li className="icon mx-3">
                                      <span className="far fa-heart"></span>
                                    </li>
                                    <li className="icon">
                                      <span className="fas fa-shopping-bag"></span>
                                    </li>
                                  </ul> */}
                                </div>
                                <div className="tag bg-red">sale</div>
                                <div className="title pt-4 pb-1">
                                  <Link to={`/product/${product.id_product}`}>
                                    {" "}
                                    {product.p[0].product_name}{" "}
                                  </Link>
                                </div>
                                <div className="d-flex align-content-center justify-content-center">
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                </div>
                                <div className="price">
                                  {product.p[0].price}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="product__pagination pb-4">
                          <a href="#">1</a>
                          <a href="#">2</a>
                          <a href="#">3</a>
                          <a href="#">
                            <i className="fa fa-long-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "80vh",
                        }}
                      >
                        <img
                          src="/images/likepage.jpg"
                          alt="likepage"
                          style={{ width: "500px", marginBottom: "20px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </>
  );
}
export default LikeProduct;
