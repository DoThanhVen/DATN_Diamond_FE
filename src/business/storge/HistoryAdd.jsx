import React, { useEffect, useState } from "react";
import style from "../../css/business/storge.module.css";
import moment from "moment";
import { useSelector } from "react-redux";
import { callAPI } from "../../service/API";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router";
<<<<<<< HEAD
import getAccountFromCookie from "../../service/getAccountLogin";

function HistoryAdd() {

  const navigate = useNavigate();
=======
import Cookies from "js-cookie";
import { GetDataLogin } from "../../service/DataLogin";

function HistoryAdd() {
  const navigate = useNavigate();
  const getAccountFromCookie = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== undefined) {
      try {
        getdataProducts(currentPage, accountLogin.shop.id);

      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

>>>>>>> origin/main
  const [listProducts, setListProducts] = useState([]);
  const reload = useSelector((state) => state.getreloadPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const numberPage = 3;

  useEffect(() => {
    getData();
  }, [reload, currentPage]);


  const getData = async () => {
    try {
      const accountData = await getAccountFromCookie();
      if (accountData) {
        getdataProducts(currentPage, accountData.shop.id);
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getdataProducts = async (page, idShop) => {
    try {
      const response = await callAPI(
        `/api/product/getByShop?shop=${idShop}&offset=${(page - 1) * numberPage
        }&sizePage=${numberPage}`,
        "GET"
      );
      const allProducts = response.content?.flatMap((product) => {
        return product.listStorage.map((storageItem) => ({
          ...product,
          storageItem
        }));
      });

      const sortedProducts = allProducts.sort((a, b) => {
        const dateA = moment(a.storageItem.create_date);
        const dateB = moment(b.storageItem.create_date);
        return dateB - dateA;
      });
      setListProducts(sortedProducts);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <div className={`${style.listProduct}`}>
      <div className={style.table}>
        <div className={style.tableHeading}>
          <label className={style.column}>STT</label>
          <label className={style.column}>Mã SP</label>
          <label className={style.column}>Hình ảnh</label>
          <label className={style.column}>Tên SP</label>
          <label className={style.column}>Loại SP</label>
          <label className={style.column}>Số lượng</label>
          <label className={style.column}>Ngày thực hiện</label>
        </div>
        {listProducts.map((product, index) => (
          <div key={product.id} className={style.tableBody}>
            <>
              <label className={style.column}>{index + 1}</label>
              <label className={style.column}>{product.id}</label>
              <label className={style.column}>
                {product?.image_product.length > 0 ? (
                  product?.image_product.map((image) => (
                    <img
                      key={image.id}
                      className={style.image}
                      src={`http://localhost:8080/api/uploadImageProduct/${image.url}`}
                      alt="Hình Ảnh"
                    />
                  ))
                ) : (
                  <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  />
                )}
              </label>
              <label className={style.column}>{product.product_name}</label>
              <label className={style.column}>
                {product.categoryItem_product.type_category_item}
              </label>
            </>
            <label className={style.column}>
              {product.storageItem.quantity || ""}
            </label>
            <label className={style.column}>
              {formatDate(product.storageItem.create_date) || ""}
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
  );
}

export default HistoryAdd;
