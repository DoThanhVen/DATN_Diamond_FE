import React, { useState, useEffect, useReducer } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ListGroup from "react-bootstrap/ListGroup";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/product.css";
import "../css/user/home.css";
import "../css/user/slider.css";

const API_BASE_URL = "http://localhost:8080";

// Hàm này được sử dụng để hiển thị giá trị của Slider
function valuetext(value) {
  return `${value}°C`;
}

// Reducer cho quản lý trạng thái của component Product
function productReducer(state, action) {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        value1: action.value1,
        valueMin: action.valueMin,
        valueMax: action.valueMax,
      };
    case "SET_CATEGORY_ITEM":
      return { ...state, categoryItem: action.categoryItem };
    case "SET_PRODUCTS":
      return { ...state, products: action.products };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.selectedCategory };
    case "SET_DATE_SORTING":
      return { ...state, dateSorting: action.dateSorting };
    case "SET_PRICE_SORTING":
      return { ...state, priceSorting: action.priceSorting };
    case "SET_RATING_FILTER":
      return { ...state, ratingFilter: action.ratingFilter };
    default:
      return state;
  }
}

function Product() {
  // Sử dụng useReducer để quản lý trạng thái của component
  const [localState, dispatch] = useReducer(productReducer, {
    value1: [0, 1000000],
    valueMin: 0,
    valueMax: 1000000,
    categoryItem: [],
    products: [],
    selectedCategory: null,
    dateSorting: "ascending",
    priceSorting: "ascending",
    ratingFilter: "5",
  });
  const {
    value1,
    valueMin,
    valueMax,
    categoryItem,
    products,
    selectedCategory,
    dateSorting,
    priceSorting,
    ratingFilter,
  } = localState;
  const [sortedProducts, setSortedProducts] = useState([]);

  // Bắt sự kiện khi giá trị của Slider thay đổi
  const handleChange1 = (event, newValue) => {
    dispatch({
      type: "SET_VALUE",
      value1: newValue,
      valueMin: newValue[0],
      valueMax: newValue[1],
    });
  };

  // Bắt sự kiện khi thay đổi sắp xếp theo ngày
  const handleDateSortingChange = (e) => {
    dispatch({ type: "SET_DATE_SORTING", dateSorting: e.target.value });
  };

  // Bắt sự kiện khi thay đổi sắp xếp theo giá
  const handlePriceSortingChange = (e) => {
    dispatch({ type: "SET_PRICE_SORTING", priceSorting: e.target.value });
  };

  // Bắt sự kiện khi thay đổi bộ lọc theo độ đánh giá
  const handleRatingFilterChange = (e) => {
    dispatch({ type: "SET_RATING_FILTER", ratingFilter: e.target.value });
  };

  // Lấy dữ liệu danh mục từ server khi component được render
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/category/${id}`)
      .then((response) => {
        // Loại bỏ các danh mục trùng lặp
        const uniqueCategoryList = response.data.listCategory.filter(
          (category, index, self) =>
            index ===
            self.findIndex(
              (c) => c.type_category_item === category.type_category_item
            )
        );
        response.data.listCategory = uniqueCategoryList;

        // Cập nhật danh sách danh mục
        dispatch({
          type: "SET_CATEGORY_ITEM",
          categoryItem: response.data.listCategory,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // Lấy danh sách sản phẩm từ server khi component được render
  useEffect(() => {
    getListProduct();
  }, []);

  // Hàm để lấy danh sách sản phẩm từ server
  const getListProduct = () => {
    axios
      .get(`${API_BASE_URL}/api/product`)
      .then((response) => {
        // Cập nhật danh sách sản phẩm
        dispatch({ type: "SET_PRODUCTS", products: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Lọc sản phẩm
  const listFilter = [];
  categoryItem.forEach((value) => {
    products.forEach((product) => {
      if (value.id === product.categoryItem_product.id) {
        listFilter.push(product);
      }
    });
  });

  // Lọc và sắp xếp sản phẩm theo giá
  useEffect(() => {
    const filteredProducts = listFilter.filter((product) => {
      return (
        (!selectedCategory ||
          product.categoryItem_product.id === selectedCategory.id) &&
        product.price >= valueMin &&
        product.price <= valueMax
      );
    });

    const productsCopy = [...filteredProducts];

    if (priceSorting === "ascending") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (priceSorting === "descending") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    // Chỉ cập nhật sortedProducts nếu nó thay đổi
    if (!isEqual(sortedProducts, productsCopy)) {
      setSortedProducts(productsCopy);
    }
  }, [
    selectedCategory,
    valueMin,
    valueMax,
    priceSorting,
    listFilter,
    sortedProducts,
  ]);

  // Hàm so sánh đối tượng
  function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

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
                  <div className="hero__categories">
                    <div className="hero__categories__all">
                      <i className="fa fa-bars"></i>
                      <span>Danh mục sản phẩm</span>
                    </div>
                    <ListGroup variant="flush">
                      <ListGroup.Item
                        onClick={() => {
                          // Xử lý khi người dùng chọn "Tất cả sản phẩm"
                          dispatch({
                            type: "SET_SELECTED_CATEGORY",
                            selectedCategory: null, // Đặt selectedCategory thành null để hiển thị tất cả sản phẩm
                          });
                        }}
                      >
                        Tất cả sản phẩm
                      </ListGroup.Item>
                      {Array.isArray(categoryItem) &&
                        categoryItem.map((item) => (
                          <ListGroup.Item
                            key={item.id}
                            onClick={() => {
                              // Xử lý khi người dùng chọn một danh mục khác
                              dispatch({
                                type: "SET_SELECTED_CATEGORY",
                                selectedCategory: item,
                              });
                            }}
                            className={
                              item === selectedCategory ? "active" : ""
                            }
                          >
                            {item.type_category_item}
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </div>
                  <div className="col-lg-9 col-md-7">
                    {/* Hiển thị danh sách sản phẩm */}
                  </div>
                  {/* <ul>
                    {listFilter
                      .filter((product) => { // Lọc sản phẩm
                        const productPrice = parseFloat(product.price); // Chuyển đổi kiểu sang float
                        return (!selectedCategory || product.categoryItem_product.id === selectedCategory.id) // Điều kiện sản phẩm thuộc danh mục sản phẩm khi nhấp vào
                          && productPrice >= valueMin && productPrice <= valueMax; // điều kiện lọc sản phẩm theo khoảng giá
                      })
                      .map((product) => ( // duyệt sản phẩm 
                        <li key={product.id}>
                          <Link to={`/product/${product.id}`}>
                            {product.product_name} - {product.price}
                            {product.image_product.map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`Image ${index}`}
                                style={{ width: '150px' }}
                              />
                            ))}

                          </Link>
                        </li>
                      ))}
                    {listFilter.length === 0 && (
                      <li>Không có sản phẩm</li>
                    )}
                  </ul> */}
                  <div className="sidebar__item mt-4">
                    <h5>Giá</h5>
                    <div className="price-range-wrap pb-4">
                      <Box sx={{ width: 300 }}>
                        <Slider
                          getAriaLabel={() => "Temperature range"}
                          value={value1}
                          onChange={handleChange1}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          min={0}
                          max={1000000}
                        />
                        <Typography variant="body2">
                          <span style={{ color: "#FF0000" }}>Value:</span>
                          {value1[0]} - {value1[1]}
                        </Typography>
                      </Box>
                    </div>
                    <div className="sidebar__item sidebar__item__color--option">
                      <h5>Sắp xếp giá</h5>
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
                    </div>

                    <div className="sidebar__item sidebar__item__color--option">
                      <h5>Đánh giá</h5>
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
                    </div>
                  </div>
                  <div className="sidebar__item mt-4">
                    <div className="latest-product__text">
                      <h4>Sản phẩm mới nhất</h4>
                      <div className="latest-product__slider owl-carousel">
                        <div className="latest-prdouct__slider__item">
                          <a href="#" className="latest-product__item">
                            <div className="latest-product__item__pic">
                              <img
                                src="/images/best-saler-4.jpg"
                                alt=""
                                style={{ width: "150px" }}
                              />
                            </div>
                            <div className="latest-product__item__text">
                              <h6>Crab Pool Security</h6>
                              <span>$30.00</span>
                            </div>
                          </a>
                        </div>
                        <div className="latest-prdouct__slider__item">
                          <a href="#" className="latest-product__item">
                            <div className="latest-product__item__pic">
                              <img
                                src="/images/best-saler-4.jpg"
                                alt=""
                                style={{ width: "150px" }}
                              />
                            </div>
                            <div className="latest-product__item__text">
                              <h6>Crab Pool Security</h6>
                              <span>$30.00</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-7">
                <div className="product__discount">
                  <div>
                    <div className=" ">
                      <div className="all-items">
                        <div className="container bg-white">
                          <nav className="navbar navbar-expand-md navbar-light bg-white">
                            <div className="container-fluid p-0">
                              <a
                                className="navbar-brand text-uppercase fw-800"
                                href="/#"
                              >
                                <span className="border-red pe-2">
                                  DANH SÁCH SẢN PHẨM
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

                          <div className="row">
                            {sortedProducts.map((product, index) =>
                              product.price >= valueMin &&
                              product.price <= valueMax ? (
                                <div
                                  key={index}
                                  className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3"
                                >
                                  <div className="product">
                                    {product.image_product.map(
                                      (image, index) => (
                                        <img
                                          key={index}
                                          src={
                                            `${API_BASE_URL}/api/uploadImageProduct/` +
                                            image.url
                                          }
                                          alt={`Product Image ${index + 1}`}
                                        />
                                      )
                                    )}
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
                                    <Link to={`/product/${product.id}`}>
                                      {product.product_name}
                                    </Link>
                                  </div>
                                  <div className="d-flex align-content-center justify-content-center">
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                    <span className="fas fa-star"></span>
                                  </div>
                                  <div className="price">{product.price}</div>
                                  {/* <button
                                    onClick={() =>
                                      handleLikeProduct(product.id)
                                    }
                                  >
                                    Thích
                                  </button> */}
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product__pagination">
                  <a href="#">1</a>
                  <a href="#">2</a>
                  <a href="#">3</a>
                  <a href="#">
                    <i className="fa fa-long-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div id="footer">
          <Footer />
        </div>
      </div>
    </>
  );
}
export default Product;
