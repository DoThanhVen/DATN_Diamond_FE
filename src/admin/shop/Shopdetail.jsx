import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShopService from "../../service/ShopService";
import { getIdShop } from "../../service/Actions";
import { Link, useNavigate } from "react-router-dom";
import style from "../../css/admin/shop/shopdetail.module.css";

function ShopDetail() {
  const [shop, setshop] = useState({});
  const dispatch = useDispatch();
  const id = useSelector(state => state.idShop);
  const navigate = useNavigate();
  const data = useSelector(state => state.allDataShop);
  useEffect(() => {
    getShop();
  }, [data]);

  const getShop = async () => {
    if (Array.isArray(data)) {
      console.log(data)
      const listFilter = data.filter(a => {
        return a.shop.id === id
      }
      )
      listFilter.forEach(e => setshop(e))
      console.log('list',listFilter)
    }
  };
  const handleSubmit = async () => {
    const reponse = await ShopService.updateStatusAdmin(shop.shop.id, 1);
    navigate("/admin/shops");
    dispatch(getIdShop(0));
  };
  return (
    <div className={style.card}>
      <Link to="/admin/shops" className={style.back}><i className="bi bi-box-arrow-left"></i></Link>
      <h2 className={style.heading}>Chi tiết cửa hàng</h2>
      <div>
        <img
          className={style.shopImage}
          src="http://localhost:8080/api/uploadImageProduct/b22654805fd246319e661efb0cc73e87.jpg" // Replace with the actual image URL
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
      </div>
    </div>
  );
}

export default ShopDetail;