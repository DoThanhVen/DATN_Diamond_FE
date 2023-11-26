import React from "react";
import style from "../../css/business/bill.module.css";
import { da } from "date-fns/locale";
import { useState } from "react";
import axios from "axios";

//CHUYỂN ĐỔI TIỀN TỆ
function formatCurrency(price, promotion) {
  console.log(price)
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}
export default function ModelEdit({ data, closeModal }) {
  
  const [status, setStatus] = useState();
  const getTotal = () => {
    console.log(data)
    let total = 0;
    console.log(data.orderDetails.length)
    data.orderDetails.map((item,index) => {
      console.log(index)
      total += item.productOrder.price * item.quantity
    })
    
    return total
  }
  const handleChangeStatus = (id) => {
    console.log('id: ',id)
    axios.put(`http://localhost:8080/api/order/update/${id}/account/5?status=${status}`)
      .then((reponse) => {
        if (reponse.data.status == 'SUCCESS') {
          alert("success")
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
  return (
    <React.Fragment>
      <div className={`${style.formCardModel}`}>
        <div className={`${style.cardModel}`}>
          <div className={`${style.cardHeadingModel}`}>Chi tiết đơn hàng</div>
          <label className={`mt-3`}>
            Mã hóa đơn: <b>{data.id}</b>
          </label>
          <div>
            Trạng thái:{" "}
            <b>
              {data.status[data.status.length -1 ].status.id == "1"
                ? "Chờ Xác Nhận"
                : data.status[data.status.length -1 ].status.id == "2"
                ? "Đã Xác Nhận"
                : data.status[data.status.length -1 ].status.id == "3"
                ? "Chuẩn Bị Hàng"
                : data.status[data.status.length -1 ].status.id == "4"
                ? "Đang Giao"
                : data.status[data.status.length -1 ].status.id == "5"
                ? "Chờ Lấy Hàng"
                : data.status[data.status.length -1 ].status.id == "6"
                ? "Đã Nhận"
                : data.status[data.status.length -1 ].status.id == "7"
                ? "Trả Hàng"
                : data.status[data.status.length -1 ].status.id == "8"
                ? "Đã Hủy"
                : "Giao Thất Bại"}
            </b>
          </div>
          <div>
            {/* Người đặt: <b>Đỗ Thanh Vẹn</b> */}
          </div>
          <div className={`mb-3`}>
            Ngày đặt: <b>{data.create_date}</b>
          </div>
          {data.status[data.status.length -1 ].status.id !== "4" && data.status[data.status.length -1 ].status.id !== "5" ? (
            <select className={`${style.cardModelStatus}`} onChange={
              (e) => {
                setStatus(e.target.value)
              }
            }>
              <option></option>
              <option value="0">Chờ Xác Nhận</option>
              <option value="1">Đã Xác Nhận</option>
              <option value="2">Chuẩn Bị Hàng</option>
              <option value="3">Đang Giao</option>
              <option value="4">Chờ Lấy Hàng</option>
              <option value="5">Đã Nhận</option>
              <option value="6">Trả Hàng</option>
              <option value="7">Đã Hủy</option>
              <option value="8">Giao Không Thành Công</option>
            </select>
          ) : null}
          <div className={`${style.cardModelListProducts}`}>
            <div className={`${style.cardModelProduct}`}>
              <span>#</span>
              <div>Hình Ảnh</div>
              <div>Tên Sản Phẩm</div>
              <div>Giá</div>

              <div>SL</div>
              <span>Thành Tiền</span>
            </div>
            {data?.orderDetails.map((value, index) =>
                <div key={index} className={`${style.cardModelProduct}`}>
                  <span>{index + 1}</span>
                  <div>
                    <img src={`http://localhost:8080/api/uploadImageProduct/${value.productOrder.image_product[0].url}`}></img>
                  </div>
                  <div>{value.productOrder.product_name}</div>
                  <div>{formatCurrency(Number(value.productOrder.price),0)}</div>
                  <div>{value.quantity}</div>
                  <span>{formatCurrency(Number(value.quantity) * Number(value.productOrder.price), 0)}</span>
                </div>
            )}
          </div>
          <div className={`mt-3`}>
            Tổng tiền:{" "}
            <b style={{ color: "red" }}>{formatCurrency(getTotal(), 0)}</b>
          </div>
          <button onClick={() => {
            handleChangeStatus(data.id)
          }} className={`btn btn-primary mt-3`}>LƯU THAY ĐỔI</button>
          <span onClick={closeModal} className={`${style.closeModal}`}>
            X
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}