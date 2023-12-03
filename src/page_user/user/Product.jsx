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
import style from "../css/user/product.module.css";
import LazyLoad from "react-lazy-load";
import { Pagination } from "@mui/material";

const API_BASE_URL = "http://localhost:8080";

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}
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
        valueMax: action.valueMax
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
    ratingFilter: "5"
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
    ratingFilter
  } = localState;
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const numberPage = 12;
  // Bắt sự kiện khi giá trị của Slider thay đổi
  const handleChange1 = (event, newValue) => {
    dispatch({
      type: "SET_VALUE",
      value1: newValue,
      valueMin: newValue[0],
      valueMax: newValue[1]
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
          categoryItem: response.data.listCategory
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // Lấy danh sách sản phẩm từ server khi component được render
  useEffect(() => {
    getListProduct(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Hàm để lấy danh sách sản phẩm từ server
  const getListProduct = (page) => {
    axios
      .get(
        `${API_BASE_URL}/api/product/getAll?key=&keyword=&offset=${
          page - 1
        }&sizePage=${numberPage}&sort=&sortType=&status=1`
      )
      .then((response) => {
        console.log(response.data.data.content);
        // Cập nhật danh sách sản phẩm
        dispatch({ type: "SET_PRODUCTS", products: response.data.data.content });
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
    sortedProducts
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
          className="breadcrumb-section"
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
                  <h2>FE Ads</h2>
                  <p className={`text-light`}>
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
              className="sidebar mt-4 bg-white p-2"
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
                        selectedCategory: null // Đặt selectedCategory thành null để hiển thị tất cả sản phẩm
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
                            selectedCategory: item
                          });
                        }}
                        className={item === selectedCategory ? "active" : ""}
                      >
                        {item.type_category_item}
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </div>
              <div className="sidebar__item mt-4">
                <div className="price-range-wrap d-flex justify-content-center pb-4">
                  <Box sx={{ width: 250 }}>
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
                      <span style={{ color: "#FF0000" }}>Giá:</span> {value1[0]}{" "}
                      - {value1[1]}
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

                <div className="sidebar__item m-0 sidebar__item__color--option">
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
            </div>
          </div>
          <div className={style.content}>
            <div className={style.listProduct}>
              <label className={style.heading}>DANH SÁCH SẢN PHẨM</label>
              <div className={style.list_product}>
                {sortedProducts.map((value, index) =>
                  value.price >= valueMin &&
                  value.price <= valueMax &&
                  value.status === 1 ? (
                    <LazyLoad
                      once={true}
                      key={index}
                      className={style.item_product}
                    >
                      <Link to={`/product/${value.id}`}>
                        <img
                          key={value.id}
                          src={`${API_BASE_URL}/api/uploadImageProduct/${
                            value.image_product[value.image_product.length - 1]
                              .url
                          }`}
                          alt={`Image ${
                            value.image_product[value.image_product.length - 1]
                              .url
                          }`}
                          className={style.image}
                        />
                        <div className={style.name}>{value.product_name}</div>
                        <div className={style.info}>
                          <label className={style.price}>
                            {formatCurrency(value.price, 0)}
                          </label>
                          <label className={style.amount_sell}>
                            Đã bán 999
                          </label>
                        </div>
                        <div className={style.show_detail}>Xem chi tiết</div>
                      </Link>
                    </LazyLoad>
                  ) : null
                )}
              </div>
            </div>
            <div
              className={style.paginationContainer}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px"
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                boundaryCount={2}
                variant="outlined"
                shape="rounded"
                size="large"
                showFirstButton
                showLastButton
              />
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
export default Product;
