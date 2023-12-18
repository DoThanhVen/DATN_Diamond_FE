import React, { useEffect, useState } from "react";
import style from "../../css/business/bill.module.css";
import Nav from "react-bootstrap/Nav";
import ModelEdit from "./ModelEdit";
import axios from "axios";
import { callAPI } from "../../service/API";
import { GetDataLogin } from "../../service/DataLogin";
import { ThongBao } from "../../service/ThongBao";

const numberProductPage = 10;
export default function UnpaidBill() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const accountLogin = GetDataLogin();
  const accessToken = sessionStorage.getItem('accessToken')
  console.log(accessToken)
  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };

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
  const handleChangeOption = event => {
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

  const [orders, setOrders] = useState([]);
  const [load, isLoad] = useState(0);
  const [listStatus, setListStatus] = useState([]);
  const isload = false;
  const fetchApi = async () => {
    const response = await callAPI(`/api/auth/order/shop/${accountLogin.shop.id}?status=1`, 'GET', {}, config);
    setOrders(response.data)
    const responseStatus = await callAPI(`/api/get/status`, 'GET')
    if (responseStatus.status == 'SUCCESS') {
      setListStatus(responseStatus.data)
    }
  };
  useEffect(
    () => {
      fetchApi();
    },
    [load]
  );
  console.log(orders);
  const handleOrder = async (id) => {
    const response = await callAPI(`/api/auth/order/update/${id}/account/${accountLogin.id}?status=${2}`, 'PUT', {}, config);
    if (response.status == 'SUCCESS') {
      isLoad(load + 1);
      ThongBao("Duyệt đơn thành công!", "success")
    }
  };
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
        />
        <button className={`${style.buttonSearch}`}>Tìm Kiếm</button>
      </div>
      <div className={`${style.updateStatusAll} mt-4 mb-3`}>
        <div className={`${style.cardHeadingModel}`}>
          {/* {listUnpaid.length} */}
          Đơn hàng
        </div>
        <span className={`${style.buttonChangeStatus}`}>
          <i class="bi bi-receipt-cutoff" /> Duyệt Hàng Loạt
        </span>
      </div>
      <div className={`${style.cardContainerTable}`}>
        <table className={`table ${style.tableUnpaid}`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã Hóa Đơn</th>
              <th>Ngày Đặt Hàng</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((value, index) =>
                <tr key={index}>
                  <th>
                    {index + 1}
                  </th>
                  <td>
                    {value.id}
                  </td>
                  <td>
                    {value.create_date}
                  </td>
                  <td
                    onClick={() => {
                      handleClickChiTiet(value);
                    }}
                  >
                    Xem Chi Tiết
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleOrder(value.id);
                      }}
                      className={`${style.buttonSubmit}`}
                    >
                      Duyệt Đơn
                    </button>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      {isModalOpen && <ModelEdit data={modalData} closeModal={closeModal} listStatus={listStatus} isLoad={isload} />}

    </React.Fragment>
  );
}
