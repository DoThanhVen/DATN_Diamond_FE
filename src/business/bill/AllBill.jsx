import React, { useEffect, useState } from "react";
import style from "../../css/business/bill.module.css";
import Nav from "react-bootstrap/Nav";
import ModelEdit from "./ModelEdit";
import axios from "axios";
import { GetDataLogin } from "../../service/DataLogin";
import { Navigate, useNavigate } from "react-router";
import { callAPI } from "../../service/API";
import moment from "moment";
import { TypeSpecimenSharp } from "@mui/icons-material";
import listDataAddress from "../../service/AddressVietNam.json"

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


  const navigate = useNavigate();
  const accountLogin = GetDataLogin();
  const accessToken = sessionStorage.getItem('accessToken')
  console.log(accessToken)
  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };

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
    setIsLoad(isload + 1)

  };
  //FORM SEARCH
  const [selectedOption, setSelectedOption] = useState("");
  const [valueOption, setValueOption] = useState(1);
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
  const [status, setStatus] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [listStatus, setListStatus] = useState([]);
  const [isload,setIsLoad] = useState(0);
  const fetchApiShop = async () => {
    const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}`, 'GET', {}, config);
    setOrder(response.data)
    console.log(response)
    const responseStatus = await callAPI(`/api/get/status`, 'GET')
    if (responseStatus.status == 'SUCCESS') {
      setListStatus(responseStatus.data)
    }
  };
  function formatDate(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  }
  useEffect(() => {
    fetchApiShop();
    // getAccountFromSession();
  }, [isload]);

  const onChangeStatus = async (status) => {
    if (status == "") {
      const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}`, 'GET', {}, config);
      setOrder(response.data)
    } else {

      const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}?status=${status}`, 'GET', {}, config);
      setOrder(response.data)
    }
  };
  const handleSearch = async () => {
    console.log(keyword)
    if (valueOption == 1) {
      if (Number(keyword)) {
        const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}/search?status=${status}&keyword=${keyword}&&type=${valueOption}`, 'GET', {}, config);
        console.log(response)
        setOrder(response.data)
      }
      else {
        alert('Looix')
      }
    } else {
      const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}/search?status=${status}&keyword=${keyword}&&type=${valueOption}`, 'GET', {}, config);
      console.log(response)
      setOrder(response.data)
    }

  }
  // console.log(orders?.content?.status[orders?.content?.status.length -1].status.id)
  return (
    <React.Fragment>
      <div className={`${style.formSearch}`}>
        <select
          value={valueOption}
          onChange={(e) => {
            setValueOption(e.target.value)
          }}
          className={`${style.optionSelect}`}
        >
          <option value={1} >Mã đơn hàng</option>
          <option value={2}>Sản phẩm</option>
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
          {listStatus?.map((value, index) => (
            <option key={index} value={value.id}>
              {value.name}
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
              <th 
              
              >Thông tin người nhận</th>
              <th>Trạng Thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              orders?.map((value, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{value.id}</td>
                  <td
                        width={200}
                  
                  > {listDataAddress.map((valueCity, index) =>
                    valueCity.codename === JSON.parse(value.address_order.replace(/\\/g, '')).city
                      ? valueCity.districts.map((valueDistrict, index) =>
                        valueDistrict.codename === JSON.parse(value.address_order.replace(/\\/g, '')).district
                          ? valueDistrict.wards.map((valueWard, index) =>
                            valueWard.codename === JSON.parse(value.address_order.replace(/\\/g, '')).ward ? (
                              <>
                              {JSON.parse(value.address_order.replace(/\\/g, '')).phone} - {JSON.parse(value.address_order.replace(/\\/g, '')).name}, {valueCity?.name}, {valueDistrict?.name},{" "}
                                {valueWard?.name}, {JSON.parse(value.address_order.replace(/\\/g, '')).address}
                              </>
                            ) : null
                          )
                          : null
                      )
                      : null
                  )}</td>
                  <td style={{ position: "relative" }}>
                    <span
                      style={{
                        backgroundColor:
                          value.status[value.status.length - 1].status.id ===
                            "1"
                            ? "#34219E"
                            : value.status[value.status.length - 1].status
                              .id === "2"
                              ? "#FA9A18"
                              : value.status[value.status.length - 1].status
                                .id === "3"
                                ? "#FA9A18"
                                : value.status[value.status.length - 1].status
                                  .id === "4"
                                  ? "#FA9A18"
                                  : value.status[value.status.length - 1].status
                                    .id === "5"
                                    ? "#2ECC71"
                                    : value.status[value.status.length - 1].status
                                      .id === "6"
                                      ? "#2ECC71"
                                      : value.status[value.status.length - 1].status
                                        .id === "7"
                                        ? "orange"
                                        : value.status[value.status.length - 1].status
                                          .id === "8"
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
                      {value?.status[value.status.length - 1]?.status.name}
                      {/* {value.status[value.status.length - 1].status.id === "1"
                        ? "Chờ Xác Nhận"
                        : value.status[value.status.length - 1].status.id ===
                          "2"
                        ? "Đã Xác Nhận"
                        : value.status[value.status.length - 1].status.id ===
                          "3"
                        ? "Chuẩn Bị Hàng"
                        : value.status[value.status.length - 1].status.id ===
                          "4"
                        ? "Đang Giao"
                        : value.status[value.status.length - 1].status.id ===
                          "5"
                        ? "Chờ Lấy Hàng"
                        : value.status[value.status.length - 1].status.id ===
                          "6"
                        ? "Đã Nhận"
                        : value.status[value.status.length - 1].status.id ===
                          "7"
                        ? "Trả Hàng"
                        : value.status[value.status.length - 1].status.id ===
                          "8"
                        ? "Đã Hủy"
                        : "Giao Thất Bại"} */}
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
      {isModalOpen && <ModelEdit data={modalData} closeModal={closeModal} listStatus={listStatus} isLoad={isload} />}
    </React.Fragment>
  );
}
