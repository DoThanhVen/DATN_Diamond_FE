import React, { useState, useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from 'react-router';
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/user/product.css";
import "../css/user/home.css";
import "../css/user/slider.css";
import "../css/user/shop.css";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  colors,
} from "@mui/material";

const API_BASE_URL = "http://localhost:8080";

function valuetext(value) {
  return `${value}°C`;
}

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
    case "SET_SHOP":
      return { ...state, shop: action.shop.data };
    default:
      return state;
  }
}

function Shop() {
  const navigate=useNavigate();
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
    shop: null,
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
    shop,
  } = localState;

  const handleChange1 = (event, newValue) => {
    dispatch({
      type: "SET_VALUE",
      value1: newValue,
      valueMin: newValue[0],
      valueMax: newValue[1],
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
    localState.valueMax,
  ]);

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
              <div className="col-sm-7">
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
                        {shopData[2].ward} - {shopData[2].district}
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="profile-stat">
                      <h3>643</h3>
                      <span>
                        <a href="#">followers</a>
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="profile-stat">
                      <h3>108</h3>
                      <span>
                        <a href="#">following</a>
                      </span>
                     
                        <p style={{fontSize:'20px',color:'red'}} onClick={()=>{navigate(`/test?ShopName=${shopData[1]}`)}}>Nhắn tin với người bán</p>
                      
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-sm-3"></div>
            </header>
            <hr />
          </div>
        </div>
      )}

      <div className="product mt-4">
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
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <FormControlLabel
                            key={rating}
                            value={String(rating)}
                            control={<Radio />}
                            label={`${rating} sao`}
                          />
                        ))}
                      </RadioGroup>
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
                            {products.map((product) => (
                              <div
                                key={product[0]}
                                className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3"
                              >
                                <div className="product">
                                  {product[5].map((image, imageIndex) => (
                                    <img
                                      key={image.id}
                                      src={`/images/${image.url}`}
                                      alt={`Image ${imageIndex}`}
                                    />
                                  ))}
                                  <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                    <li className="icon">
                                      <span className="fas fa-expand-arrows-alt"></span>
                                    </li>
                                    <li className="icon mx-3">
                                      <span className="far fa-heart"></span>
                                    </li>
                                    <li className="icon">
                                      <span className="fas fa-shopping-bag"></span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="tag bg-red">sale</div>
                                <div className="title pt-4 pb-1">
                                  <Link to={`/product/${product[0]}`}>
                                    {product[1]}
                                  </Link>
                                </div>
                                <div className="d-flex align-content-center justify-content-center">
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                  <span className="fas fa-star"></span>
                                </div>
                                <div className="price">{product[2]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Shop;
