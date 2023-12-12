import React from "react";
import "../css/user/checkout.css";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector } from "../../actions/actions";
import cartSilce from "../../Reducer/cartSilce";
import axios from "axios";
import { useNavigate } from "react-router";
import { GetDataLogin } from "../../service/DataLogin";
import { callAPI } from "../../service/API";

const CheckoutForm = () => {
  // const [user, setUser] = useState();
  const [addressDefault, setAddressDefault] = useState();
  const cart = useSelector(cartSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountLogin, setAccountLogin] = useState(null);
  const [token, settoken] = useState(null);
  const [shop, setshop] = useState(null);

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    const accessToken=sessionStorage.getItem('accessToken')
    settoken(accessToken)
    if (accountLogin !== undefined) {
      try {
        setAccountLogin(accountLogin);
        findAccount(accountLogin.id)
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };
  const navigation = useNavigate();

  useEffect(() => {
    getAccountFromSession();
  }, []);

  const findAccount = async (id) => {
    axios
      .get(`http://localhost:8080/api/account/${id}/address`)
      .then((response) => {
        setAddressDefault(response.data.data);
      })
      .catch((error) => {
        console.error("Error loading shop data:", error);
      });
  }

  let orderDetails = [];
  let amount = 0;
  cart.map((item) => {
    amount += item.product.price * item.quantity;
    orderDetails.push({
      productOrder: item.product,
      quantity: item.quantity,
    });
  });
  const handleSubmit =async (e) => {
    e.preventDefault();
    let order = {
      // accountOrder: user,
      orderDetails: orderDetails,
      total: amount,
      address_order: JSON.stringify(addressDefault),
    };
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
     const response= await callAPI(`/api/auth/order/create/account/${accountLogin.id}`,'POST', order,config);
     console.log(response)
        if (response.status === "SUCCESS") {
          dispatch(cartSilce.actions.removeAll());
          alert("Đặt hàng thành công");
          navigation("/order");
        }

  };
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-xl-8">
            <form>
              <div className="card">
                <div className="card-body">
                  <ol className="activity-checkout mb-0 px-4 mt-3">
                    {/* <li className="checkout-item">
                      <div className="avatar checkout-icon p-1">
                        <div className="avatar-title rounded-circle bg-primary">
                          <i className="bx bxs-receipt text-white font-size-20"></i>
                        </div>
                      </div>
                      <div className="feed-item-list">
                        <div>
                          <h5 className="font-size-16 mb-1">
                            Thông tin thanh toán
                          </h5>
                          <p className="text-muted text-truncate mb-4">
                            Vui lòng điền đầy đủ tất cả thông tin bên dưới
                          </p>
                          <div className="mb-3">
                            <div>
                              <div className="row">
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label
                                      className="form-label"
                                      htmlFor="billing-name"
                                    >
                                      Tên
                                    </label>
                                    <input
                                      type="text"

                                      className="form-control"
                                      id="billing-name"
                                      placeholder="Vui lòng nhập tên"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label
                                      className="form-label"
                                      htmlFor="billing-email-address"
                                    >
                                      Địa chỉ email
                                    </label>
                                    <input

                                      type="email"
                                      className="form-control"
                                      id="billing-email-address"
                                      placeholder="Vui lòng nhập email"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label
                                      className="form-label"
                                      htmlFor="billing-phone"
                                    >
                                      Số điện thoại
                                    </label>
                                    <input

                                      type="text"
                                      className="form-control"
                                      id="billing-phone"
                                      placeholder="Vui lòng nhập số điện thoại"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label
                                  className="form-label"
                                  htmlFor="billing-address"
                                >
                                  Địa chỉ
                                </label>
                                <textarea
                                  className="form-control"
                                  id="billing-address"
                                  rows="3"
                                  placeholder="Vui lòng nhập đầy đủ địa chỉ"
                                ></textarea>
                              </div>

                               <div className="row">
                                  <div className="col-lg-4">
                                    <div className="mb-4 mb-lg-0">
                                      <label className="form-label">Country</label>
                                      <select className="form-control form-select" title="Country">
                                        <option value="0">Select Country</option>
                                        <option value="AF">Afghanistan</option>
                                        <option value="AL">Albania</option>
                                        <option value="DZ">Algeria</option>
                                        <option value="AS">American Samoa</option>
                                        <option value="AD">Andorra</option>
                                        <option value="AO">Angola</option>
                                        <option value="AI">Anguilla</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <div className="mb-4 mb-lg-0">
                                      <label className="form-label" htmlFor="billing-city">City</label>
                                      <input type="text" className="form-control" id="billing-city" placeholder="Enter City" />
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <div className="mb-0">
                                      <label className="form-label" htmlFor="zip-code">Zip / Postal code</label>
                                      <input type="text" className="form-control" id="zip-code" placeholder="Enter Postal code" />
                                    </div>
                                  </div>
                                </div> 
                            </div>

                          </div>
                        </div>
                      </div>
                    </li>*/}
                    <li className="checkout-item">
                      <div className="avatar checkout-icon p-1">
                        <div className="avatar-title rounded-circle bg-primary">
                          <i className="bx bxs-truck text-white font-size-20"></i>
                        </div>
                      </div>
                      <div className="feed-item-list">
                        <div>
                          <h5 className="font-size-16 mb-1">
                            Thông tin vận chuyển
                          </h5>
                          <p className="text-muted text-truncate mb-4">
                            Vui lòng chọn địa chỉ bạn muốn giao hàng đến
                          </p>
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-lg-4 col-sm-6">
                                <div>
                                  <label className="card-radio-label mb-0">
                                    <input
                                      type="radio"
                                      name="address"
                                      id="info-address2"
                                      className="card-radio-input"
                                    />
                                    <div className="card-radio text-truncate p-3">
                                      <span className="fs-14 mb-4 d-block">
                                        Địa chỉ
                                      </span>
                                      <span className="fs-14 mb-2 d-block">
                                        {addressDefault?.name}
                                      </span>
                                      <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                        {addressDefault?.address} ,{" "}
                                        {addressDefault?.ward} ,{" "}
                                        {addressDefault?.district} ,
                                        {addressDefault?.city}
                                      </span>
                                      <span className="text-muted fw-normal d-block">
                                        {addressDefault?.phone}
                                      </span>
                                    </div>
                                  </label>
                                  <div className="edit-btn bg-light  rounded">
                                    <a
                                      href="#"
                                      data-bs-toggle="tooltip"
                                      data-placement="top"
                                      title=""
                                      data-bs-original-title="Edit"
                                    >
                                      <i className="bx bx-pencil font-size-16"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="checkout-item">
                      <div className="avatar checkout-icon p-1">
                        <div className="avatar-title rounded-circle bg-primary">
                          <i className="bx bxs-wallet-alt text-white font-size-20"></i>
                        </div>
                      </div>
                      <div className="feed-item-list">
                        <div>
                          <h5 className="font-size-16 mb-1">
                            Thông tin thanh toán
                          </h5>
                        </div>
                        <div>
                          <p className="text-muted text-truncate mb-4">
                            Phương thức thanh toán
                          </p>
                          <div className="row">
                            <div className="col-lg-3 col-sm-6">
                              <div>
                                <label className="card-radio-label">
                                  <input
                                    type="radio"
                                    name="pay-method"
                                    id="pay-methodoption2"
                                    className="card-radio-input"
                                  />
                                  <span className="card-radio py-3 text-center text-truncate">
                                    <i className="bx bx-money d-block h2 mb-3"></i>
                                    Cash on Delivery
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row my-4">
                <div className="col">
                  <a href="/" className="btn btn-link text-muted">
                    <i className="fa-solid fa-arrow-left me-1"></i> Tiếp tục mua
                    sắm{" "}
                  </a>
                </div>
                <div className="col">
                  <div className="text-end mt-2 mt-sm-0">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="btn btn-success"
                    >
                      <i className="fa-solid fa-cart-shopping me-1"></i> Thanh
                      toán{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-xl-4">
            <div className="card checkout-order-summary">
              <div className="card-body">
                <div className="p-3 bg-light mb-3">
                  <h5 className="font-size-16 mb-0">
                    Tóm tắt giỏ hàng{" "}
                    <span className="float-end ms-2">#MN0124</span>
                  </h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-centered mb-0 table-nowrap">
                    <thead>
                      <tr>
                        <th
                          className="border-top-0"
                          style={{ width: "110px" }}
                          scope="col"
                        >
                          Sản phẩm
                        </th>
                        <th className="border-top-0" scope="col">
                          Mô tả sản phẩm
                        </th>
                        <th className="border-top-0" scope="col">
                          Giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, index) => (
                        <tr>
                          <th scope="row">
                            <img
                              src={`http://localhost:8080/api/uploadImageProduct/${item.product.image_product[0].url}`}
                              style={{ width: "80px", height: "80px" }}
                              alt="product-img"
                              title="product-img"
                              className="avatar-lg rounded"
                            />
                          </th>
                          <td>
                            <h5 className="font-size-16 text-truncate">
                              <a href="#" className="text-dark">
                                {item.product.product_name}
                              </a>
                            </h5>
                            <p className="text-muted mb-0">
                              <i className="bx bxs-star text-warning"></i>
                              <i className="bx bxs-star text-warning"></i>
                              <i className="bx bxs-star text-warning"></i>
                              <i className="bx bxs-star text-warning"></i>
                              <i className="bx bxs-star-half text-warning"></i>
                            </p>
                            <p className="text-muted mb-0 mt-1">
                              {item.product.price} x {item.quantity}
                            </p>
                          </td>
                          <td>$ {item.product.price * item.quantity}</td>
                        </tr>
                      ))}

                      {/* <tr>
                        <th scope="row">
                          <img
                            src="images/best-saler-1.jpg"
                            style={{ width: "80px", height: "80px" }}
                            alt="product-img"
                            title="product-img"
                            className="avatar-lg rounded"
                          />
                        </th>
                        <td>
                          <h5 className="font-size-16 text-truncate">
                            <a href="#" className="text-dark">
                              Smartphone Dual Camera
                            </a>
                          </h5>
                          <p className="text-muted mb-0">
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                            <i className="bx bxs-star text-warning"></i>
                          </p>
                          <p className="text-muted mb-0 mt-1">$ 260 x 1</p>
                        </td>
                        <td>$ 260</td>
                      </tr> */}

                      <tr>
                        <td colSpan="2">
                          <p className="font-size-4 text-start">Giảm giá :</p>
                        </td>
                        <td>- $ 0</td>
                      </tr>

                      <tr>
                        <td colSpan="2">
                          <p className="font-size-4 text-start">
                            Phí vận chuyển :
                          </p>
                        </td>
                        <td>$ 0</td>
                      </tr>

                      <tr className="bg-light">
                        <td colSpan="2">
                          <p className="font-size-4 text-start">Tổng cộng:</p>
                        </td>
                        <td>$ {amount}</td>
                      </tr>
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
};

export default CheckoutForm;
