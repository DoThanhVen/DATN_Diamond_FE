import React, { useEffect } from "react";
import style from "../../css/business/bill.module.css";
import { useState } from "react";
import { callAPI } from "../../service/API";
import { GetDataLogin } from "../../service/DataLogin";
import { ThongBao } from "../../service/ThongBao";

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
export default function ModelEdit({ data, closeModal, listStatus, isLoad }) {

  const [status, setStatus] = useState(data.status[data.status.length - 1].status.id + 1);
  const accountLogin = GetDataLogin();

  const accessToken = sessionStorage.getItem('accessToken')
  console.log(accessToken)
  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };
  const getTotal = () => {
    console.log(data)
    let total = 0;
    console.log(data.orderDetails.length)
    data.orderDetails.map((item, index) => {
      console.log(index)
      total += item.productOrder.price * item.quantity
    })

    return total
  }

  const handleChangeStatus = async (id) => {
    const response = await callAPI(`/api/auth/order/update/${id}/account/${accountLogin.id}?status=${status}`, 'PUT', {}, config);
    if (response.status == 'SUCCESS') {
      const res = await callAPI(`/api/auth/getEmailByOderId/${id}`, 'GET', {}, config);
      if (res) {
        await callAPI(`/api/auth/sendEmail/${res.data[0]}?content=Đơn hàng có mã ${id} đã được ${response.data.status.name}`, 'GET', {}, config);
      }
      isLoad = !isLoad;
      ThongBao("Duyệt đơn thành công!", "success")
      closeModal()
    }
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
              {data.status[data.status.length - 1].status.name}
            </b>
          </div>
          <div>
            {/* Người đặt: <b>Đỗ Thanh Vẹn</b> */}
          </div>
          <div className={`mb-3`}>
            Ngày đặt: <b>{data.create_date}</b>
          </div>
          <div>
            <ul>
              {
                data.status.map(item => (
                  <li>{item.create_date}: {item.status.name}</li>
                ))
              }
              <li>
              </li>
            </ul>
          </div>
          <span>Trạng thái tiếp theo: </span>
          {data.status[data.status.length - 1].status.id != 6 && data.status[data.status.length - 1].status.id != 8 && data.status[data.status.length - 1].status.id != 9 ? (
            <select className={`${style.cardModelStatus}`} onChange={
              (e) => {
                setStatus(e.target.value)
              }
            }>
              <option value={data.status[data.status.length - 1].status.id + 1}>{listStatus[data.status.length + 1].name}</option>
              {data.status[data.status.length - 1].status.id === 5 ? (
                <>
                  <option value="8">{listStatus[7].name}</option>
                  <option value="9">{listStatus[8].name}</option>
                </>
              ) : null}

            </select>
          ) : ''}
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
                  <img src={value.productOrder.image_product[0].url} />
                </div>
                <div>{value.productOrder.product_name}</div>
                <div>{formatCurrency(Number(value.productOrder.price), 0)}</div>
                <div>{value.quantity}</div>
                <span>{formatCurrency(Number(value.quantity) * Number(value.productOrder.price), 0)}</span>
              </div>
            )}
          </div>
          <div className={`mt-3`}>
            Tổng tiền:{" "}
            <b style={{ color: "red" }}>{formatCurrency(getTotal(), 0)}</b>
          </div>
          {data.status[data.status.length - 1].status.id != 6 && data.status[data.status.length - 1].status.id != 7 && data.status[data.status.length - 1].status.id != 9 && data.status[data.status.length - 1].status.id != 8 &&
            <button onClick={() => {
              handleChangeStatus(data.id)
            }} className={`btn btn-primary mt-3`}>Lưu Thay Đổi</button>}
          <button onClick={
            closeModal
          } className={`btn btn-danger mt-3`}>Đóng</button>
          <span onClick={closeModal} className={`${style.closeModal}`}>
            X
          </span>

        </div>
      </div>
    </React.Fragment>
  );
}