import React, { useState, useEffect } from "react";
import "../css/user/suggestedProducts.css";
import axios from "axios";
import { Link } from "react-router-dom";
import style from "../css/user/home.module.css";
const API_BASE_URL = "http://localhost:8080";

const SidebarM = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API
    axios
      .get(`${API_BASE_URL}/api/category`)
      .then((response) => {
        setCategories(response.data.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className={style.sidebar}>
        <div className={style.list_menu}>
          <span className={style.header}>
            <i className="me-2 fa fa-bars"></i> DANH MỤC
          </span>
          <div className={style.content}>
            {categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                key={category.id}
                className={style.item}
              >
                <img
                  key={category.id}
                  src={`${API_BASE_URL}/api/uploadImageProduct/${category.image}`}
                  alt="Hình Ảnh"
                  className={`${style.image} me-2`}
                ></img>
                <label className={style.value}>{category.type_category}</label>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarM;
