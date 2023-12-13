import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIdAccountAdmin } from "../../service/Actions";
import style from "../../css/admin/shop/editshop.module.css";
import { callAPI } from "../../service/API";
import moment from "moment";
import listDataAddress from "../../service/AddressVietNam.json";

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

export default function ModelDetail({ status, toggleShow }) {
  const data = useSelector((state) => state.idProductAdmin);

  const [datafind, setdatafind] = useState({});
  const [product, setProduct] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    if (data !== 0) {
      getData();
    }
  }, [data]);

  const getData = async () => {
    try {
      const response = await callAPI(`/api/shop`, "GET");
      const shopsWithProduct52 = response.filter((shop) => {
        return shop.products.some((product) => product.id === data);
      });

      setdatafind(shopsWithProduct52);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  return (
    <>
      <MDBModal staticBackdrop tabIndex="-1" show={status}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Thông Tin Chi Tiết</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {datafind && datafind.length > 0 ? (
                <div className={style.content}>
                  <div className={style.heading}>
                    <img
                      className={style.image}
                      src={
                        datafind[0].image
                          ? datafind[0].image
                          : "/images/image_shop.jpg"
                      }
                      alt="Hình Ảnh"
                    ></img>
                    <div className={style.content}>
                      <label className={style.shopName}>
                        {datafind[0].shop_name}
                      </label>
                      <label className={style.createDate}>
                        {formatDate(datafind[0].create_date)}
                      </label>
                    </div>
                  </div>
                  <div className={style.address}>
                    <label className={style.heading}>Địa chỉ</label>
                    <div className={style.infoAddress}>
                      <label className={style.city}>
                        Tỉnh/Thành Phố:{" "}
                        {listDataAddress.map((valueCity, index) =>
                          valueCity.codename === datafind[0]?.addressShop?.city
                            ? valueCity.name
                            : null
                        )}
                      </label>
                      <label className={style.district}>
                        Quận/Huyện:{" "}
                        {listDataAddress.map((valueCity, index) =>
                          valueCity.codename === datafind[0]?.addressShop?.city
                            ? valueCity.districts.map((valueDistrict, index) =>
                                valueDistrict.codename ===
                                datafind[0]?.addressShop?.district
                                  ? valueDistrict.name
                                  : null
                              )
                            : null
                        )}
                      </label>
                      <label className={style.ward}>
                        Đường:{" "}
                        {listDataAddress.map((valueCity, index) =>
                          valueCity.codename === datafind[0]?.addressShop?.city
                            ? valueCity.districts.map((valueDistrict, index) =>
                                valueDistrict.codename ===
                                datafind[0]?.addressShop?.district
                                  ? valueDistrict.wards.map(
                                      (valueWard, index) =>
                                        valueWard.codename ===
                                        datafind[0]?.addressShop?.ward
                                          ? valueWard.name
                                          : null
                                    )
                                  : null
                              )
                            : null
                        )}
                      </label>
                      <label className={style.address}>
                        Số nhà: {datafind[0]?.addressShop?.address}
                      </label>
                    </div>
                  </div>
                  <div className={style.product}>
                    <label className={style.heading}>Thông Tin Sản Phẩm</label>
                    <div className={style.infoProduct}>
                      {datafind[0] &&
                        datafind[0].products.map((value, index) =>
                          value.id === data ? (
                            <>
                              <img
                                className={style.image}
                                src={
                                  value.image
                                    ? value.url
                                    : "/images/nullImage.png"
                                }
                                alt="Hình Ảnh"
                              ></img>
                              <label className={style.productName}>
                                Tên sản phẩm: {value.product_name}
                              </label>
                              <label className={style.price}>
                                Giá: {formatCurrency(value.price, 0)}
                              </label>
                              <label
                                dangerouslySetInnerHTML={{
                                  __html: value.description
                                    ? value.description
                                    : ""
                                }}
                              />
                            </>
                          ) : null
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                // <div>
                //   <h3>{datafind[0].shop_name}</h3>
                //   <p>Địa chỉ: {datafind[0]?.addressShop?.address}, {datafind[0]?.addressShop?.ward}, {datafind[0]?.addressShop?.district}, {datafind[0]?.addressShop?.city}</p>
                //   {/* Thêm thông tin khác cần hiển thị */}
                // </div>
                <p>Không có thông tin chi tiết</p>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className={style.buttonEdit} onClick={toggleShow}>
                Đóng
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
