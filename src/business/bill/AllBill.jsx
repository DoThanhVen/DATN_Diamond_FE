import React, { useEffect, useState } from "react";
import style from "../../css/business/bill.module.css";
import Nav from "react-bootstrap/Nav";
import ModelEdit from "./ModelEdit";
import axios from "axios";

const numberProductPage = 10;

export default function AllBill() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  function handleClickChiTiet(order) {
    // const tdElement = event.currentTarget.parentElement;

    // const idBill = tdElement.querySelector("td:nth-child(2)").textContent;

    setModalData(order);

    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({});
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

  const [orders, setOrder] = useState([]);
  const [shop, setShop] = useState([]);
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const fetchApiShop = () => {
    axios
      .get("http://localhost:8080/api/order/find/shop/1")
      .then((reponse) => {
        setShop(reponse.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  
  const fetchApi = () => {
    axios
      .get("http://localhost:8080/api/order/getAllList")
      .then((reponse) => {
        setOrder(reponse.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    fetchApi();
    fetchApiShop();
  }, []);
  // console.log(orders.content)
  const onChangeStatus = (status) => {
    if (status == "") {
      axios
        .get("http://localhost:8080/api/order/find/shop/1")
        .then((reponse) => {
          setOrder(reponse.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .get(`http://localhost:8080/api/shop/${1}/status/${status}`)
        .then((reponse) => {
          setOrder(reponse.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleSearch = () => {
    if (status == "") {
      axios
        .get(`http://localhost:8080/api/order/find/shop/1?keyword=${keyword}`)
        .then((reponse) => {
          setOrder(reponse.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .get(
          `http://localhost:8080/api/shop/${1}/status/${status}?keyword=${keyword}`
        )
        .then((reponse) => {
          setOrder(reponse.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  // console.log(orders?.content?.status[orders?.content?.status.length -1].status.id)
  return (
    <React.Fragment>
      <div className={`${style.formSearch}`}>
        <select
          value={valueOption}
          onChange={handleChangeOption}
          className={`${style.optionSelect}`}
        >
          <option value="idBill">Mã đơn hàng</option>
          <option value="customerName">Tên người mua</option>
          <option value="productName">Sản phẩm</option>
        </select>
        <input
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          className={`${style.inputSearch}`}
          type="text"
          placeholder={`${selectedOption ? selectedOption : "Tìm kiếm"}...`}
        ></input>
        <button onClick={handleSearch} className={`${style.buttonSearch}`}>
          Tìm Kiếm
        </button>
      </div>
      <div className={`${style.updateStatusAll} mt-4 mb-3`}>
        <div className={`${style.cardHeadingModel}`}>
          {orders.length} Đơn hàng
        </div>
        <span className={`${style.buttonChangeStatus}`}>
          <i className="bi bi-receipt-cutoff"></i> Giao Hàng Loạt
        </span>
      </div>
      <div className={`${style.filterStatus}`}>
        <select
          value={valueBillOption}
          onChange={(event) => {
            onChangeStatus(event.target.value);
            setValueBillOption(event.target.value);
            setStatus(event.target.value);
          }}
          className={`${style.optionSelect}`}
        >
          {statusBill.map((value, index) => (
            <option key={index} value={value.id}>
              {value.value}
            </option>
          ))}
        </select>
      </div>
      <div className={`${style.cardContainerTable}`}>
        <table className={`table`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã Hóa Đơn</th>
              <th>Trạng Thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shop && shop?.content?.map((value, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{value.id}</td>
                <td style={{ position: "relative" }}>
                  <span
                    style={{
                      backgroundColor:
                        value.status[value.status.length - 1].status.id === "1"
                          ? "#34219E"
                          : value.status[value.status.length - 1].status.id ===
                            "2"
                          ? "#FA9A18"
                          : value.status[value.status.length - 1].status.id ===
                            "3"
                          ? "#FA9A18"
                          : value.status[value.status.length - 1].status.id ===
                            "4"
                          ? "#FA9A18"
                          : value.status[value.status.length - 1].status.id ===
                            "5"
                          ? "#2ECC71"
                          : value.status[value.status.length - 1].status.id ===
                            "6"
                          ? "#2ECC71"
                          : value.status[value.status.length - 1].status.id ===
                            "7"
                          ? "orange"
                          : value.status[value.status.length - 1].status.id ===
                            "8"
                          ? "red"
                          : "#E74C3C",
                      width: "150px",
                      height: "80%",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "20px",
                      color: "white",
                      position: "absolute",
                      fontSize: "14px"
                    }}
                    value={`${value.status}`}
                  >
                    {value.status[value.status.length - 1].status.id === "1"
                      ? "Chờ Xác Nhận"
                      : value.status[value.status.length - 1].status.id === "2"
                      ? "Đã Xác Nhận"
                      : value.status[value.status.length - 1].status.id === "3"
                      ? "Chuẩn Bị Hàng"
                      : value.status[value.status.length - 1].status.id === "4"
                      ? "Đang Giao"
                      : value.status[value.status.length - 1].status.id === "5"
                      ? "Chờ Lấy Hàng"
                      : value.status[value.status.length - 1].status.id === "6"
                      ? "Đã Nhận"
                      : value.status[value.status.length - 1].status.id === "7"
                      ? "Trả Hàng"
                      : value.status[value.status.length - 1].status.id === "8"
                      ? "Đã Hủy"
                      : "Giao Thất Bại"}
                  </span>
                </td>
                <td
                  onClick={() => {
                    handleClickChiTiet(value);
                  }}
                >
                  Xem Chi Tiết
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <ModelEdit data={modalData} closeModal={closeModal} />}
    </React.Fragment>
  );
}
