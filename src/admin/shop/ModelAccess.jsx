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
import ShopService from "../../service/ShopService";
import { useEffect } from "react";
import { getIdShop } from "../../service/Actions";
import style from "../../css/admin/shop/editshop.module.css"

export default function ModelAccses({ status, toggleShow }) {
  const data = useSelector((state) => state.idShop);
  const [value, setvalue] = useState();
  const [shop, setshop] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (data !== 0) {
      getShop();
    }
  }, [data]);

  const getShop = async () => {
    const reponse = await ShopService.getAllshopById(data);
    setshop(reponse);
    setvalue(reponse.status);
  };
  const handlesubmit = async () => {
    const reponse = await ShopService.updateStatusAdmin(shop.id, value);
    if (reponse) {
      toggleShow();
      dispatch(getIdShop(0));
    }
  };
  return (
    <>
      <MDBModal staticBackdrop tabIndex="-1" show={status}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Cập nhật trạng thái</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <select className={style.inputEdit}
                value={value}
                onChange={(e) => {
                  setvalue(e.target.value);
                }}
              >
                <option value={2}>Cấm hoạt động</option>
                <option value={1}>Hoạt động</option>
              </select>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn className={style.buttonEdit} onClick={handlesubmit}>Đồng ý</MDBBtn>
              <MDBBtn className={style.buttonEdit} onClick={toggleShow}>Đóng</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}