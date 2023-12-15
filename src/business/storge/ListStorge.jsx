import React, { useEffect, useRef, useState } from "react";
import style from "../../css/business/storge.module.css";
import { useSelector } from "react-redux";
import { Pagination } from "@mui/material";
import { callAPI } from "../../service/API";
import getAccountFromCookie from "../../service/getAccountLogin";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { GetDataLogin } from "../../service/DataLogin";
import LoadingOverlay from "../../service/loadingOverlay";
function ListStorge() {
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== null) {
      try {
        getdataProduct(currentPage, accountLogin.shop.id);
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
  const navigate = new useNavigate();
  const [valueOption, setValueOption] = useState("");
  const [textInput, setTextInput] = useState("");
  const [reloadinPage, setreload] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getAccountFromSession();
  }, [reload, currentPage, reloadinPage]);

  const getdataProduct = async (page, idShop) => {
    try {
      setIsLoading(true)
      const response = await callAPI(
        `/api/product/getByShop?key=${valueOption}&keyword=${textInput}&shop=${idShop}&offset=${(page - 1)
        }&sizePage=${numberPage}`,
        "GET"
      );
      setIsLoading(false)
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
      <div className={`${style.listProduct} ${style.listAll}`}>
        <div className={`${style.formSearch}`}>
          <select
            value={valueOption}
            onChange={(e) => {
              setValueOption(e.target.value);
            }}
            className={`${style.optionSelect}`}
          >
            <option value="id">Mã Sản Phẩm</option>
            <option value="product_name">Tên Sản Phẩm</option>
          </select>
          <input
            className={`${style.inputSearch}`}
            type="text"
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button className={`${style.buttonSearch}`} onClick={() => setreload(reloadinPage + 1)}>Tìm Kiếm</button>
        </div>
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
              <label className={style.column}>{index + 1 + (currentPage * 10 - numberPage)}</label>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {value?.image_product.length > 0 ? (
                  <div key={value?.image_product[0].id}>
                    <img
                      className={style.image}
                      src={value?.image_product[0].url}
                      alt="Hình Ảnh"
                    ></img>
                  </div>
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
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}

export default ListStorge;
