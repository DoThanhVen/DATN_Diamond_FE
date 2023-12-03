import React, { useEffect, useState } from "react";
import style from "../../css/business/bill.module.css";
import Nav from "react-bootstrap/Nav";
import ModelEdit from "./ModelEdit";
import axios from "axios";

const numberProductPage = 10;

export default function CanceledBill() {
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

  const [orders, setOrders] = useState([]);
  const [KeyWord, setKeyWord] = useState('');

  const fetchApi = () => {
    axios.get(`http://localhost:8080/api/order/findByStatus/8`)
      .then((reponse) => {
        if (reponse.data.status == 'SUCCESS') {
          setOrders(reponse.data.data)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
  useEffect(() => {
    fetchApi()
  }, [])
  const handleSearch = () => {
    axios.get(`http://localhost:8080/api/order/findByStatus/8`)
      .then((reponse) => {
        if (reponse.data.status == 'SUCCESS') {
          setOrders(reponse.data.data)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
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
            setKeyWord(e.target.value)
          }}
          className={`${style.inputSearch}`}
          type="text"
          placeholder={`${selectedOption ? selectedOption : "Tìm kiếm"}...`}
        ></input>
        <button onClick={handleSearch} className={`${style.buttonSearch}`}>Tìm Kiếm</button>
      </div>
      <div className={`${style.updateStatusAll} mt-4 mb-3`}>
        <div className={`${style.cardHeadingModel}`}>
          {/* {listUnpaid.length}  */}
          Đơn hàng
        </div>
      </div>
      <div className={`${style.cardContainerTable}`}>
        <table className={`table ${style.tableReturn}`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã Hóa Đơn</th>
              <th>Ngày Hủy Đơn</th>
              <th colSpan={1}></th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((value, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{value.id}</td>
                <td>{value?.status[value.status.length - 1].create_date}</td>
                <td onClick={() => {
                  handleClickChiTiet(value)
                }}>Xem Chi Tiết</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <ModelEdit data={modalData} closeModal={closeModal} />}
    </React.Fragment>
  );
}