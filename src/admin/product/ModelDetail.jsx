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
import style from "../../css/admin/shop/editshop.module.css"
import { callAPI } from "../../service/API";

export default function ModelDetail({ status, toggleShow }) {
  const data = useSelector((state) => state.idProductAdmin);

  const [datafind, setdatafind] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (data !== 0) {
      getData();
    }
  }, [data]);

  const getData = async () => {
    try {
      const response = await callAPI(`/api/shop`, 'GET');
      const shopsWithProduct52 = response.filter(shop => {
        return shop.products.some(product => product.id === data);
      });
      setdatafind(shopsWithProduct52);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  return (
    <>
      <MDBModal staticBackdrop tabIndex="-1" show={status}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Thông tin chi tiết</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {datafind && datafind.length > 0 ? (
                <div>
                  <h3>{datafind[0].shop_name}</h3>
                  <p>Địa chỉ: {datafind[0]?.addressShop?.address}, {datafind[0]?.addressShop?.ward}, {datafind[0]?.addressShop?.district}, {datafind[0]?.addressShop?.city}</p>
                  {/* Thêm thông tin khác cần hiển thị */}
                </div>
              ) : (
                <p>Không có thông tin chi tiết</p>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className={style.buttonEdit} onClick={toggleShow}>Đóng</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}