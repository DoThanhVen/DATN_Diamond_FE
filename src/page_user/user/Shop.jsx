import React, { useState, useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/product.css";
import "../css/user/home.css";
import "../css/user/slider.css";
import "../css/user/shop.css";
import style from "../css/user/product.module.css";
import listDataAddress from "../../service/AddressVietNam.json"

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  colors
} from "@mui/material";
import LazyLoad from "react-lazy-load";

const API_BASE_URL = "http://localhost:8080";

function valuetext(value) {
  return `${value}°C`;
}

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

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
    case "SET_SHOP":
      return { ...state, shop: action.shop.data };
    default:
      return state;
  }
}

function Shop() {
  const navigate = useNavigate();
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
    shop: null
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
    shop
  } = localState;

  const handleChange1 = (event, newValue) => {
    dispatch({
      type: "SET_VALUE",
      value1: newValue,
      valueMin: newValue[0],
      valueMax: newValue[1]
    });
  };

  const handleDateSortingChange = (e) => {
    dispatch({ type: "SET_DATE_SORTING", dateSorting: e.target.value });
  };

  const handlePriceSortingChange = (e) => {
    dispatch({ type: "SET_PRICE_SORTING", priceSorting: e.target.value });
  };

  const handleRatingFilterChange = (e) => {
    dispatch({ type: "SET_RATING_FILTER", ratingFilter: e.target.value });
  };

  const [data, setData] = useState([]);

  const { productId } = useParams();

  useEffect(() => {
    if (!productId) {
      console.error("productId is undefined or falsy");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/product/${productId}/shop`)
      .then((response) => {
        dispatch({ type: "SET_SHOP", shop: response.data });
        console.log("Shop Data:", response.data.data[2]);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, [productId]);

  const shopData = localState.shop;

  useEffect(() => {
    const filteredProducts =
      shopData && shopData[3] ? Object.values(shopData[3]) : [];

    // Filter products based on the price range
    const filteredByPrice = filteredProducts.filter((product) => {
      const price = product[2]; // Adjust this according to your API structure
      return price >= localState.valueMin && price <= localState.valueMax;
    });

    // Sort the products based on the selected sorting option
    const sortedProducts = [...filteredByPrice];
    if (localState.priceSorting === "ascending") {
      sortedProducts.sort((a, b) => a[2] - b[2]);
    } else if (localState.priceSorting === "descending") {
      sortedProducts.sort((a, b) => b[2] - a[2]);
    }

    // Update the state with the filtered and sorted products
    dispatch({ type: "SET_PRODUCTS", products: sortedProducts });
  }, [
    shopData,
    localState.priceSorting,
    localState.valueMin,
    localState.valueMax
  ]);

  console.log(products);

  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      {shopData && (
        <div className="">
          <div className="profile-env container">
            <header className="row">
              <div className="col-sm-2">
                <a href="#" className="profile-picture">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    className="img-responsive img-circle"
                  />{" "}
                </a>
              </div>
              <div className="col-sm-7 d-flex align-items-center">
                <ul className="profile-info-sections">
                  <li>
                    <div className="profile-name">
                      <strong>
                        {shopData[1]}
                        <a
                          href="#"
                          className="user-status is-online tooltip-primary"
                          data-toggle="tooltip"
                          data-placement="top"
                          data-original-title="Online"
                        ></a>
                      </strong>
                      <span>
                      {listDataAddress.map((valueCity, index) =>
                          shopData[2] && valueCity.codename === shopData[2].city
                            ? valueCity.name
                            : null
                        )}
                      </span>
                    </div>
                  </li>
                  <li>
                    <i
                      className="bi bi-chat-dots"
                      style={{
                        fontSize: "25px",
                        color: "red",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        navigate(`/chatApp?ShopName=${shopData[1]}`);
                      }}
                    ></i>
                  </li>
                </ul>
              </div>
              <div className="col-sm-3"></div>
            </header>
            <hr />
          </div>
        </div>
      )}
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
                    <span style={{ color: "#FF0000" }}>Giá:</span> {value1[0]} -{" "}
                    {value1[1]}
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
              {products.map((value, index) => (
                <LazyLoad
                  once={true}
                  key={value[0]}
                  className={style.item_product}
                >
                  <Link to={`/product/${value[0]}`}>
                    <img
                      key={value.id}
                      src={`${API_BASE_URL}/api/uploadImageProduct/${value[5][0].url}`}
                      alt={`Image ${value[5][0].url}`}
                      className={style.image}
                    />
                    <div className={style.name}>{value[1]}</div>
                    <div className={style.info}>
                      <label className={style.price}>
                        {formatCurrency(value[2], 0)}
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
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default Shop;
