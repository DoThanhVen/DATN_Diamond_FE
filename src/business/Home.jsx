import React, { useEffect, useState } from "react";
import style from "../css/business/home.module.css";
import Nav from "react-bootstrap/Nav";
import { callAPI } from "../service/API";
import Loading from "../admin/Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { GetDataLogin } from "../service/DataLogin";
import { CChart } from "@coreui/react-chartjs";
import { Bar } from "react-chartjs-2";
import "../css/business/home.css";

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
  const [bandProduct, setBandProduct] = useState(0);
  const [stockingProduct, setStockingProduct] = useState(0);
  const [listTotal, setListTotal] = useState([]);
  const [listStatistical, setListStatistical] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [listTotalMonth, setListTotalMonth] = useState([]);

  const moment = require("moment-timezone");

  const currentDate = moment().tz("Asia/Ho_Chi_Minh");
  const [selectedDate, setSelectedDate] = useState(
    currentDate.format("YYYY-MM-DD")
  );
  const [yearTotal, setYearTotal] = useState(currentDate.year());

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== undefined) {
      try {
        getAllBill(accountLogin.shop.id);
        getTotalMonth(accountLogin.shop.id);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getAccountFromSession();
  }, [day, month, year, yearTotal]);

  console.log(listTotalMonth);
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

  const handleChangeStatusBill = (status) => {
    setValueBillOption(status);
  };

  const getAllBill = async (idShop) => {
    await callAPI(
      `/api/business/thongke/${idShop}?year=${year}&month=${month}&day=${day}`,
      "GET"
    )
      .then((response) => {
        if (response) {
          setListTotal(response.data[0]);
          setBandProduct(response.data[1]);
          setStockingProduct(response.data[2]);
          setListStatistical(response.data[3]);
        }
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const getTotalMonth = async (idShop) => {
    await callAPI(
      `/api/business/thongke/month/${idShop}?year=${yearTotal}`,
      "GET"
    )
      .then((response) => {
        if (response) {
          setListTotalMonth(response.data);
        }
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  //CHECK TRÙNG DATA
  const uniqueData = Array.from(
    new Set(listTotal.map((item) => item[0].id))
  ).map((id) => listTotal.find((item) => item[0].id === id));
  //PAGE
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(uniqueData.length / numberPage);
  const handlePageChange = (page) => {
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

  const handleDateChange = (event) => {
    const formattedDate = event.target.value;
    setSelectedDate(formattedDate);

    const dateObject = new Date(formattedDate);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

    setDay(day);
    setMonth(month);
    setYear(year);
  };

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
              {uniqueData.reduce(function (count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 1)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Chờ Xác Nhận</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/choLayHang">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function (count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 5)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Chờ Lấy Hàng</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/daXuLy">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function (count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 6)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Đã Xử Lý</div>
          </Nav.Link>

          <Nav.Link className={style.cardContentActivity} href="#/donHuy">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function (count, data) {
                if (data[0].status[data[0].status.length - 1].status.id === 8)
                  count++;
                return count;
              }, 0)}
            </div>
            <div className={style.cardTitleActivity}>Đơn Hủy</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/traHang">
            <div className={style.cardAmount}>
              {uniqueData.reduce(function (count, data) {
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
            <div className={style.cardAmount}>{bandProduct}</div>
            <div className={style.cardTitleActivity}>Sản Phẩm Bị Tạm Khóa</div>
          </Nav.Link>
          <Nav.Link className={style.cardContentActivity} href="#/hetHang">
            <div className={style.cardAmount}>{stockingProduct}</div>
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
          <div className="container">
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              className={`mt-3 timer`}
              onChange={handleDateChange}
            />
            {listStatistical ? (
              <CChart
                type="bar"
                data={{
                  labels: listStatistical?.map((data) => data[0]),
                  datasets: [
                    {
                      label: "Sản Phẩm",
                      backgroundColor: "#f87979",
                      data: listStatistical?.map((data) => data[1])
                    },
                    {
                      label: "Đơn Hàng",
                      backgroundColor: "red",
                      data: listStatistical?.map((data) => data[2])
                    }
                  ]
                }}
                labels="months"
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: "red"
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "green"
                      },
                      ticks: {
                        color: "blue"
                      }
                    },
                    y: {
                      grid: {
                        color: "green"
                      },
                      ticks: {
                        color: "blue"
                      }
                    }
                  }
                }}
              />
            ) : null}
            {listTotalMonth ? (
              <select
                value={yearTotal}
                onChange={(e) => {
                  setYearTotal(e.target.value);
                }}
                className={`optionSelect mt-3 timer`}
              >
                {listTotalMonth.map((value, index) => (
                  <>
                    <option key={index} value={value[1]}>
                      {value[1]}
                    </option>
                  </>
                ))}
              </select>
            ) : null}
            {listTotalMonth ? (
              <CChart
                type="bar"
                data={{
                  labels: listTotalMonth?.map((data) => data[2]),
                  datasets: [
                    {
                      label: "Doanh Thu Tháng",
                      backgroundColor: "#f87979",
                      data: listTotalMonth?.map((data) => data[0])
                    }
                  ]
                }}
                labels="months"
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: "red"
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "green"
                      },
                      ticks: {
                        color: "blue"
                      }
                    },
                    y: {
                      grid: {
                        color: "green"
                      },
                      ticks: {
                        color: "blue"
                      }
                    }
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      {/* {loading && <Loading />} */}
    </React.Fragment>
  );
}

export default Home;
