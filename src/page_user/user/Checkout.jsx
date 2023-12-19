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
import { ThongBao } from "../../service/ThongBao";
import style from "../css/user/checkout.module.css";
import listDataAddress from "../../service/AddressVietNam.json"

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

const CheckoutForm = () => {
  // const [user, setUser] = useState();
  const [addressDefault, setAddressDefault] = useState(null);
  const cart = useSelector(cartSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accountLogin, setAccountLogin] = useState(null);
  const [token, settoken] = useState(null);
  const [shop, setshop] = useState(null);
  const [pay, setPay] = useState(false)
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    const accessToken = sessionStorage.getItem("accessToken");
    settoken(accessToken);
    if (accountLogin !== undefined) {
      try {
        setAccountLogin(accountLogin);
        findAccount(accountLogin.id);
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
    const response = await callAPI(`/api/account/${id}/address`, "GET");
    setAddressDefault(response.data);
  };

  let orderDetails = [];
  let amount = 0;
  cart.map((item) => {
    amount += item.product.price * item.quantity;
    orderDetails.push({
      productOrder: item.product,
      quantity: item.quantity
    });
  });


  const dataOrder = {
    name: addressDefault?.name,
    phone: addressDefault?.phone,
    address: addressDefault?.address,
    ward: addressDefault?.ward,
    city: addressDefault?.city, 
    district: addressDefault?.district
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressDefault == null) {
      ThongBao("Bạn cần thêm thông tin người nhận hàng", "error");
      navigate("/profile");
      return;
    }
    let order = {
      // accountOrder: user,
      orderDetails: orderDetails,
      total: amount,
      address_order: JSON.stringify(dataOrder)
    };

    if (pay) {
      let data = JSON.stringify(order)
      localStorage.setItem('order', data);
      localStorage.setItem('idA', accountLogin.id);
      navigate(`/pay?price=${amount}`)
      return;
    }else {
      console.log("1")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      const response = await callAPI(
        `/api/auth/order/create/account/${accountLogin.id}`,
        "POST",
        order,
        config
      );
      if (response.status === "SUCCESS") {
        dispatch(cartSilce.actions.removeAll());
        ThongBao("Đặt hàng thành công", "success");
        navigation("/order");
      }
    }
    
  };
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div>
        <div className={style.container}>
          <div className={style.content}>
            <form>
              <div className="card">
                <div className="card-body">
                  <ol className="activity-checkout mb-0 px-4 mt-3">
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
                                    {addressDefault == null ? (
                                      <div className=" p-3">
                                        <span>
                                          Bạn chưa có địa chỉ giao hàng, vui
                                          lòng thêm địa chỉ giao hàng!
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="card-radio text-truncate p-3">
                                        <span className="fs-14 mb-4 d-block" style={{ fontWeight: "600" }}>
                                          Địa chỉ
                                        </span>
                                        <span className="text-muted fw-normal text-wrap mb-1 d-block">
                                          {listDataAddress.map((valueCity, index) =>
                                            valueCity.codename === addressDefault?.city
                                              ? valueCity.districts.map((valueDistrict, index) =>
                                                valueDistrict.codename === addressDefault?.district
                                                  ? valueDistrict.wards.map((valueWard, index) =>
                                                    valueWard.codename === addressDefault?.ward ? (
                                                      <div className={style.value}>
                                                        {valueCity?.name}, {valueDistrict?.name},{" "}
                                                        {valueWard?.name}, {addressDefault?.address}
                                                      </div>
                                                    ) : null
                                                  )
                                                  : null
                                              )
                                              : null
                                          )}
                                        </span>
                                        <span className="text-muted d-block" style={{ fontWeight: "600" }}>
                                          {addressDefault?.phone} - {addressDefault?.name}
                                        </span>
                                      </div>
                                    )}
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
                              <div className="d-flex">
                                <label className="card-radio-label">
                                  <input
                                    type="radio"
                                    name="pay-method"
                                    id="pay-methodoption2"
                                    className="card-radio-input"
                                    onClick={() => setPay(false)}
                                  />
                                  <span
                                    className="card-radio py-3 text-center text-truncate"
                                    style={{ width: "210px" }}
                                  >
                                    <i className="bi bi-truck d-block h2 mb-3"></i>
                                    Thanh toán khi nhận hàng
                                  </span>
                                </label>
                                <label className="card-radio-label ms-3 " onClick={() => { setPay(true) }}>
                                  <input
                                    type="radio"
                                    name="pay-method"
                                    id="pay-methodoption2"
                                    className="card-radio-input"
                                  />
                                  <span
                                    className="card-radio py-3 text-center text-truncate"
                                    style={{ width: "210px" }}
                                  >
                                    <i className="bx bx-money d-block h2 mb-3"></i>
                                    Thanh toán Online
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
          <div className={style.info_order}>
            <div className="card checkout-order-summary">
              <div>
                <div className="p-3 bg-light mb-3">
                  <h5 className="font-size-16 mb-0">Tóm tắt giỏ hàng </h5>
                </div>
                <div>
                  <table className={style.table}>
                    <thead className={style.table_heading}>
                      <tr>
                        <th className={style.column}>Sản phẩm</th>
                        <th className={style.column}>Mô tả sản phẩm</th>
                        <th className={style.column}>Giá</th>
                      </tr>
                    </thead>
                    <tbody className={style.table_body}>
                      {cart.map((item, index) => (
                        <tr>
                          <td className={style.column}>
                            <label className={style.product_name}>
                              {item.product.product_name}
                            </label>
                            <img
                              src={item.product.image_product[0].url}
                              alt="product-img"
                              title="product-img"
                              className={style.image}
                            />
                          </td>
                          <td className={style.column}>
                            {
                              item.product.categoryItem_product
                                .type_category_item
                            }
                          </td>
                          <td className={style.column}>
                            <label className={style.quantity}>
                              {item.quantity}
                            </label>
                            <span>x</span>
                            <label className={style.price}>
                              {formatCurrency(item.product.price, 0)}
                            </label>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td className={style.column}>Phí vận chuyển:</td>
                        <td className={style.column}></td>
                        <td className={style.column}>
                          {" "}
                          {formatCurrency(0, 0)}
                        </td>
                      </tr>

                      <tr className="bg-light">
                        <td className={style.column}>Tổng cộng:</td>
                        <td className={style.column}></td>
                        <td className={style.column}>
                          {formatCurrency(amount, 0)}
                        </td>
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
