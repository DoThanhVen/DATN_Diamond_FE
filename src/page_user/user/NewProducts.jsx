import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/product/top10`)
      .then((response) => {
        setTop10Products(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top 10 products:", error);
      });
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div>
      <Slider {...settings}>
        {top10Products && top10Products.map((product, index) => (
          <div
            key={index}
            className="d-flex flex-column align-items-center justify-content-around product-item my-3 px-2"
          >
            <div className="product">
              {typeof product[5] === "string"
                ? JSON.parse(product[5]).map((image, subIndex) => (
                    <img
                      key={subIndex}
                      src={`${API_BASE_URL}/api/uploadImageProduct/${image.url}`}
                      alt={`Image ${subIndex}`}
                    />
                  ))
                : null}
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
            <div className="tag bg-green mt-2">new</div>
            <Link to={`/product/${product[0]}`}>
              <div className="title pt-4 pb-1">{product[2]}</div>
            </Link>
            <div className="d-flex align-content-center justify-content-center">
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
              <span className="fas fa-star"></span>
            </div>
            <div className="price">{product[3]}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default NewProducts;
