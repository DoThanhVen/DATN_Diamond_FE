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
import ModalAction from "../../service/ModalAction";
import { callAPI } from "../../service/API";
import { useNavigate } from "react-router";

export default function ModelDelete({ status, toggleShow }) {
  const data = useSelector((state) => state.idShop);
  const [token, settoken] = useState(null);
  const [content, setcontent] = useState('');
  const [account, setaccount] = useState({});
  const dispatch = useDispatch();
  const navigate=useNavigate();
  useEffect(() => {
    if (data !== 0) {
      getShop();
    }else{
      navigate('/admin/shops')
    }
  }, [data]);
  const getShop = async () => {
    const tokenax = sessionStorage.getItem('accessToken');
    settoken(tokenax)
    const config = {
      headers: {
        "Authorization": `Bearer ${tokenax}`
      }
    };
    const reponse = await callAPI(`/api/auth/getAccountbyIdShop/${data}`, 'GET',{},config);
    setaccount(reponse.data)
  };
  const handlesubmit = async () => {
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
    if (isConfirmed) {
    const reponse = await callAPI(`/api/auth/adminDeleteShop/${data}`,'DELETE',{},config);
    if (reponse) {
      toggleShow();
      dispatch(getIdShop(0));
      await callAPI(`/api/auth/sendEmail/${account.infoAccount.email}?content=${content}`, 'GET',{},config);
      navigate('/admin/shops')
    }}
  };
  return (
    <>
      <MDBModal staticBackdrop tabIndex="-1" show={status}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Không duyệt</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <br />
              <p>Lí do</p>
              <textarea style={{ width: '100%' }} value={content} onChange={(e) => { setcontent(e.target.value) }}></textarea>
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