import React, { useEffect, useState } from "react";
import style from "../../css/business/bill.module.css";
import Nav from "react-bootstrap/Nav";
import ModelEdit from "./ModelEdit";
import axios from "axios";

const numberProductPage = 10;
const listBill = [
  {
    idBill: "bill1",
    total: 123000,
    status: "0"
  },
  {
    idBill: "bill2",
    total: 123000,
    status: "1"
  },
  {
    idBill: "bill3",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill13",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill23",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill33",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill43",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill53",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill63",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill4",
    total: 123000,
    status: "3"
  },
  {
    idBill: "bill5",
    total: 123000,
    status: "4"
  },
  {
    idBill: "bill6",
    total: 123000,
    status: "5"
  },
  {
    idBill: "bill7",
    total: 123000,
    status: "6"
  },
  {
    idBill: "bill8",
    total: 123000,
    status: "7"
  },
  {
    idBill: "bill9",
    total: 123000,
    status: "8"
  },
  {
    idBill: "bill1",
    total: 123000,
    status: "0"
  },
  {
    idBill: "bill2",
    total: 123000,
    status: "1"
  },
  {
    idBill: "bill3",
    total: 123000,
    status: "2"
  },
  {
    idBill: "bill4",
    total: 123000,
    status: "3"
  },
  {
    idBill: "bill5",
    total: 123000,
    status: "4"
  },
  {
    idBill: "bill6",
    total: 123000,
    status: "5"
  },
  {
    idBill: "bill7",
    total: 123000,
    status: "6"
  },
  {
    idBill: "bill8",
    total: 123000,
    status: "7"
  },
  {
    idBill: "bill9",
    total: 123000,
    status: "8"
  },
  {
    idBill: "bill17",
    total: 123000,
    status: "6"
  },
  {
    idBill: "bill18",
    total: 123000,
    status: "7"
  },
  {
    idBill: "bill19",
    total: 123000,
    status: "8"
  },
  {
    idBill: "bill127",
    total: 123000,
    status: "6"
  },
  {
    idBill: "bill138",
    total: 123000,
    status: "7"
  },
  {
    idBill: "bill149",
    total: 123000,
    status: "8"
  }
];

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
  const allBill = listBill.reduce((uniqueList, currentBill) => {
    if (
      valueBillOption === "" &&
      !uniqueList.some((item) => item.idBill === currentBill.idBill)
    ) {
      uniqueList.push(currentBill);
    } else if (
      currentBill.status === valueBillOption &&
      !uniqueList.some((item) => item.idBill === currentBill.idBill)
    ) {
      uniqueList.push(currentBill);
    }
    return uniqueList;
  }, []);

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

  //PAGE
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allBill.length / numberProductPage);

  if (currentPage < 1) {
    setCurrentPage(1);
  } else if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  const startIndex = (currentPage - 1) * numberProductPage;
  const endIndex = startIndex + numberProductPage;

  const listPage = allBill.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [orders, setOrder] = useState([]);
  const fetchApi = () => {
    axios.get('http://localhost:8080/api/order/getAllList')
      .then((reponse) => {
        setOrder(reponse.data.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    fetchApi()
  }, [])
  // console.log(orders.content)
  const onChangeStatus = (status) => {
   
    if(status == ''){
      axios.get('http://localhost:8080/api/order/getAllList')
      .then((reponse) => {
        setOrder(reponse.data.data)
      })
      .catch((e) => {
        console.log(e)
      })
    }else {
      axios.get(`http://localhost:8080/api/order/findByStatus/${status}`)
      .then((reponse) => {
        setOrder(reponse.data.data) 
      })
      .catch((e) => {
        console.log(e)
      })
    }
  }
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
          className={`${style.inputSearch}`}
          type="text"
          placeholder={`${selectedOption ? selectedOption : "Tìm kiếm"}...`}
        ></input>
        <button className={`${style.buttonSearch}`}>Tìm Kiếm</button>
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
            onChangeStatus(event.target.value)
            setValueBillOption(event.target.value)
          }
          }
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
            {orders?.map((value, index) => (
              <tr key={index}>
                <th>
                  {currentPage * numberProductPage -
                    numberProductPage +
                    index +
                    1}
                </th>
                <td>{value.id}</td>
                <td style={{ position: "relative" }}>
                  <span
                    style={{
                      backgroundColor:
                        value.status[value.status.length - 1].status.id == "1"
                          ? "#34219E"
                          : value.status[value.status.length - 1].status.id == "2"
                            ? "#FA9A18"
                            : value.status[value.status.length - 1].status.id == "3"
                              ? "#FA9A18"
                              : value.status[value.status.length - 1].status.id == "4"
                                ? "#FA9A18"
                                : value.status[value.status.length - 1].status.id == "5"
                                  ? "#2ECC71"
                                  : value.status[value.status.length - 1].status.id == "6"
                                    ? "#2ECC71"
                                    : value.status[value.status.length - 1].status.id == "7"
                                      ? "orange"
                                      : value.status[value.status.length - 1].status.id == "8"
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
                    {value.status[value.status.length - 1].status.id == "1"
                      ? "Chờ Xác Nhận"
                      : value.status[value.status.length - 1].status.id == "2"
                        ? "Đã Xác Nhận"
                        : value.status[value.status.length - 1].status.id == "3"
                          ? "Chuẩn Bị Hàng"
                          : value.status[value.status.length - 1].status.id == "4"
                            ? "Đang Giao"
                            : value.status[value.status.length - 1].status.id == "5"
                              ? "Chờ Lấy Hàng"
                              : value.status[value.status.length - 1].status.id == "6"
                                ? "Đã Nhận"
                                : value.status[value.status.length - 1].status.id == "7"
                                  ? "Trả Hàng"
                                  : value.status[value.status.length - 1].status.id == "8"
                                    ? "Đã Hủy"
                                    : "Giao Thất Bại"}
                  </span>
                </td>
                <td onClick={() => {
                  handleClickChiTiet(value)
                }}>Xem Chi Tiết</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`${style.buttonPage}`}>
          <Nav.Link className={`btn`} onClick={() => handlePageChange(1)}>
            <i className="bi bi-chevron-bar-left"></i>
          </Nav.Link>
          <Nav.Link
            className={`btn`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <i className="bi bi-caret-left"></i>
          </Nav.Link>
          <Nav.Link
            className={`btn`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <i className="bi bi-caret-right"></i>
          </Nav.Link>
          <Nav.Link
            className={`btn`}
            onClick={() =>
              handlePageChange(Math.ceil(allBill.length / numberProductPage))
            }
          >
            <i className="bi bi-chevron-bar-right"></i>
          </Nav.Link>
        </div>
      </div>
      {isModalOpen && <ModelEdit data={modalData} closeModal={closeModal} />}
    </React.Fragment>
  );
}
