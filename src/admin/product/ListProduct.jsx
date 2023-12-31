import React, { useEffect, useState } from "react";
import style from "../../css/admin/product/listproduct.module.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { callAPI } from "../../service/API";
import { Pagination } from "@mui/material";
import moment from "moment";
import ModelDetail from "./ModelDetail";
import { getIdProductAdmin } from "../../service/Actions";

function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function ListProduct() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.idAccountAdmin);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const numberPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setkeyword] = useState("");
  const [keyfind, setkeyfind] = useState("");
  const [reload, setreload] = useState(0);
  const [sortBy, setsortBy] = useState("");
  const [sortType, setsortType] = useState("");

  useEffect(() => {
    getdata(currentPage);
  }, [data, currentPage, reload, sortType]);

  const getdata = async (page) => {
    try {
      const response = await callAPI(
        `/api/product/getAll?key=${keyfind}&keyword=${keyword}&offset=${
          page - 1
        }&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}`,
        "GET"
      );
      const responseData = response.data;
      setProducts(responseData || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      const res = await callAPI(
        `/api/product/adminupdatestatus/${id}`,
        "PUT",
        formData
      );
      setreload(reload + 1);
    } catch (error) {
      console.log(error);
    }
  };

  function formatCurrency(price, promotion) {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0
    });
    return formatter.format(price - price * (promotion / 100));
  }

  return (
    <React.Fragment>
      <div className={style.listProduct}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>Danh sách sản phẩm</label>
            <div className={`${style.formSearch}`}>
              <select
                value={keyfind}
                onChange={(e) => {
                  setkeyfind(e.target.value);
                }}
                className={`${style.optionSelect}`}
              >
                <option value="id">Mã sản phẩm</option>
                <option value="name">Tên sản phẩm</option>
                <option value="shop">Tên cửa hàng</option>
              </select>
              <input
                className={`${style.inputSearch}`}
                type="text"
                onChange={(e) => {
                  setkeyword(e.target.value);
                }}
              />
              <button
                className={`${style.buttonSearch}`}
                onClick={() => {
                  setreload(reload + 1);
                }}
              >
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className={`${style.sortProduct}`}>
          <label>Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setsortBy(e.target.value);
            }}
            className={`ms-2 ${style.optionSelect}`}
          >
            <option value="">Lựa chọn...</option>
            <option value={"id"}>Mã sản phẩm</option>
            <option value={"product_name"}>Tên sản phẩm</option>
            <option value={"price"}>Giá</option>
            <option value={"create_date"}>Ngày tạo</option>
          </select>
          {sortBy !== "" ? (
            <select
              value={sortType}
              onChange={(e) => {
                setsortType(e.target.value);
              }}
              className={`${style.optionSelect}`}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          ) : null}
        </div>

        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>Mã SP</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên SP</label>
            <label className={style.column}>Loại SP</label>
            <label className={style.column}>Giá SP</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column} />
            <label className={style.column} />
          </div>
          {products?.content?.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {value.image_product ? (
                  value.image_product?.map((item, index) => (
                    <img
                      key={index}
                      className={style.image}
                      src={`http://localhost:8080/api/uploadImageProduct/${item.url}`}
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
              <label className={style.column}>
                <i
                  className={`
    ${style.status}
    ${
      value.status === 0
        ? `bi bi-exclamation-lg ${style.approval}`
        : value.status === 1
        ? `bi bi-check-lg ${style.active}`
        : value.status === 2
        ? `bi bi-x-lg ${style.ban}`
        : `bx bxs-error-alt`
    }
  `}
                ></i>
              </label>
              <label className={style.column}>
                <label
                  onClick={() => {
                    handleUpdateStatus(value.id, value.status);
                  }}
                  className={`btn ${style.updateStatus}`}
                  style={{
                    backgroundColor:
                      value.status === 0
                        ? "blue"
                        : value.status === 1
                        ? "red"
                        : value.status === 2
                        ? "green"
                        : "#E74C3C"
                  }}
                  value={`${value.status}`}
                >
                  {value.status === 0
                    ? "ACCEPT"
                    : value.status === 1
                    ? "BAN"
                    : value.status === 2
                    ? "ACTIVITY"
                    : "Lỗi"}
                </label>
              </label>
              <label className={style.column}>
                <i
                  className={`bi bi-eye ${style.show}`}
                  onClick={() => {
                    dispatch(getIdProductAdmin(value.id));
                    openModal();
                  }}
                ></i>
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
      {showModal && <ModelDetail status={showModal} toggleShow={closeModal} />}
    </React.Fragment>
  );
}

export default ListProduct;
