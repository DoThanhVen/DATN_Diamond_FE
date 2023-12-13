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
import ModalAction from "../../service/ModalAction";

export default function ModelEdit({ status, toggleShow }) {
  const data = useSelector((state) => state.idAccountAdmin);
  const [token, settoken] = useState(null);
  const [statussave, setstatussave] = useState();
  const [content, setcontent] = useState('');
  const [account, setaccount] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (data !== 0) {
      getAccount();
    }
  }, [data]);

  const getAccount = async () => {
    const tokenac = sessionStorage.getItem('accessToken');
    settoken(tokenac)
    const reponse = await callAPI(`/api/account/${data}`, 'GET');
    setaccount(reponse.data)
    setstatussave(reponse.data.status)
  };
  const handlesubmit = async () => {
    const formData = new FormData();
    formData.append('status', statussave);
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
    if (isConfirmed) {
      const reponse = await callAPI(`/api/auth/account/adminupdate/${data}`, 'PUT', formData, config);
      if (reponse&&reponse.status==='success') {
        toggleShow();
        dispatch(getIdAccountAdmin(0));
        await callAPI(`/api/auth/sendEmail/${account.infoAccount.email}?content=${content}`, 'GET', {}, config);
      }
    }
  };
  return (
    <>
      <MDBModal staticBackdrop tabIndex="-1" show={status}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Cập nhật tài khoản</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Trạng thái tài khoản</p>
              <select className={style.inputEdit}
                value={statussave}
                onChange={(e) => {
                  setstatussave(e.target.value);
                }}
              >
                <option value={true}>Hoạt động</option>
                <option value={false}>Cấm hoạt động</option>
              </select>
              <br />
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