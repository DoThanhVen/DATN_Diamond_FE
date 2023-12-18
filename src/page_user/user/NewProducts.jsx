import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import style from "../css/user/home.module.css";
import LazyLoad from "react-lazy-load";
import { callAPI } from "../../service/API";

const API_BASE_URL = "http://localhost:8080";

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", color: "black" }}
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

function NewProducts() {
  const [top10Products, setTop10Products] = useState([]);
  const [totalBuys, setTotalBuys] = useState({});
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/product/top10`)
      .then((response) => {
        setTop10Products(response.data);
        response.data.forEach((product) => {
          fetchTotalBuy(product[0]);
        });
      })
      .catch((error) => {
        console.error("Error fetching top 10 products:", error);
      });
  }, []);

  const fetchTotalBuy = async (idProduct) => {
    try {
      if (idProduct) {
        const data = await callAPI(`/api/ratings/getTotalBuy/${idProduct}`, "GET");
        setTotalBuys((prevTotalBuys) => ({
          ...prevTotalBuys,
          [idProduct]: data
        }));
      } else {
        setTotalBuys((prevTotalBuys) => ({
          ...prevTotalBuys,
          [idProduct]: 0
        }));
      }
    } catch (error) {
      console.error("Error fetching total buys:", error);
      setTotalBuys((prevTotalBuys) => ({
        ...prevTotalBuys,
        [idProduct]: 0
      }));
    }
  };



  return (
    <div className={style.list_item_new}>
      {top10Products &&
        top10Products.map((product, index) => (
          <LazyLoad once={true} key={index} className={style.item_new_product}>
            <Link to={`/product/${product[0]}`}>
              {typeof product[5] === "string"
                ? (() => {
                  try {
                    const images = JSON.parse(product[5]);
                    const lastImage = images[0];

                    return (
                      <img
                        key={lastImage.id}
                        src={`${lastImage.url}`}
                        alt={`Image`}
                        className={style.image}
                      />
                    );
                  } catch (error) {
                    return <img
                      src={`/images/nullimage.png`}
                      alt={`Image`}
                      className={style.image}
                    />;
                  }
                })()
                : null}

              <div className={style.status}>new</div>
              <div className={style.name}>{product[2]}</div>
              <div className={style.info}>
                <label className={style.price}>
                  {formatCurrency(product[3], 0)}
                </label>
                <label className={style.amount_sell}>Đã bán {totalBuys[product[0]] || 0}</label>
              </div>
              <div className={style.show_detail}>Xem chi tiết</div>
            </Link>
          </LazyLoad>
        ))}
    </div>
  );
}

export default NewProducts;
