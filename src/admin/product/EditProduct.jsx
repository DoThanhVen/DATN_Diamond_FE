import React, { useEffect, useState } from "react";
import style from "../../css/admin/product/listproduct.module.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { callAPI } from "../../service/API";
import { Pagination } from "@mui/material";


import moment from 'moment';
import ModelDetail from "./ModelDetail.jsx";
import { getIdProductAdmin } from "../../service/Actions";
function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}
function ListProduct() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.idAccountAdmin);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const numberPage = 10
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setkeyword] = useState('');
  const [keyfind, setkeyfind] = useState('');
  const [reload, setreload] = useState(0)
  const [sortBy,setsortBy]=useState('')
  const [sortType,setsortType]=useState('')

  useEffect(() => {
    getdata(currentPage);
  }, [data, currentPage, reload,sortType]);

  const getdata = async (page) => {
    try {
      const response = await callAPI(`/api/product/getAll?key=${keyfind}&keyword=${keyword}&offset=${(page - 1) * numberPage}&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}`, "GET");
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
      formData.append('status', status);
      const res = await callAPI(`/api/product/adminupdatestatus/${id}`, 'PUT', formData)
      setreload(reload + 1)
    } catch (error) {
      console.log(error)
    }
  }
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
                  setkeyfind(e.target.value)
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
                  setkeyword(e.target.value)
                }}
              />
              <button className={`${style.buttonSearch}`} onClick={() => { setreload(reload + 1) }}>Tìm Kiếm</button>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className={`${style.typeProduct}`}>
          <label>Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e)=>{
              setsortBy(e.target.value)
            }}
            className={`${style.optionSelectType}`}
          >
            <option value="">Lựa chọn...</option>
                <option value={'id'}>
                    Mã sản phẩm
                </option>
                <option value={'product_name'}>
                    Tên sản phẩm
                </option>
                <option value={'price'}>
                    Giá
                </option>
                <option value={'create_date'}>
                    Ngày tạo
                </option>
          </select>
          {sortBy !== ''
            ? <select
              value={sortType}
              onChange={(e)=>{
                setsortType(e.target.value)
              }}
              className={`${style.optionSelectType}`}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
            : null}
        </div>

        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>STT</label>
            <label className={style.column}>Mã sản phẩm</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên sản phẩm</label>
            <label className={style.column}>Danh mục</label>
            <label className={style.column}>Giá SP</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column} />
            <label className={style.column} />
          </div>
          {products?.content?.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>
                {index}
              </label>
              <label className={style.column}>
                {value.id}
              </label>
              <label className={style.column}>
                {value.image_product == null ? value.image_product?.map((item, index) =>
                  <img
                    key={index}
                    className={style.image}
                    src={`http://localhost:8080/api/uploadImageProduct/${item}`}
                    alt="Hình Ảnh"
                  />
                )
                  : <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  />}
              </label>
              <label className={style.column}>
                {value.product_name}
              </label>
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
                <span
                  className={style.status}
                  style={{
                    backgroundColor:
                      value.status === 0
                        ? "#34219E"
                        : value.status === 1
                          ? "green"
                          : value.status === 2 ? "red" : "#E74C3C"
                  }}
                  value={`${value.status}`}
                >
                  {value.status === 0
                    ? "Chờ Phê Duyệt"
                    : value.status === 1
                      ? "Đang Hoạt Động"
                      : value.status === 2 ? "Cấm Hoạt Động" : "Lỗi"}
                </span>
              </label>
              <label className={style.column}>
                <p
                  onClick={() => { handleUpdateStatus(value.id, value.status) }}
                  className={`btn ${style.updateStatus}`}
                  style={{
                    backgroundColor:
                      value.status === 0
                        ? "green"
                        : value.status === 1
                          ? "red"
                          : value.status === 2 ? "green" : "#E74C3C"
                  }}
                  value={`${value.status}`}
                >
                  {value.status === 0
                    ? "Duyệt Sản Phẩm"
                    : value.status === 1
                      ? "Cấm Hoạt Động"
                      : value.status === 2 ? "Mở Hoạt Động" : "Lỗi"}
                </p>
              </label>
              <label className={style.column}>
                <p onClick={() => {
                  dispatch(getIdProductAdmin(value.id));
                  openModal();
                }}>Xem chi tiết</p>
              </label>
            </div>
          ))}
        </div>
        <div className={style.paginationContainer} style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
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