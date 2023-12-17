import React, { useState, useEffect } from "react";
import {  Link, useParams } from "react-router-dom";
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
import { callAPI } from "../../service/API";

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}


function Product() {
  const { CategoryId } = useParams();
  const [listCategoryItem, setListCategoryItem] = useState([])
  const [CategoryFind, setCategoryFind] = useState(0);
  const [RateFind, setRateFind] = useState(0);
  const [sort, setsort] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listProduct, setListproduct] = useState([]);
  const numberPage = 10;
  useEffect(() => {
    getCategory();
  }, [RateFind, currentPage, priceRange, CategoryFind, sort])

  const getCategory = async () => {
    const res = await callAPI(`/api/category/${CategoryId}`, 'GET');
    getProduct(currentPage)
    setListCategoryItem(res.listCategory)
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getProduct = async (page) => {
    const res = await callAPI(`/api/product/user/findAll?offset=${page - 1}&sizePage=${numberPage}&sort=${sort}&price=${priceRange}&category=${CategoryFind}&cate=${CategoryId}&rate=${RateFind}`, 'GET');

    if (res.data !== null) {
      setListproduct(res.data.content)
      setTotalPages(res.data.totalPages || 1)
    }
  }

  const [totalBuys, setTotalBuys] = useState({});

  const getToltalBuy = async (idproduct) => {
    try {
      const resToltal = await callAPI(`/api/ratings/getTotalBuy/${idproduct}`, 'GET');
      return resToltal;
    } catch (error) {
      console.error("Error fetching totalBuy:", error);
      return 0; // Trả về mặc định hoặc giá trị bạn muốn khi xảy ra lỗi
    }
  };
  useEffect(() => {
    async function fetchData() {
      const totalBuys = {};
      for (const product of listProduct) {
        const totalBuy = await getToltalBuy(product.id);
        totalBuys[product.id] = totalBuy;
      }
      setTotalBuys(totalBuys);
    }
    fetchData();
  }, [listProduct]);

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
                    onClick={() => { setCategoryFind(0); setRateFind(0); setPriceRange([0, 100000000]) }}
                  >
                    Tất cả sản phẩm
                  </ListGroup.Item>
                  {listCategoryItem.map((item) => (
                    <ListGroup.Item
                      key={item.id}
                      onClick={() => {
                        setCategoryFind(item.id);
                        setSelectedCategory(true)
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
                      value={priceRange} // Sử dụng giá trị từ state để hiển thị khoảng giá
                      onChange={handlePriceChange} // Xử lý khi Slider thay đổi giá trị
                      valueLabelDisplay="auto"
                      min={0}
                      max={100000000}
                    />
                    <Typography variant="body2">
                      <span style={{ color: "#FF0000" }}>Giá:</span>{" "}
                      {priceRange[0].toLocaleString("vi-VN")} -{" "}
                      {priceRange[1].toLocaleString("vi-VN")} vnđ
                    </Typography>
                  </Box>
                </div>
                <div className="sidebar__item sidebar__item__color--option">
                  <h5>Sắp xếp giá</h5>
                  <RadioGroup
                    aria-label="priceSorting"
                    name="priceSorting"
                    value={sort}
                    onChange={(e) => { setsort(e.target.value) }}
                  >
                    <FormControlLabel
                      value="asc"
                      control={<Radio />}
                      label="Sắp xếp theo tăng dần"
                    />
                    <FormControlLabel
                      value="desc"
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
                    value={RateFind}
                    onChange={(e) => { setRateFind(e.target.value) }}
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
              <div className={style.list_product} >
                {listProduct.length < 1 ? (
                  <p>Không có sản phẩm</p>
                ) : (
                  listProduct.map((value, index) =>
                    <LazyLoad
                      once={true}
                      key={index}
                      className={style.item_product}
                    >
                      <Link to={`/product/${value.id}`}>
                        <img
                          src={value.image_product[0].url}
                          alt=""
                          className={style.image}
                        />
                        <div className={style.name}>{value.product_name}</div>
                        <div className={style.info}>
                          <label className={style.price}>
                            {formatCurrency(value.price, 0)}
                          </label>
                          <label className={style.amount_sell}>
                            Đã bán {totalBuys[value.id]}
                          </label>
                        </div>
                        <div className={style.show_detail}>Xem chi tiết</div>
                      </Link>
                    </LazyLoad>
                  )
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
