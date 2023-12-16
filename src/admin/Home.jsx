import moment from "moment";
import React, { useEffect, useState } from "react";
import style from "../css/admin/home.module.css";
import { callAPI } from "../service/API";
import LoadingOverlay from "../service/loadingOverlay";

function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}

function Home() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getDataProducts();
    getDataShop();
    getDataAccounts();
    getDataOrders();
  }, []);

  const countProduct = (status) => {
    const amount = products.filter(product => product.status === status); // Giả sử có trường 'isActive' để xác định sản phẩm có đang hoạt động hay không
    return amount.length;
  }
  const countShop = (status) => {
    const amount = shops.filter(shops => shops.status === status); // Giả sử có trường 'isActive' để xác định sản phẩm có đang hoạt động hay không
    return amount.length;
  }
  const countAccount = (status) => {
    const amount = accounts.filter(accounts => accounts.status === status); // Giả sử có trường 'isActive' để xác định sản phẩm có đang hoạt động hay không
    return amount.length;
  }

  const getDataProducts = async () => {
    try {
      setIsLoading(true)
      const response = await callAPI(
        `/api/product/getAll?key=&keyword=&offset=0&sizePage=1000000&sort=&sortType=&status=`,
        "GET"
      );
      if(response){
        setProducts(response.data.content || []);
        setIsLoading(false)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getDataAccounts = async (page) => {
    try {
      const response = await callAPI(
        `/api/account/findAll`,
        "GET"
      );
      setAccounts(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getDataOrders = async () => {
    const token = sessionStorage.getItem('accessToken');
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
      const response = await callAPI(`/api/auth/order/getAllList`, "GET", {}, config);
      setOrders(response.data)
    } catch (error) {

    }
  }
  const getDataShop = async () => {
    const response = await callAPI("/api/shop/findAll", "GET")
    if (response) {
      setShops(response.data)
    }
  }

  return (
    <React.Fragment>
      <div className={style.card_info}>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-bag ${style.icon_edit}`}></i>
          </label>
          <div className={style.total}>
            <label className={style.label}>Tổng số sản phẩm</label>
            <label className={style.amount}>{products ? products.length : 0}</label>
          </div>
          <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Chờ phê duyệt</label>
              <label className={style.amount}>{countProduct(0)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>{countProduct(1)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Dừng hoạt động</label>
              <label className={style.amount}>{countProduct(2)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>{countProduct(3)}</label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-shop  ${style.icon_edit}`}></i>
          </label>
          <div className={style.total}>
            <label className={style.label}>Số lượng gian hàng</label>
            <label className={style.amount}>{shops ? shops.length : 0}</label></div>
          <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Chờ phê duyệt</label>
              <label className={style.amount}>{countShop(0)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>{countShop(1)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>{countShop(2)}</label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-person-circle ${style.icon_edit}`}></i>
          </label>
          <div className={style.total}>
            <label className={style.label}>Số lượng tài khoản</label>
            <label className={style.amount}>{accounts ? accounts.length : 0}</label></div>
            <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>{countAccount(true)}</label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>{countAccount(false)}</label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-receipt-cutoff ${style.icon_edit}`}></i>
          </label>
          <div className={style.total}>

            <label className={style.label}>Số lượng đơn hàng</label>
            <label className={style.amount}>{orders ? orders.length : 0}</label></div>
        </div>
      </div>
      <div className={style.listProduct}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>TOP 10 SẢN PHẨM BÁN CHẠY</label>
          </div>
        </div>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>Mã SP</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên SP</label>
            <label className={style.column}>Loại SP</label>
            <label className={style.column}>Giá SP</label>
            <label className={style.column}>Ngày tạo</label>
          </div>
          {products.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {value.image_product != null ? (
                  <img
                    key={value.image_product[0].id}
                    className={style.image}
                    src={`${value.image_product[0].url}`}
                    alt="Hình Ảnh"
                  />
                ) : (
                  <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  />
                )}
              </label>
              <label className={style.column}>{value.product_name}</label>
              <label className={style.column}>
                {value.categoryItem_product?.type_category_item}
              </label>
              <label className={style.column}>
                {formatCurrency(value.price, 0)}
              </label>
              <label className={style.column}>
                {formatDate(value.create_date)}
              </label>
            </div>
          ))}
        </div>
      </div>
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}

export default Home;
