import moment from "moment";
import React, { useEffect, useState } from "react";
import style from "../css/admin/home.module.css";
import { callAPI } from "../service/API";

function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getdata(1);
  }, []);

  const getdata = async (page) => {
    try {
      const response = await callAPI(
        `/api/product/getAll?key=&keyword=&offset=${
          page - 1
        }&sizePage=10&sort=&sortType=&status=`,
        "GET"
      );
      setProducts(response.data.content || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <React.Fragment>
      <div className={style.card_info}>
        <div className={style.card}>
          <label className={style.icon}>
            {" "}
            <i className={`bi bi-bag`}></i>
          </label>
          <label className={style.label}>Số lượng sản phẩm</label>
          <label className={style.amount}>100</label>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-shop`}></i>
          </label>
          <label className={style.label}>Số lượng gian hàng</label>
          <label className={style.amount}>100</label>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-person-circle`}></i>
          </label>
          <label className={style.label}>Số lượng tài khoản</label>
          <label className={style.amount}>100</label>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-receipt-cutoff`}></i>
          </label>
          <label className={style.label}>Số lượng đơn hàng</label>
          <label className={style.amount}>100</label>
        </div>
      </div>
      <div className={style.listProduct}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>TOP 10 SẢN PHẨM BÁN CHẠY</label>
          </div>
        </div>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>Mã SP</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên SP</label>
            <label className={style.column}>Loại SP</label>
            <label className={style.column}>Giá SP</label>
            <label className={style.column}>Ngày tạo</label>
          </div>
          {products.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {value.image_product != null ? (
                  <img
                    key={value.image_product[0].id}
                    className={style.image}
                    src={`http://localhost:8080/api/uploadImageProduct/${value.image_product[0].url}`}
                    alt="Hình Ảnh"
                  />
                ) : (
                  <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  />
                )}
              </label>
              <label className={style.column}>{value.product_name}</label>
              <label className={style.column}>
                {value.categoryItem_product?.type_category_item}
              </label>
              <label className={style.column}>
                {formatCurrency(value.price, 0)}
              </label>
              <label className={style.column}>
                {formatDate(value.create_date)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
