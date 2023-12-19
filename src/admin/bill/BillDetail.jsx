import React, { useState, useEffect } from "react";
import style from "../../css/admin/bill/billdetail.module.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { callAPI } from "../../service/API";
import { GetDataLogin } from "../../service/DataLogin";
import listDataAddress from "../../service/AddressVietNam.json";
import moment from "moment";

function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}


//CHUYỂN ĐỔI TIỀN TỆ
function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function BillDetail() {
  const [address, setAddress] = useState()
  const [order, setOrder] = useState();
  const [shop, setShop] = useState([]);
  const accountLogin = GetDataLogin();
  const accessToken = sessionStorage.getItem('accessToken')
  const location = useLocation();
  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };
  const fetchAPI = async () => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id !== '') {
      const response = await callAPI(`/api/auth/order/find/${id}`, 'GET', {}, config)
      const responseOrder = await callAPI(`/api/auth/order/id/${id}`, 'GET', {}, config)

      setShop(response.data)
      setOrder(responseOrder.data)
      setAddress(JSON.parse(responseOrder.data.address_order.replace(/\\/g, '')))
    }
    else {
      return;
    }
  }
  useEffect(() => {
    fetchAPI()
  }, []);

  const uniqueArray = Array.from(new Set(shop.map(item => item.id)))
    .map(id => {
      return shop.find(item => item.id === id);
    });

  return (
    <React.Fragment>
      <div className={style.header}>
        <div className={style.formSearch}>
          <i className={`bi bi-search ${style.icon}`} />
          <input
            className={style.input}
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>
        <i className={`bi bi-person-circle ${style.iconUser}`} />
      </div>
      <div className={style.cardDetail}>
        <div className={style.header}>
          <div className={style.column}>
            <span
              className={style.status}
              style={{
                backgroundColor:
                  order?.status[order?.status.length - 1].status.id === 0
                    ? "#34219E"
                    : order?.status[order?.status.length - 1].status.id === 1
                      ? "#34219E"
                      : order?.status[order?.status.length - 1].status.id === 2
                        ? "#34219E"
                        : order?.status[order?.status.length - 1].status.id === 3
                          ? "#2ECC71"
                          : order?.status[order?.status.length - 1].status.id === 4
                            ? "#2ECC71"
                            : order?.status[order?.status.length - 1].status.id === 5
                              ? "#2ECC71"
                              : order?.status[order?.status.length - 1].status.id === 6
                                ? "orange"
                                : order?.status[order?.status.length - 1].status.id === 7 ? "red" : "#E74C3C"
              }}
            >
              {order?.status[order?.status.length - 1].status.name}
            </span>
            <label className={style.createDate}>
              {formatDate(order?.create_date)}
            </label>
          </div>
          <div className={style.column}>
            <Link className={style.exit} to="/admin/bills">
              <i className="bi bi-box-arrow-left" />
            </Link>
          </div>
        </div>
        {uniqueArray?.map((item) => (
          <div key={item.id}>
            <div className={style.cardContent}>

              <div className={style.shop}>
                <img
                  className={style.image}
                  src={item?.image}
                  alt="Hình Ảnh"
                />
                <label className={style.shopName}>
                  {item?.shop_name}
                </label>
              </div>
              {item?.products?.map((valueProduct, indexProduct) => (
                order.orderDetails.map((valueOrder, index) => (
                  valueProduct.id === valueOrder.productOrder.id ?
                    (
                      <>
                        <div className={style.listProduct}>
                          <div key={indexProduct} className={style.product}>
                            <img
                              className={style.image}
                              src={valueOrder.productOrder.image_product[0].url}
                              alt="Hình Ảnh"
                            />
                            <div className={style.detail}>
                              <label className={style.heading}>Chi tiết sản phẩm</label>
                              <label className={style.productName}>
                                Tên sản phẩm: {valueOrder.productOrder.product_name}
                              </label>
                              <label className={style.price}>
                                Giá:  {formatCurrency(valueOrder.productOrder.price, 0)}
                              </label>
                              <label className={style.price}>
                                Số lượng: {valueOrder?.quantity}
                              </label>

                            </div>
                          </div>
                        </div>
                        <div className={`${style.totalAllProduct} mb-2`}>
                          <label> Tổng giá trị sản phẩm</label>
                          <label>
                            {formatCurrency(valueOrder.productOrder.price * valueOrder.quantity, 0)}
                          </label>
                        </div>
                      </>
                    ) : null
                )
                )
              )
              )}
            </div>
          </div>
        ))}
        <div className={`${style.ship} mt-4 d-flex justify-content-between`}>
          <label> Chi phí vận chuyển</label>
          <label>
            {formatCurrency(0, 0)}
          </label>
        </div>
        <div className={`${style.total} d-flex justify-content-between`}>
          <label>Tổng cộng</label>
          <label>
            {formatCurrency(order?.total, 0)}
          </label>
        </div>
      </div>
      <div className={style.other}>
        <div className={style.cardShip}>
          <label className={style.heading}>Thông tin thanh toán</label>
          <label
            className={style.statusShip}
            style={{ color: order?.pay ? "green" : "red" }}
          >
            {order?.pay ? "Đã Thanh Toán" : "Thanh Toán Khi Nhận Hàng"}
          </label>
          <label className={style.total}>
            Tổng cộng: {formatCurrency(order?.total, 0)}
          </label>
        </div>
        <div className={style.cardAddress}>
          <label className={style.heading}>Thông tin nhận hàng</label>
          <label className={style.detailAddress}>
            {
              listDataAddress.map((valueCity, index) =>
                valueCity.codename === address?.city
                  ? valueCity.districts.map((valueDistrict, index) =>
                    valueDistrict.codename === address?.district
                      ? valueDistrict.wards.map((valueWard, index) =>
                        valueWard.codename === address?.ward ? (

                          <div className={style.value}>
                            {address.phone} - {address.name}, {valueCity.name}, {valueDistrict.name},{" "}
                            {valueWard.name}, {address.address}
                          </div>
                        ) : null
                      ) : null
                  )
                  : null
              )}
          </label>

        </div>
      </div>
    </React.Fragment>
  );
}

export default BillDetail;
