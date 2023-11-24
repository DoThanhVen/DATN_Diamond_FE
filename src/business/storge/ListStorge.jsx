import React, { useEffect, useRef, useState } from "react";
import style from "../../css/business/storge.module.css";
import { useSelector } from "react-redux";
import { Pagination } from "@mui/material";
import { callAPI } from "../../service/API";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
function ListStorge() {
  const [accountLogin, setAccountLogin] = useState(null);

  const navigate = useNavigate();
  const getAccountFromCookie = () => {
    const accountCookie = Cookies.get("accountLogin");

    if (accountCookie !== undefined) {
      try {
        const data = JSON.parse(
          decodeURIComponent(escape(window.atob(Cookies.get("accountLogin"))))
        );
        setAccountLogin(data);
        getdataProduct(currentPage, data.shop.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const reload = useSelector((state) => state.getreloadPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const numberPage = 10;

  useEffect(() => {
    getAccountFromCookie();
  }, [reload, currentPage]);

  const getdataProduct = async (page, idShop) => {
    try {
      const response = await callAPI(
        `/api/product/getByShop?shop=${idShop}&offset=${
          (page - 1) * numberPage
        }&sizePage=${numberPage}`,
        "GET"
      );
      setProducts(response);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <React.Fragment>
      <div className={`${style.listProduct}`}>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>STT</label>
            <label className={style.column}>Mã SP</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên SP</label>
            <label className={style.column}>Loại SP</label>
            <label className={style.column}>Số lượng</label>
          </div>
          {products?.content?.map((value, index) => (
            <div key={value.id} className={style.tableBody}>
              <label className={style.column}>{index}</label>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {value?.image_product.length > 0 ? (
                  value?.image_product.map((valueImage) => (
                    <div key={valueImage.id}>
                      <img
                        className={style.image}
                        src={`http://localhost:8080/api/uploadImageProduct/${valueImage.url}`}
                        alt="Hình Ảnh"
                      ></img>
                    </div>
                  ))
                ) : (
                  <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  ></img>
                )}
              </label>
              <label className={style.column}>{value.product_name}</label>
              <label className={style.column}>
                {value.categoryItem_product.type_category_item}
              </label>
              <label className={style.column}>
                {value.listStorage?.reduce(
                  (total, storage) => total + storage.quantity,
                  0
                )}
              </label>
            </div>
          ))}
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
    </React.Fragment>
  );
}

export default ListStorge;
