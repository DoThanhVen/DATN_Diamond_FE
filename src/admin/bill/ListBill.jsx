import React, { useEffect, useState } from "react";
import style from "../../css/admin/bill/bill.module.css";
import "react-datepicker/dist/react-datepicker.css";
import Nav from "react-bootstrap/Nav";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Link } from "react-router-dom";
import { callAPI } from "../../service/API";
import { ThongBao } from "../../service/ThongBao"
import { Button } from "react-bootstrap";
import { Pagination } from "@mui/material";

//CHUYỂN ĐỔI TIỀN TỆ
function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function ListBill() {
  //PAGE
 
  const [address, setAddress] = useState()
  //FORM SEARCH
  const [selectedOption, setSelectedOption] = React.useState("");
  const [valueOption, setValueOption] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  //DATE
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [orders, setOrders] = useState([])
  const [keyword, setKeyword] = useState('')
  const [isLoad, setIsLoad] = useState(false)
  
  const accessToken = sessionStorage.getItem('accessToken')

  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };
  const fetchAPI = async () => {
    if(keyword == ''){
    const response = await callAPI(`/api/auth/order/getAll?keyword=${keyword}&type=${0}&page=${currentPage}`, 'GET', {}, config)
    console.log(response)
    setOrders(response.data)
      return;
    }
    const response = await callAPI(`/api/auth/order/getAll?keyword=${keyword}&type=${valueOption}&page=${currentPage}`, 'GET', {}, config)
    console.log(response)
    setOrders(response.data)

  }
  useEffect(() => {
    fetchAPI()
  }, [isLoad])
  const handleSearch = () => {
    if(valueOption == 1){
      if(!Number(keyword) && keyword != ''){
        ThongBao("Mã đơn hàng phải là chữ số")
        return;
      }
      setIsLoad(!isLoad)
      return;
    }
    if (valueOption == 0 && keyword == '') {
    setIsLoad(!isLoad)
     return;
    }
    if(valueOption == 0){
      ThongBao("Chọn thông tìm cần tìm kiếm")
      return;
    }
    setIsLoad(!isLoad)
    

  }
  const handlePageChange = (value,page) => {
      setCurrentPage(page)
      setIsLoad(!isLoad)
  };

  return (
    <React.Fragment>
      <div className={style.listBill}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>Danh sách đơn hàng</label>
            <div className={`${style.formSearch}`}>
              <select
                value={valueOption}
                onChange={(e) => {
                  setValueOption(e.target.value)
                }}
                className={`${style.optionSelect}`}
              ><option value={0}>Chọn nôi dụng tìm</option>
                <option value={1}>Mã đơn hàng</option>
                <option value={2}>Tên cửa hàng</option>
              </select>
              <input
                onChange={(e) => {
                  setKeyword(e.target.value)
                }}
                className={`${style.inputSearch}`}
                type="text"
                placeholder={`${selectedOption ? selectedOption : "Tìm kiếm"
                  }...`}
              ></input>
              <button onClick={handleSearch} className={`${style.buttonSearch}`}>Tìm Kiếm</button>
            </div>
          </div>
          
        </div>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>ID</label>
            <label className={style.column}>Mã đơn hàng</label>
            <label className={style.column}>Thông tin người nhận</label>
            <label className={style.column}>Tổng tiền</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>

            <label className={style.column}></label>
          </div>
          {orders?.content?.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>
                {index + 1}
              </label>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>{JSON.parse(value.address_order.replace(/\\/g, '')).city}</label>
              <label className={style.column}>
                {formatCurrency(value.total, 0)}
              </label>

              <label className={style.column}>{value.create_date}</label>
              <label className={style.column}>
                <span
                  className={style.status}
                  style={{
                    backgroundColor:
                      value.status === 0
                        ? "#34219E"
                        : value.status === 1
                          ? "#34219E"
                          : value.status === 2
                            ? "#34219E"
                            : value.status === 3
                              ? "#2ECC71"
                              : value.status === 4
                                ? "#2ECC71"
                                : value.status === 5
                                  ? "#2ECC71"
                                  : value.status === 6
                                    ? "orange"
                                    : value.status === 7
                                      ? "red"
                                      : "#E74C3C"
                  }}
                  value={`${value.status}`}
                >
                  {/* {value.status === 0
                    ? "Chờ Xác Nhận"
                    : value.status === 1
                    ? "Đã Xác Nhận"
                    : value.status === 2
                    ? "Chuẩn Bị Hàng"
                    : value.status === 3
                    ? "Đang Giao"
                    : value.status === 4
                    ? "Chờ Lấy Hàng"
                    : value.status === 5
                    ? "Đã Nhận"
                    : value.status === 6
                    ? "Trả Hàng"
                    : value.status === 7
                    ? "Đã Hủy"
                    : "Giao Thất Bại"} */}
                  {value.status[value.status.length - 1].status.name}
                </span>
              </label>
              <label className={style.column}>
                <Link to={`/admin/bills/detail?id=${value.id}`}>Xem Chi Tiết</Link>
              </label>
            </div>
          ))}
        </div>
        {/* <div className={`${style.buttonPage}`}>
          <Nav.Link className={style.button} onClick={() => handlePageChange(1)}>
            <i className="bi bi-chevron-bar-left" />
          </Nav.Link>
          {currentPage - 1 > 0
            ? <Nav.Link
              className={style.button}
              onClick={() => handlePageChange(currentPage - 1)
              }
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
            onClick={() => handlePageChange(orders?.totalPages)}
          >
            <i className="bi bi-chevron-bar-right" />
          </Nav.Link>
        </div> */}
        <div
          className={style.paginationContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          <Pagination
            count={orders.totalPages}
            page={orders.number + 1}
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

export default ListBill;
