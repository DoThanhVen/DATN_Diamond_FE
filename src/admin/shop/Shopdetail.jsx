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
import listDataAddress from "../../service/AddressVietNam";
import LoadingOverlay from "../../service/loadingOverlay";

function ShopDetail() {
  const [shop, setshop] = useState({});
  const dispatch = useDispatch();
  const id = useSelector((state) => state.idShop);
  const [idShop, setIdShop] = useState(id);
  const navigate = useNavigate();
  const [data, setData] = useSelector((state) => state.allDataShop);
  const [token, settoken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getdata()
  }, []);

  const getdata = async () => {
    settoken(sessionStorage.getItem('accessToken'));
    const token = sessionStorage.getItem('accessToken');
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
      setIsLoading(true);
      const response = await callAPI(
        `/api/auth/account/getAll?key=&keyword=&offset=0&sizePage=999999&sort=&sortType=&shoporaccount=shop`,
        "GET", {}, config
      );
      setIsLoading(false)
      const responseData = response.data.content;
      if (responseData) {
        const foundAccount = responseData.filter(
          item => {
            console.log(item)
            return item[7] === idShop;
          }
        );
        if (foundAccount) {
          setshop(foundAccount[0]);
        }
      }


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    const isConfirmed = await ModalAction(
      "Bạn có chắc muốn thực hiện hành động này?",
      "warning"
    );
    if (isConfirmed) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        setIsLoading(true)
        const formData = new FormData();
        formData.append("id", shop[7]);
        formData.append("status", 1);
        formData.append("isCheck", "detail");
        await callAPI(`/api/auth/admin/update`, "PUT", formData, config);
        await callAPI(
          `/api/auth/sendEmail/${shop[13]}?content=Cửa hàng của bạn đã được phê duyệt tại FE Shop`,
          "GET",
          {},
          config
        );
        setIsLoading(false)
        navigate("/admin/shops");
        dispatch(getIdShop(0));
      } catch (error) {
        ThongBao("Có lỗi xảy ra.", "error");
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
    <>
      < div className={style.card} >
        <Link to="/admin/shops" className={style.back}>
          <i className="bi bi-box-arrow-left"></i>
        </Link>
        <h2 className={style.heading}>Chi tiết cửa hàng</h2>
        <div>
          <img
            className={style.shopImage}
            src={shop[10] ? shop[10] : "/images/image_shop.jpg"}
            alt="Shop"
            style={{ maxWidth: "100%" }}
          />
        </div>
        <label className={style.title}>
          Tên cửa hàng: {shop[8]}
        </label>
        <label className={style.title}>Chủ sở hữu: {shop[2]}</label>
        <label className={style.title}>Địa chỉ:</label>
        {shop[11] ? (<div className={style.address}>
          <label>
            Tỉnh/Thành phố:{" "}
            {listDataAddress.map((valueCity, index) =>
              valueCity.codename === shop[11].city
                ? valueCity.name
                : null
            )}
          </label>
          <label>
            Quận/Huyện:
            {listDataAddress.map((valueCity, index) =>
              valueCity.codename === shop[11].city
                ? valueCity.districts.map((valueDistrict, index) =>
                  valueDistrict.codename === shop[11].district
                    ? valueDistrict.name
                    : null
                )
                : null
            )}
          </label>
          <label>
            Xã/Phường:{" "}
            {listDataAddress.map((valueCity, index) =>
              valueCity.codename === shop[11].city
                ? valueCity.districts.map((valueDistrict, index) =>
                  valueDistrict.codename === shop[11].district
                    ? valueDistrict.wards.map((valueWard, index) =>
                      valueWard.codename === shop[11].ward
                        ? valueWard.name
                        : null
                    )
                    : null
                )
                : null
            )}
          </label>
          <label>Số nhà: {shop[11].address}</label>
        </div>) : null}
        <div>
          <button className={style.buttonAccept} onClick={handleSubmit}>
            Xác Nhận Duyệt
          </button>
          <button
            className={style.buttonDenied}
            onClick={() => {
              openModal();
            }}
          >
            Không duyệt
          </button>
        </div>
        {showModal && <ModelDelete status={showModal} toggleShow={closeModal} />}
        <LoadingOverlay isLoading={isLoading} />
      </div >
    </>

  );
}

export default ShopDetail;