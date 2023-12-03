import React, { useEffect, useState } from "react";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
function OrderList() {
  const [orders, setOrders] = useState();
  const [load, isLoad] = useState(false);

  const fectAPI = () => {
    axios
      .get(`http://localhost:8080/api/order/find/account/${5}`)
      .then((response) => {
        console.log(response.data.data);
        setOrders(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fectAPI();
  }, [load]);
  const handelRemoveOrder = (id) => {
    axios
      .put(`http://localhost:8080/api/order/update/${id}/account/${5}?status=8`)
      .then((response) => {
        console.log(response.data.message);
        isLoad(!load);
      })
      .catch((error) => {
        // console.error(error);
      });
  };
  const ButtonCancel = ({ id, status }) => {
    if (status == 1) {
      return (
        <button
          style={{ border: "none", padding: 6, borderRadius: 4 }}
          onClick={() => {
            handelRemoveOrder(id);
          }}
        >
          Huỷ đặt
        </button>
      );
    }
  };
  const convertDate = (date) => {
    console.log(new Date(date));
    let fm = new Date(date).toLocaleDateString("vi-VI", { timeZone: "UTC" });
    return fm;
  };
  console.log(orders);
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-xl-12 mt-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">Đơn hàng của tôi</h5>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr className="align-self-center">
                        <th>Mã hóa đơn</th>
                        <th>Địa chỉ nhận hàng</th>
                        <th> Ngày lập</th>
                        <th> Tổng tiền</th>
                        <th>Trang thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.content.map((item) => (
                        <tr key={item.id}>
                          <td className="text-start">HD23{item.id}</td>
                          <td className="text-start">
                            {item.address.address},{item.address.ward},
                            {item.address.district},{item.address.city},
                          </td>
                          <td className="text-start">
                            {convertDate(item.create_date)}
                          </td>
                          <td className="text-start">{item.total}</td>
                          <td className="text-start">
                            <span className="badge badge-boxed bg-warning text-dark">
                              {item.status[item.status.length - 1].status.name}
                            </span>
                          </td>

                          <td>
                            {" "}
                            <a href={`/orderDetail/${item.id}`}>
                              {" "}
                              Xem chi tiết{" "}
                            </a>{" "}
                          </td>
                          <td>
                            <ButtonCancel
                              id={item.id}
                              status={
                                item?.status[item.status.length - 1].status.id
                              }
                            ></ButtonCancel>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default OrderList;
