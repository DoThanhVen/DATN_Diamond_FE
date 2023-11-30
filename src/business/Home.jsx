import React, { useEffect, useState } from "react";
import style from "../css/business/home.module.css";
import Nav from "react-bootstrap/Nav";
import { callAPI } from "../service/API";
import Loading from "../admin/Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { GetDataLogin } from "../service/DataLogin";

const numberPage = 10;
//CHUYỂN ĐỔI TIỀN TỆ
function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function Home() {
  const navigate = useNavigate();
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== undefined) {
      try {
        getAllBill(accountLogin.shop.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    getAccountFromSession();
  }, []);
  //LOADING
  const [loading, setLoading] = useState(true);
  //STATUS BILL
  const [valueBillOption, setValueBillOption] = React.useState("");
  const statusBill = [
    { id: "", value: "Tất Cả" },
    { id: "1", value: "Chờ Xác Nhận" },
    { id: "2", value: "Đã Xác Nhận" },
    { id: "3", value: "Chuẩn Bị Hàng" },
    { id: "4", value: "Đang Giao" },
    { id: "5", value: "Chờ Lấy Hàng" },
    { id: "6", value: "Đã Giao" },
    { id: "7", value: "Trả Hàng/Hoàn Tiền" },
    { id: "8", value: "Đã Hủy" },
    { id: "9", value: "Giao Không Thành Công" }
  ];

  const handleChangeStatusBill = status => {
    setValueBillOption(status);
  };

  const [bandProduct, setBandProduct] = useState(0);
  const [stockingProduct, setStockingProduct] = useState(0);
  const [listTotal, setListTotal] = useState([]);

  const getAllBill = async idShop => {
    await callAPI(`/api/business/thongke/${idShop}`, "GET")
      .then(response => {
        if (response) {
          setListTotal(response.data[0]);
          setBandProduct(response.data[1]);
          setStockingProduct(response.data[2]);
        }
        setLoading(false);
      })
      .catch(error => console.log(error));
  };
  //CHECK TRÙNG DATA
  const uniqueData = Array.from(
    new Set(listTotal.map(item => item[0].id))
  ).map(id => listTotal.find(item => item[0].id === id));
  //PAGE
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(uniqueData.length / numberPage);
  const handlePageChange = page => {
    if (uniqueData.length <= numberPage || page <= 0) {
      setCurrentPage(1);
    } else {
      if (page > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(page);
      }
    }
  };

  const listPage = uniqueData.slice(
    (currentPage - 1) * numberPage,
    currentPage * numberPage
  );
  return (
    <React.Fragment>
      <div className={style.card}>
        <div>
          <div className={style.heading}>Danh Sách Cần Làm</div>
          <div className={style.title}>Những việc bạn sẽ làm</div>
        </div>
        <div className={`${style.cardActivity}`}>
          <Nav.Link className={style.cardContentActivity} href="#/choXacNhan">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function(count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 1)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Chờ Xác Nhận</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/choLayHang">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function(count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 5)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Chờ Lấy Hàng</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/daXuLy">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function(count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 6)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Đã Xử Lý</div>
          </Nav.Link>

          <Nav.Link className={style.cardContentActivity} href="#/donHuy">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function(count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 8)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Đơn Hủy</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/traHang">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function(count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 7)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>
              Trả Hàng/Hoàn Tiền Chờ Xử Lý
            </div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/tamKhoa">
            <div className={style.cardAmount}>
              {bandProduct}
            </div>
            <div className={style.cardTitleActivity}>Sản Phẩm Bị Tạm Khóa</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/hetHang">
            <div className={style.cardAmount}>
              {stockingProduct}
            </div>
            <div className={style.cardTitleActivity}>Sản Phẩm Hết Hàng</div>
          </Nav.Link>
        </div>
      </div>
      <div className={`${style.card} mt-3`}>
        <div>
          <div className={style.heading}>Phân Tích Bán Hàng</div>
          <div className={style.title}>
            Tổng quan dữ liệu của shop đối với đơn hàng
          </div>
        </div>
        <div className={`${style.filterStatus}`}>
          <select
            value={valueBillOption}
            onChange={event => handleChangeStatusBill(event.target.value)}
            className={`${style.optionSelect}`}
          >
            {statusBill.map((value, index) =>
              <option key={index} value={value.id}>
                {value.value}
              </option>
            )}
          </select>
        </div>
        <div className={`${style.listProduct}`}>
          <div className={style.table}>
            <div className={style.tableHeading}>
              <label className={style.column}>STT</label>
              <label className={style.column}>Mã Đơn Hàng</label>
              <label className={style.column}>Thanh Toán</label>
              <label className={style.column}>Trạng Thái Đơn</label>
              <label className={style.column}>Ngày Cập Nhật</label>
              <label className={style.column}>Thành Tiền</label>
            </div>
            {listPage.map((value, index) =>
              <div key={index} className={style.tableBody}>
                <label className={style.column}>
                  {index + 1}
                </label>
                <label className={style.column}>
                  {value[0].id}
                </label>
                <label
                  className={style.column}
                  style={{ color: value[0].pay === true ? "green" : "red" }}
                >
                  {value[0].pay === true ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
                </label>
                <label className={style.column}>
                  <label
                    className={style.status}
                    style={{
                      backgroundColor:
                        value[0].status[value[0].status.length - 1].status
                          .id === 1
                          ? "#34219E"
                          : value[0].status[value[0].status.length - 1].status
                              .id === 2
                            ? "#34219E"
                            : value[0].status[value[0].status.length - 1].status
                                .id === 3
                              ? "#34219E"
                              : value[0].status[value[0].status.length - 1]
                                  .status.id === 4
                                ? "#2ECC71"
                                : value[0].status[value[0].status.length - 1]
                                    .status.id === 5
                                  ? "#2ECC71"
                                  : value[0].status[value[0].status.length - 1]
                                      .status.id === 6
                                    ? "#2ECC71"
                                    : value[0].status[
                                        value[0].status.length - 1
                                      ].status.id === 7
                                      ? "orange"
                                      : value[0].status[
                                          value[0].status.length - 1
                                        ].status.id === 8
                                        ? "red"
                                        : "#E74C3C"
                    }}
                    value={`${value[0].status[value[0].status.length - 1].status
                      .id}`}
                  >
                    {value[0].status[value[0].status.length - 1].status.id === 1
                      ? "Chờ Xác Nhận"
                      : value[0].status[value[0].status.length - 1].status
                          .id === 2
                        ? "Đã Xác Nhận"
                        : value[0].status[value[0].status.length - 1].status
                            .id === 3
                          ? "Chuẩn Bị Hàng"
                          : value[0].status[value[0].status.length - 1].status
                              .id === 4
                            ? "Đang Giao"
                            : value[0].status[value[0].status.length - 1].status
                                .id === 5
                              ? "Chờ Lấy Hàng"
                              : value[0].status[value[0].status.length - 1]
                                  .status.id === 6
                                ? "Đã Nhận"
                                : value[0].status[value[0].status.length - 1]
                                    .status.id === 7
                                  ? "Trả Hàng/Hoàn Tiền"
                                  : value[0].status[value[0].status.length - 1]
                                      .status.id === 8
                                    ? "Đã Hủy"
                                    : "Giao Thất Bại"}
                  </label>
                </label>
                <label className={style.column}>
                  {value[1].create_date}
                </label>
                <label className={style.column}>
                  {formatCurrency(value[1].quantity * value[2].price, 0)}
                </label>
              </div>
            )}
          </div>
          <div className={`${style.buttonPage}`}>
            <Nav.Link className={style.button} onClick={() => handlePageChange(1)}>
              <i className="bi bi-chevron-bar-left" />
            </Nav.Link>
            {currentPage - 1 > 0
              ? <Nav.Link
                  className={style.button}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </Nav.Link>
              : null}

            <Nav.Link className={`${style.button} ${style.btnActivePage}`}>
              {currentPage}
            </Nav.Link>
            {currentPage + 1 <= totalPages
              ? <Nav.Link
                  className={style.button}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </Nav.Link>
              : null}
            <Nav.Link
              className={style.button}
              onClick={() => handlePageChange(totalPages)}
            >
              <i className="bi bi-chevron-bar-right" />
            </Nav.Link>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </React.Fragment>
  );
}

export default Home;
