import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShopService from "../../service/ShopService";
import { getIdShop } from "../../service/Actions";
import { Link, useNavigate } from "react-router-dom";
import style from "../../css/admin/shop/shopdetail.module.css";
import { callAPI } from "../../service/API";
import { ThongBao } from "../../service/ThongBao";
import ModalAction from "../../service/ModalAction";
import ModelDelete from "./ModelDelete";

function ShopDetail() {
  const [shop, setshop] = useState({});
  const dispatch = useDispatch();
  const id = useSelector(state => state.idShop);
  const navigate = useNavigate();
  const data = useSelector(state => state.allDataShop);
  const [token, settoken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (id !== 0) {
      getShop();
    }else{
      navigate('/admin/shops')
    }
  }, [data]);

  const getShop = async () => {

    const tokenax = sessionStorage.getItem('accessToken');
    settoken(tokenax)
    if (Array.isArray(data)) {
      const foundAccount = data.find(item => item.shop && item.shop.id === id);
      if (foundAccount) {
        setshop(foundAccount);
      }
    }
  };

  const handleSubmit = async () => {
    const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
    if (isConfirmed) {
      try {
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };
        const formData = new FormData();
        formData.append('id', shop.shop.id);
        formData.append('status', 1);
        await callAPI(`/api/auth/admin/update`, 'PUT', formData, config);
        await callAPI(`/api/auth/sendEmail/${shop.infoAccount.email}?content=Cửa hàng của bạn đã được phê duyệt tại FE Shop`, 'GET', {}, config);
        navigate("/admin/shops");
        dispatch(getIdShop(0));
      } catch (error) {
        ThongBao("Có lỗi xảy ra.", "error")
      }
    }

  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className={style.card}>
      <Link to="/admin/shops" className={style.back}><i className="bi bi-box-arrow-left"></i></Link>
      <h2 className={style.heading}>Chi tiết cửa hàng</h2>
      <div>
        <img
          className={style.shopImage}
          src=
          {shop?.shop?.image
            ? `http://localhost:8080/api/uploadImageProduct/${shop.shop.image}`
            : "/images/image_shop.jpg"}
          alt="Shop"
          style={{ maxWidth: "100%" }}
        />
      </div>
      <label className={style.title}>Tên cửa hàng: {shop.shop?.shop_name}</label>
      <label className={style.title}>
        Chủ sở hữu: {shop.username}
      </label>
      <label className={style.title}>Địa chỉ:</label>
      <div className={style.address}>
        <label>Tỉnh/Thành phố: {shop.shop?.addressShop?.city}</label>
        <label>Quận/Huyện: {shop.shop?.addressShop?.district}</label>
        <label>Xã/Phường: {shop.shop?.addressShop?.ward}</label>
        <label>Số nhà: {shop.shop?.addressShop?.address}</label>
      </div>
      <div>
        <button className={style.buttonSubmit} onClick={handleSubmit}>Xác Nhận Duyệt</button>
        <label className={style.column}>
          <button onClick={() => { openModal(); }}>Không duyệt</button>
        </label>
      </div>
      {showModal && <ModelDelete status={showModal} toggleShow={closeModal} />}
    </div>
  );
}

export default ShopDetail;