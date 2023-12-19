import React from 'react';
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { GetDataLogin } from '../../service/DataLogin';
import { callAPI } from '../../service/API';
import moment from 'moment';
import { formatCurrency } from '../../service/format'
function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function OrderReceipt() {
  const { id } = useParams();
  const [order, setOrder] = useState();

  const accountLogin = GetDataLogin();
  const accessToken = sessionStorage.getItem('accessToken')

  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };
  const fectAPI = async () => {
    const response = await callAPI(`/api/auth/order/id/${id}`, 'GET', {}, config);
    setOrder(response.data)
  }
  useEffect(() => {
    fectAPI();
  }, [])
  console.log(order)
  return (
    <>
      <nav >
        <MainNavbar />
      </nav>
      <div className="container-fluid mt-2">
        <div className="container">
          {/* Title */}
          <div className="d-flex justify-content-between align-items-center py-3">
            <h2 className="h5 mb-0"><a href="#" className="text-muted"></a> Chi tiết đơn hàng</h2>
          </div>

          {/* Main content */}
          <div className="row">
            <div className="col-lg-8">
              {/* Details */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="mb-3 d-flex justify-content-between">
                    <div>
                      <span className="me-3">{formatDate(order?.create_date)}</span>
                      <span className="me-3">HD23{order?.id}</span>
                      {/* <span className="me-3">Visa -1234</span> */}
                      {/* <span className="badge rounded-pill bg-info">{order.status[order.status.length - 1].status.name}</span> */}
                    </div>
                    <div className="d-flex">
                      {/* <button className="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i className="bi bi-download"></i> <span className="text">Invoice</span></button> */}
                      <div className="dropdown">
                        <button className="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><a className="dropdown-item" href="#"><i className="bi bi-pencil"></i> Edit</a></li>
                          <li><a className="dropdown-item" href="#"><i className="bi bi-printer"></i> Print</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {order?.orderDetails?.map((item, index) => (
                    <table className="table table-borderless">
                      <tbody>

                        <tr key={index}>
                          <td>
                            <div className="d-flex mb-2">
                              <div className="flex-shrink-0">
                                <img src={item?.productOrder?.image_product[0].url} style={{ width: '80px', height: '80px' }} alt="" width="35" className="img-fluid" />
                              </div>
                              <div className="flex-lg-grow-1 ms-3">
                                <h6 className="small mb-0 text-start">{item.productOrder.product_name}</h6>
                                {/* <h6 className="small mt-2 text-start">Màu: Black</h6> */}
                                <h6 className="small mt-2 text-start">Số lượng: {item.quantity}</h6>
                              </div>
                            </div>
                          </td>
                          <td className="text-end">Giá : {formatCurrency(item.productOrder.price, 0)}</td>
                        </tr>

                      </tbody>
                      <tfoot>

                        {/* <tr>
                        <td colSpan="2" className='text-start'>Phí vận chuyển</td>
                        <td className="text-end">$20.00</td>
                      </tr> 
                      <tr>
                        <td colSpan="2" className='text-start'>Giảm giá</td>
                        <td className="text-danger text-end">-$10.00</td>
                      </tr>*/}
                        <tr className="fw-bold">
                          <td colSpan="2" className='text-start'>Tổng cộng</td>
                          <td className="text-end">${formatCurrency(item.quantity * item.productOrder.price, 0)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  ))}
                </div>
              </div>
              {/* Payment */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <h3 className="h6">Thông tin thanh toán</h3>
                      <p><br />
                        Tổng cộng: {formatCurrency(Number(order?.total), 0)} <span className="badge bg-success rounded-pill">Thanh toán tiền mặt</span></p>
                    </div>
                    <div className="col-lg-6">
                      <h3 className="h6">Địa chỉ thanh toán</h3>
                      <address>
                        {
                          order?.address_order
                        /* <strong>{order?.address.name}</strong><br />
                        {order?.address.address}, {order?.address.ward}, {order?.address.district},<br />
                        {order?.address.city}<br /> */}
                        {/* <abbr title="Phone">P:</abbr> {order?.address.phone} */}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              {/* Customer Notes */}
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="h6">Ghi chú</h3>
                  <p></p>
                </div>
              </div>
              <div className="card mb-4">
                {/* Shipping information */}
                <div className="card-body">
                  <h3 className="h6">Thông tin vận chuyển</h3>
                  <strong>FedEx</strong>
                  <span><a href="#" className="text-decoration-underline" target="_blank">FF1234567890</a> <i className="bi bi-box-arrow-up-right"></i> </span>
                  <hr />
                  <h3 className="h6">Trạng thái</h3>
                  {order?.status.map((item) => (
                    <address>
                      {formatDate(item.create_date)} : {item.status.name}
                    </address>
                  ))}
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

export default OrderReceipt;
