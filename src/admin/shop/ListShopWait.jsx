import React, { useEffect, useState } from "react";
import style from "../../css/admin/shop/listshop.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIdShop } from "../../service/Actions";
import { Nav } from "react-bootstrap";
import moment from "moment";
import { callAPI } from "../../service/API";
import { Pagination } from "@mui/material";
function ListShopWait() {
  const [ListShopWait, setListShopwait] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.idShop);
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
  }, [reload, currentPage, sortType, data]);

  function formatDate(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  }

  const getdata = async (page) => {
    const token = sessionStorage.getItem('accessToken');
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
      const response = await callAPI(
        `/api/auth/account/getAll?key=${keyfind}&keyword=${keyword}&offset=${(page - 1)
        }&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}&shoporaccount=shop`,
        "GET", {}, config
      );
      const responseData = response.data;

      const listFilter = responseData.content.filter((a) => {
        return a.shop !== null && a.shop.status === 0;
      });
      console.log(listFilter)
      setListShopwait(listFilter || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <React.Fragment>
      <div className={style.heading}>
        <div className={style.column}>
          <label className={style.title}>Danh sách cửa hàng</label>
          <div className={`${style.formSearch}`}>
            <select
              className={`${style.optionSelect}`}
              value={keyfind}
              onChange={(e) => {
                setkeyfind(e.target.value);
              }}
            >
              <option value="shop_name">Tên cửa hàng</option>
              <option value="username">Tên đăng nhập</option>
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

      <div className={style.listShopActive}>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>ID</label>
            <label className={style.column}>Tên cửa hàng</label>
            <label className={style.column}>Chủ sở hữu</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column} />
          </div>
          {ListShopWait.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{index}</label>
              <label className={style.column}>{value.shop.shop_name}</label>
              <label className={style.column}>{value.username}</label>
              <label className={style.column}>
                {formatDate(value.shop.create_date)}
              </label>
              <label className={style.column}>
                <span
                  className={style.status}
                  style={{
                    backgroundColor: value.shop.status === 0 ? "#34219E" : null,
                    padding: "5px 10px"
                  }}
                  value={`${value.shop.status}`}
                >
                  {value.shop.status === 0 ? "Chờ Xác Nhận" : null}
                </span>
              </label>
              <label className={style.column}>
                <img style={{ width: '60%' }} src=
                  {value.shop.image
                    ? value.shop.image
                    : "/images/image_shop.jpg"} alt="Hình ảnh" />
              </label>
              <label
                className={style.column}
                onClick={() => {
                  dispatch(getIdShop(value.shop.id));
                }}
              >
                <Link to="/admin/shop/shopdetail">Xem Chi Tiết</Link>
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

export default ListShopWait;
