import React, { useState } from "react";
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

const numberPage = 10;
const listBill = [
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 0
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 1
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 2
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 3
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 4
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 5
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 6
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 7
  },
  {
    idBill: "bill001",
    username: "account001",
    fullname: "Đỗ Thanh Vẹn",
    shopName: "Tên cửa hàng",
    createDate: "20/10/2023",
    price: 123000,
    status: 8
  }
];

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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(listBill.length / numberPage);

  if (currentPage < 1) {
    setCurrentPage(1);
  } else if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  const startIndex = (currentPage - 1) * numberPage;
  const endIndex = startIndex + numberPage;

  const listPage = listBill.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //FORM SEARCH
  const [selectedOption, setSelectedOption] = React.useState("");
  const [valueOption, setValueOption] = React.useState("");
  const handleChangeOption = (event) => {
    const selectedOptionValue = event.target.value;
    let text = "";
    setValueOption(selectedOptionValue);
    const options = event.target.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === selectedOptionValue) {
        text = options[i].innerText;
        break;
      }
    }

    setSelectedOption(text);
  };
  //DATE
  const [startDate,setStartDate] = useState(null)
  const [endDate,setEndDate] = useState(null)
  return (
    <React.Fragment>
      <div className={style.listBill}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>Danh sách đơn hàng</label>
            <div className={`${style.formSearch}`}>
              <select
                value={valueOption}
                onChange={handleChangeOption}
                className={`${style.optionSelect}`}
              >
                <option value="idBill">Mã đơn hàng</option>
                <option value="customerName">Tên người mua</option>
                <option value="username">Tên tài khoản</option>
              </select>
              <input
                className={`${style.inputSearch}`}
                type="text"
                placeholder={`${
                  selectedOption ? selectedOption : "Tìm kiếm"
                }...`}
              ></input>
              <button className={`${style.buttonSearch}`}>Tìm Kiếm</button>
            </div>
          </div>
          <div className={style.filter}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="Ngày Bắt Đầu"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
                <DatePicker
                  label="Ngày Kết Thúc"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>ID</label>
            <label className={style.column}>Mã đơn hàng</label>
            <label className={style.column}>Tên tài khoản</label>
            <label className={style.column}>Tên khách hàng</label>
            <label className={style.column}>Giá</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column}></label>
          </div>
          {listPage.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>
                {currentPage * numberPage - numberPage + index + 1}
              </label>
              <label className={style.column}>{value.idBill}</label>
              <label className={style.column}>{value.username}</label>
              <label className={style.column}>{value.fullname}</label>
              <label className={style.column}>
                {formatCurrency(value.price, 0)}
              </label>
              <label className={style.column}>{value.createDate}</label>
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
                  {value.status === 0
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
                    : "Giao Thất Bại"}
                </span>
              </label>
              <label className={style.column}>
                <Link to="/admin/bills/billdetail">Xem Chi Tiết</Link>
              </label>
            </div>
          ))}
        </div>
        <div className={`${style.buttonPage}`}>
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
              onClick={() => handlePageChange(totalPages)}
            >
              <i className="bi bi-chevron-bar-right" />
            </Nav.Link>
          </div>
      </div>
    </React.Fragment>
  );
}

export default ListBill;
