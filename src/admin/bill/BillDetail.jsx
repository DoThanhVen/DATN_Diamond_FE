import React, { useState, useEffect } from "react";
import style from "../../css/admin/bill/billdetail.module.css";
import { Link } from "react-router-dom";

const billDetail = {
  idBill: "hoadon001",
  listShop: [
    {
      shop: {
        id: "shop001",
        shopName: "Cửa Hàng 1",
        image: "banner-left.jpg",
        listProduct: [
          {
            id: "product001",
            productName: "Áo Sơ Mi Nam",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description:
              "Áo Sơ Mi Nam Cực Quyến Rũ Không Có Món Hàng Nào Có Thể Thay Thế"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          },
          {
            id: "product001",
            productName: "Áo Sơ Mi Nam",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Sơ Mi Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          }
        ]
      }
    },
    {
      shop: {
        id: "shop002",
        shopName: "Cửa Hàng 2",
        image: "banner-left.jpg",
        listProduct: [
          {
            id: "product001",
            productName: "Áo Sơ Mi Nam",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Sơ Mi Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          }
        ]
      }
    },
    {
      shop: {
        id: "shop002",
        shopName: "Cửa Hàng 3",
        image: "banner-left.jpg",
        listProduct: [
          {
            id: "product001",
            productName: "Áo Sơ Mi Nam",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Sơ Mi Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          },
          {
            id: "product002",
            productName: "Áo Thun",
            image: "banner-right-1.jpg",
            price: 220000,
            quantity: 20,
            description: "Áo Thun Nam Cực Quyến Rũ"
          }
        ]
      }
    }
  ],
  addressOrder: {
    city: "Hồ Chí Minh",
    district: "12",
    ward: "Tô Ký",
    address: "123/23"
  },
  ship: 24000,
  status: 1,
  createDate: "21/10/2023",
  pay: false
};

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
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  useEffect(
    () => {
      let total = 0;
      billDetail.listShop.forEach(shop => {
        shop.shop.listProduct.forEach(product => {
          total += product.price * product.quantity;
        });
      });
      setTotalProductPrice(total);
    },
    [billDetail]
  );

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
                  billDetail.status === 0
                    ? "#34219E"
                    : billDetail.status === 1
                      ? "#34219E"
                      : billDetail.status === 2
                        ? "#34219E"
                        : billDetail.status === 3
                          ? "#2ECC71"
                          : billDetail.status === 4
                            ? "#2ECC71"
                            : billDetail.status === 5
                              ? "#2ECC71"
                              : billDetail.status === 6
                                ? "orange"
                                : billDetail.status === 7 ? "red" : "#E74C3C"
              }}
            >
              {billDetail.status === 0
                ? "Chờ Xác Nhận"
                : billDetail.status === 1
                  ? "Đã Xác Nhận"
                  : billDetail.status === 2
                    ? "Chuẩn Bị Hàng"
                    : billDetail.status === 3
                      ? "Đang Giao"
                      : billDetail.status === 4
                        ? "Chờ Lấy Hàng"
                        : billDetail.status === 5
                          ? "Đã Nhận"
                          : billDetail.status === 6
                            ? "Trả Hàng"
                            : billDetail.status === 7
                              ? "Đã Hủy"
                              : "Giao Thất Bại"}
            </span>
            <label className={style.createDate}>
              {billDetail.createDate}
            </label>
          </div>
          <div className={style.column}>
            <Link className={style.exit} to="/admin/bills">
              <i className="bi bi-box-arrow-left" />
            </Link>
          </div>
        </div>
        <div className={style.cardContent}>
          {billDetail.listShop.map((value, index) =>
            <React.Fragment>
              <div key={index} className={style.shop}>
                <img
                  className={style.image}
                  src={`/images/${value.shop.image}`}
                  alt="Hình Ảnh"
                />
                <label className={style.shopName}>
                  {value.shop.shopName}
                </label>
              </div>
              <div className={style.listProduct}>
                {value.shop.listProduct.map((valueProduct, indexProduct) =>
                  <div key={indexProduct} className={style.product}>
                    <img
                      className={style.image}
                      src={`/images/${valueProduct.image}`}
                      alt="Hình Ảnh"
                    />
                    <div className={style.detail}>
                      <label className={style.heading}>Chi tiết sản phẩm</label>
                      <label className={style.productName}>
                        Tên sản phẩm: {valueProduct.productName}
                      </label>
                      <label className={style.price}>
                        Giá: {valueProduct.price}
                      </label>
                      <label className={style.price}>
                        Số lượng: {valueProduct.quantity}
                      </label>
                      <label className={style.description}>
                        Mô tả: {valueProduct.description}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
          <div className={style.totalAllProduct}>
            <label> Tổng giá trị sản phẩm</label>
            <label>
              {formatCurrency(totalProductPrice, 0)}
            </label>
          </div>
          <div className={style.ship}>
            <label> Chi phí vận chuyển</label>
            <label>
              {formatCurrency(billDetail.ship, 0)}
            </label>
          </div>
          <div className={style.total}>
            <label> Tổng cộng</label>
            <label>
              {formatCurrency(billDetail.ship + totalProductPrice, 0)}
            </label>
          </div>
        </div>
      </div>
      <div className={style.other}>
        <div className={style.cardShip}>
          <label className={style.heading}>Thông tin thanh toán</label>
          <label
            className={style.statusShip}
            style={{ color: billDetail.pay ? "green" : "red" }}
          >
            {billDetail.pay ? "Đã Thanh Toán" : "Thanh Toán Khi Nhận Hàng"}
          </label>
          <label className={style.total}>
            Tổng cộng: {formatCurrency(billDetail.ship + totalProductPrice, 0)}
          </label>
        </div>
        <div className={style.cardAddress}>
          <label className={style.heading}>Địa chỉ nhận hàng</label>
          <label className={style.detailAddress}>
            Thành phố: {billDetail.addressOrder.city}
          </label>
          <label className={style.detailAddress}>
            Quận: {billDetail.addressOrder.district}
          </label>
          <label className={style.detailAddress}>
            Đường: {billDetail.addressOrder.ward}
          </label>
          <label className={style.detailAddress}>
            Địa chỉ: {billDetail.addressOrder.address}
          </label>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BillDetail;
