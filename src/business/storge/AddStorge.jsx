import React, { useEffect, useRef, useState } from "react";
import style from "../../css/business/storge.module.css";
import { callAPI } from "../../service/API";
import ProductService from "../../service/ProductService";
import { ThongBao } from "../../service/ThongBao";
import { useDispatch, useSelector } from "react-redux";
import { reloadPage } from "../../service/Actions";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function AddStorge() {
  const navigate = useNavigate();
  const getAccountFromCookie = () => {
    const accountCookie = Cookies.get("accountLogin");
    if (accountCookie !== undefined) {
      try {
        const data = JSON.parse(
          decodeURIComponent(escape(window.atob(Cookies.get("accountLogin"))))
        );
        getdataProduct(data.shop.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const dispatch = useDispatch();
  const [listProduct, setdataproduct] = useState([]);
  const [valueProduct, setValueProduct] = React.useState("");
  const [quantity, setquantity] = useState("");
  const reloadold = useSelector((state) => state.getreloadPage);
  //DANH SÁCH SẢN PHẨM

  useEffect(() => {
    getAccountFromCookie();
  }, []);

  const getdataProduct = async (idShop) => {
    try {
      const response = await callAPI(
        `/api/product/getByShop?shop=${idShop}`,
        "GET"
      );
      setdataproduct(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeProduct = async (event) => {
    const selectedOptionValue = event.target.value;
    setValueProduct(selectedOptionValue);
  };

  const handelAdd = async () => {
    if (valueProduct === "") {
      ThongBao("Vui lòng chọn sản phẩm.", "error");
    } else if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
      ThongBao("Số lượng phải là số nguyên lớn hơn 0.", "error");
    } else {
      const product2 = await ProductService.getProductbyId(valueProduct);
      if (product2 !== null) {
        const response = await callAPI(
          `/api/product/createStorage/${product2.id}`,
          "POST",
          {
            quantity: parseInt(quantity),
            create_date: new Date()
          }
        );
        if (response.status === "success") {
          ThongBao(response.message, response.status);
          dispatch(reloadPage(reloadold + 1));
        }
      }
    }
  };

  return (
    <React.Fragment>
      <div className={style.header}>
        <div className={style.formSearch}>
          <i className={`bi bi-search ${style.icon}`} />
          <input
            className={style.input}
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>
        <i className={`bi bi-person-circle ${style.iconUser}`} />
      </div>
      <div id={`${style.addProduct}`}>
        <div className={`${style.heading}`}>
          <label>Cập nhật số lượng sản phẩm</label>
        </div>
        <div className={`${style.product}`}>
          <label className={style.label}>Sản phẩm</label>
          <select
            value={valueProduct}
            onChange={handleChangeProduct}
            className={`${style.optionSelect} ${style.input}`}
          >
            <option value="">Sản Phẩm...</option>
            {listProduct?.content?.map((value, index) => (
              <option key={value.id} value={value.id}>
                {value.product_name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${style.quantity}`}>
          <label className={style.label}>Số lượng</label>
          <input
            type="number"
            className={style.input}
            onChange={(e) => {
              setquantity(e.target.value);
            }}
          />
        </div>
        <div className={style.formButton}>
          <button className={style.button} onClick={handelAdd}>
            <i className="bi bi-plus-lg"></i> THÊM
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}