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
  const [product, setProduct] = useState();
  const [account, setAccount] = useState();
  const [order, setOrder] = useState();
  const [shop, setShop] = useState();
  const [top10, setTop10] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    getDataProducts();
    getDataShop();
    getDataAccounts();
    getDataOrders();
    getTop10();
  }, []);

  const getDataProducts = async () => {
    try {
      setIsLoading(true)
      const response = await callAPI(`/api/admin/thongke/product`, "GET");
      setIsLoading(false)
      if (response) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getDataAccounts = async page => {
    try {
      setIsLoading(true)
      const response = await callAPI(`/api/admin/thongke/account`, "GET");
      setIsLoading(false)
      if (response) {
        setAccount(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getDataOrders = async () => {
    try {
      setIsLoading(true)
      const response = await callAPI(`/api/admin/thongke/order`, "GET");
      setIsLoading(false)
      if (response) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getDataShop = async () => {
    try {
      setIsLoading(true)
      const response = await callAPI(`/api/admin/thongke/shop`, "GET");
      setIsLoading(false)
      if (response) {
        setShop(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getTop10 = async () => {
    try {
      setIsLoading(true)
      const response = await callAPI(`/api/admin/thongke/top10`, "GET");
      setIsLoading(false)
      if (response) {
        setTop10(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <React.Fragment>
      <div className={style.card_info}>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-bag ${style.icon_edit}`} />
          </label>
          <div className={style.total}>
            <label className={style.label}>Tổng số sản phẩm</label>
            <label className={style.amount}>
              {product ? product[0] + product[1] + product[2] + product[3] : 0}
            </label>
          </div>
          <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Chờ phê duyệt</label>
              <label className={style.amount}>
                {product ? product[0] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>
                {product ? product[1] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Dừng hoạt động</label>
              <label className={style.amount}>
                {product ? product[2] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>
                {product ? product[3] : 0}
              </label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-shop  ${style.icon_edit}`} />
          </label>
          <div className={style.total}>
            <label className={style.label}>Số lượng gian hàng</label>
            <label className={style.amount}>
              {shop ? shop[0] + shop[1] + shop[2] : 0}
            </label>
          </div>
          <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Chờ phê duyệt</label>
              <label className={style.amount}>
                {shop ? shop[0] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>
                {shop ? shop[1] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>
                {shop ? shop[2] : 0}
              </label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-person-circle ${style.icon_edit}`} />
          </label>
          <div className={style.total}>
            <label className={style.label}>Số lượng tài khoản</label>
            <label className={style.amount}>
              {account ? account[0] + account[1] : 0}
            </label>
          </div>
          <div className={style.list_status}>
            <div className={style.status}>
              <label className={style.label}>Đang hoạt động</label>
              <label className={style.amount}>
                {account ? account[0] : 0}
              </label>
            </div>
            <div className={style.status}>
              <label className={style.label}>Cấm hoạt động</label>
              <label className={style.amount}>
                {account ? account[1] : 0}
              </label>
            </div>
          </div>
        </div>
        <div className={style.card}>
          <label className={style.icon}>
            <i className={`bi bi-receipt-cutoff ${style.icon_edit}`} />
          </label>
          <div className={style.total}>
            <label className={style.label}>Số lượng đơn hàng</label>
            <label className={style.amount}>
              {order ? order : 0}
            </label>
          </div>
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
            <label className={style.column}>Đã Bán</label>
          </div>
          {top10.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{value[0].id}</label>
              <label className={style.column}>
                {value[0].image_product != null ? (
                  <img
                    key={value[0].image_product[0].id}
                    className={style.image}
                    src={`${value[0].image_product[0].url}`}
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
              <label className={style.column}>{value[0].product_name}</label>
              <label className={style.column}>
                {value[0].categoryItem_product?.type_category_item}
              </label>
              <label className={style.column}>
                {formatCurrency(value[0].price, 0)}
              </label>
              <label className={style.column}>
                {formatDate(value[0].create_date)}
              </label>
              <label className={style.column}>
                {value[1]}
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
