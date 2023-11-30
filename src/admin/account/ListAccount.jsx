import React, { useEffect, useState } from "react";
import style from "../../css/admin/account/listaccount.module.css";
import { callAPI } from "../../service/API";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import ModelEdit from "./ModelEdit";
import { getIdAccountAdmin } from "../../service/Actions";
import { Pagination } from "@mui/material";

function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}
function ListAccount() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.idAccountAdmin);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const numberPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
<<<<<<< HEAD
  const [keyword, setkeyword] = useState('');
  const [keyfind, setkeyfind] = useState('');
  const [reload, setreload] = useState(0)
  const [sortBy, setsortBy] = useState('')
  const [sortType, setsortType] = useState('')
  const [filterbyStatus, setFilterStatus] = useState("")
=======
  const [keyword, setkeyword] = useState("");
  const [keyfind, setkeyfind] = useState("");
  const [reload, setreload] = useState(0);
  const [sortBy, setsortBy] = useState("");
  const [sortType, setsortType] = useState("");
>>>>>>> origin/main

  useEffect(() => {
    getdata(currentPage);
  }, [data, currentPage, reload, sortType]);
<<<<<<< HEAD

=======
>>>>>>> origin/main

  const getdata = async (page, filterStatus) => {
    try {
<<<<<<< HEAD
      const response = await callAPI(`/api/account/getAll?key=${keyfind}&keyword=${keyword}&offset=${(page - 1) * numberPage}&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}&shoporaccount=account`, "GET");
=======
      const response = await callAPI(
        `/api/account/getAll?key=${keyfind}&keyword=${keyword}&shoporaccount=account&offset=${
          (page - 1) * numberPage
        }&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}`,
        "GET"
      );
>>>>>>> origin/main
      const responseData = response.data;
      if (filterStatus === undefined || filterStatus === "") {
        setAccounts(responseData.content || []);
        setTotalPages(responseData.totalPages || 1);
      } else {
        const newData = responseData.content.filter((account) => account.status === (filterStatus === 'true'));
        setAccounts(newData || []);
        setTotalPages(responseData.totalPages || 1);
      }
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

  return (
    <React.Fragment>
      <div className={style.listAccount}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>Danh sách tài khoản</label>
            <div className={`${style.formSearch}`}>
              <select
                className={`${style.optionSelect}`}
                value={keyfind}
                onChange={(e) => {
                  setkeyfind(e.target.value);
                }}
              >
                <option value="fullname">Tên tài khoản</option>
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
        <div className={`${style.sort}`}>
          <label>Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => {
<<<<<<< HEAD
              setsortBy(e.target.value)
=======
              setsortBy(e.target.value);
>>>>>>> origin/main
            }}
            className={`ms-2 ${style.optionSelect}`}
          >
            <option value="">Lựa chọn...</option>
<<<<<<< HEAD
            <option value={'id'}>
              Mã tài khoản
            </option>
            <option value={'username'}>
              Tên đăng nhập
            </option>
            <option value={'create_date'}>
              Ngày tạo
            </option>
=======
            <option value={"id"}>Mã tài khoản</option>
            <option value={"username"}>Tên đăng nhập</option>
            <option value={"create_date"}>Ngày tạo</option>
>>>>>>> origin/main
          </select>
          {sortBy !== "" ? (
            <select
              value={sortType}
              onChange={(e) => {
<<<<<<< HEAD
                setsortType(e.target.value)
=======
                setsortType(e.target.value);
>>>>>>> origin/main
              }}
              className={`${style.optionSelect}`}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          ) : null}
        </div>
<<<<<<< HEAD
        <div className={style.typeProduct}>
          <label>Lọc sản phẩm theo trạng thái:</label>
          <select
            value={filterbyStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              // You can also call getdata function here directly
              getdata(currentPage, e.target.value);
            }}
            className={`${style.optionSelectType}`}
          >
            <option value="">Tất cả</option>
            <option value={true}> Đang Hoạt Động</option>
            <option value={false}>Cấm Hoạt Động</option>
          </select>
        </div>
        <label className={style.heading}>Danh sách tài khoản</label>
=======
>>>>>>> origin/main
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>ID</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tài khoản</label>
            <label className={style.column}>Họ & tên</label>
            <label className={style.column}>Giới tính</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column}></label>
          </div>
          {accounts.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                <img
                  className={style.image}
                  src={
                    value.infoAccount?.image
                      ? `http://localhost:8080/api/uploadImageProduct/${value.infoAccount?.image}`
                      : "https://bootdey.com/img/Content/avatar/avatar7.png"
                  }
                  alt="Hình Ảnh"
                ></img>
              </label>
              <label className={style.column}>{value.username}</label>
              <label className={style.column}>
                {value.infoAccount?.fullname}
              </label>
              <label className={style.column}>
                {value.infoAccount?.gender === true ? "Nam" : "Nữ"}
              </label>
              <label className={style.column}>
                {formatDate(value.create_date)}
              </label>
              <label className={style.column}>
                <span
                  className={style.statusAccount}
                  style={{ backgroundColor: value.status ? "green" : "red" }}
                >
                  {value.status ? "Đang hoạt động" : "Cấm hoạt động"}
                </span>
              </label>
              <label className={style.column}>
                <i
                  className={`bi bi-pencil-square`}
                  onClick={() => {
                    dispatch(getIdAccountAdmin(value.id));
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
      {showModal && <ModelEdit status={showModal} toggleShow={closeModal} />}
    </React.Fragment>
  );
}

export default ListAccount;
