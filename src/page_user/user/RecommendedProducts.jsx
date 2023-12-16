import React, { useEffect, useState } from "react";
import "../css/user/suggestedProducts.css";
import { callAPI } from "../../service/API";
import style from "../css/user/home.module.css";
import { Link } from "react-router-dom";
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

const RecommendedProducts = () => {
  const numberPage = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getdataProduct(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getdataProduct = async (page) => {
    try {
      const response = await callAPI(
        `/api/product/getAll?key=&keyword=&offset=${
          page - 1
        }&sizePage=${numberPage}&sort=&sortType=&status=1`,
        "GET"
      );
      const filteredProducts = response.data.content.filter(
        (product) => product.status === 1
      );
      setProducts(filteredProducts);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <React.Fragment>
      <div className={style.list_all_recommended}>
        {products
          ? products.map((value, index) => (
              <LazyLoad
                once={true}
                key={index}
                className={style.item_recommended}
              >
                <Link to={`/product/${value.id}`}>
                  {value.image_product && (
                    <div>
                      <img
                        src={`${value.image_product[0].url}`}
                        className={style.image}
                        alt={`Image ${value.image_product[0].url}`}
                      />
                    </div>
                  )}

                  <div className={style.name}>{value.product_name}</div>
                  <div className={style.info}>
                    <label className={style.price}>
                      {formatCurrency(value.price, 0)}
                    </label>
                    <label className={style.amount_sell}>Đã bán 999</label>
                  </div>
                  <div className={style.show_detail}>Xem chi tiết</div>
                </Link>
              </LazyLoad>
            ))
          : null}
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
    </React.Fragment>
  );
};

export default RecommendedProducts;
