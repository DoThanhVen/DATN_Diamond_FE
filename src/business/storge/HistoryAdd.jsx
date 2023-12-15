import React, { useEffect, useState } from "react";
import style from "../../css/business/storge.module.css";
import moment from "moment";
import { useSelector } from "react-redux";
import { callAPI } from "../../service/API";
import { useNavigate } from "react-router";
import { GetDataLogin } from "../../service/DataLogin";
import LoadingOverlay from "../../service/loadingOverlay";

function HistoryAdd() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    if (accountLogin !== null) {
      try {
        getdataProducts(accountLogin.shop.id);

      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const [listProducts, setListProducts] = useState([]);
  const reload = useSelector((state) => state.getreloadPage);

  useEffect(() => {
    getAccountFromSession();
  }, [reload]);


  const getdataProducts = async (idShop) => {
    try { 
      setIsLoading(true)
      const response = await callAPI(
        `/api/product/getByShop?shop=${idShop}&sizePage=10000`,
        "GET"
      );
      setIsLoading(false)
      const allProducts = response.content?.flatMap((product) => {
        return product.listStorage.map((storageItem) => ({
          ...product,
          storageItem
        }));
      });

      const sortedProducts = allProducts.sort((a, b) => {
        const dateA = moment(a.storageItem.create_date);
        const dateB = moment(b.storageItem.create_date);
        return dateB - dateA;
      });
      setListProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };


  return (
    <div className={`${style.listProduct} ${style.history}`}>
      <div className={style.table}>
        <div className={style.tableHeading}>
          <label className={style.column}>STT</label>
          <label className={style.column}>Mã SP</label>
          <label className={style.column}>Hình ảnh</label>
          <label className={style.column}>Tên SP</label>
          <label className={style.column}>Loại SP</label>
          <label className={style.column}>Số lượng</label>
          <label className={style.column}>Ngày thực hiện</label>
        </div>
        {listProducts.map((product, index) => (
          <div key={product.id} className={style.tableBody}>
            <>
              <label className={style.column}>{index + 1}</label>
              <label className={style.column}>{product.id}</label>
              <label className={style.column}>
                {product?.image_product.length > 0 ? (
                    <img
                      key={product?.image_product[0].id}
                      className={style.image}
                      src={product?.image_product[0].url}
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
              <label className={style.column}>{product.product_name}</label>
              <label className={style.column}>
                {product.categoryItem_product.type_category_item}
              </label>
            </>
            <label className={style.column}>
              {product.storageItem.quantity || ""}
            </label>
            <label className={style.column}>
              {formatDate(product.storageItem.create_date) || ""}
            </label>
          </div>
        ))}
      </div>
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}

export default HistoryAdd;
