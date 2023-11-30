import React, { useState, useRef } from "react";
import "../page_user/css/user/profile.css";
import MainNavbar from "../page_user/components/Navbar";
import Footer from "../page_user/components/Footer";
import axios from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useEffect } from "react";
import DataAddress from "../service/AddressVietNam.json";
import style from "../page_user/css/user/saleRegistration.module.css";
import { ThongBao } from "../service/ThongBao";
import { callAPI } from "../service/API";
import { GetDataLogin } from "../service/DataLogin";

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export default function SalesRegistration() {
  const listDataAddress = DataAddress;
  const [accountLogin, setAccountLogin] = useState(null);
  const [reload, setreload] = useState(0);

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    if (accountLogin === undefined || accountLogin === null) {
      navigate("/login");
    } else {
      try {
        setAccountLogin(accountLogin);
        getDataShop(accountLogin.username);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDataShop = async username => {
    const response = await callAPI(`/api/account/shop/${username}`, "GET");
    if (response.data) {
      setSelectedImage(response.data.image);
      setShop_name(response.data.shop_name);
      setCity(response.data.addressShop.city);
      setDistrict(response.data.addressShop.district);
      setWard(response.data.addressShop.ward);
      setAddress(response.data.addressShop.address);
    }
  };

  useEffect(
    () => {
      getAccountFromSession();
    },
    [reload]
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const [shop_name, setShop_name] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");

  const handleChangeCity = value => {
    setCity(value);
    setDistrict("");
    setWard("");
  };

  const handleChangeDistrict = value => {
    setDistrict(value);
    setWard("");
  };

  const domain = process.env.REACT_APP_API || "http://localhost:8080";
  const handleSaleRegis = async () => {
    if (
      shop_name === "" ||
      city === "" ||
      district === "" ||
      ward === "" ||
      address === ""
    ) {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      await axios
        .post(
          domain +
            "/api/account/saleregis/" +
            accountLogin.username +
            "/" +
            shop_name,
          {
            city,
            district,
            ward,
            address
          }
        )
        .then(response => {
          ThongBao(response.data.message, response.data.status);
          accountLogin.shop = response.data.data;
          const base64String = utf8_to_b64(JSON.stringify(accountLogin));
          sessionStorage.setItem("accountLogin", base64String);
          setreload(reload + 1);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleFileChange = async event => {
    const file = event.target.files[0];
    if (file) {
      // Xử lý tệp ảnh đã chọn ở đây
      const reader = new FileReader();
      reader.readAsDataURL(file);
      //SAVE IMAGE
      const formData = new FormData();
      formData.append("image", file);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      const response = await callAPI(
        `/api/account/shop/updateImage/${accountLogin.username}`,
        "POST",
        formData,
        config
      );
      if (response) {
        ThongBao(response.message, response.status);
        if (response.status === "success") {
          const delay = setTimeout(() => {
            window.location.reload();
          }, 800);
          return () => clearTimeout(delay);
        }
      } else {
        ThongBao("Lỗi!", "error");
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        <nav>
          <MainNavbar />
        </nav>
        <div className="container mt-4">
          {accountLogin && accountLogin.shop
            ? <div className={`text-danger p-4 text-center`}>Bạn đã đăng kí kênh bán hàng, vui lòng chờ phê duyệt!</div>
            : <div className="row gutters">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="card-profile h-100">
                    <div className="card-body">
                      <div className="account-settings">
                        <div className="user-profile">
                          <div
                            className="user-avatar"
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={
                                selectedImage
                                  ? `http://localhost:8080/api/uploadImageProduct/${selectedImage}`
                                  : "https://bootdey.com/img/Content/avatar/avatar7.png"
                              }
                              alt="user"
                              onClick={handleImageClick}
                            />
                            <input
                              type="file"
                              accept="/image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </div>
                          <h5 className="user-name">Hình ảnh</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                  <div className="card-profile h-100">
                    <div className="card-body">
                      <div className="row gutters">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <h6 className="mt-3 mb-2 text-primary">
                            Thông tin cửa hàng
                          </h6>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <input
                              type="name"
                              className={`form-control ${style.input}`}
                              id="ciTy"
                              value={shop_name}
                              onChange={e => setShop_name(e.target.value)}
                              placeholder="Tên Cửa Hàng"
                            />
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={city}
                              onChange={e => handleChangeCity(e.target.value)}
                              className={style.input}
                            >
                              <option value="">Tỉnh/Thành Phố</option>
                              {listDataAddress.map((valueCity, index) =>
                                <option
                                  key={valueCity.codename}
                                  value={valueCity.codename}
                                >
                                  {valueCity.name}
                                </option>
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={district}
                              onChange={e =>
                                handleChangeDistrict(e.target.value)}
                              className={style.input}
                            >
                              <option value="">Quận/Huyện</option>
                              {listDataAddress.map(
                                (valueCity, index) =>
                                  valueCity.codename === city
                                    ? valueCity.districts.map(
                                        (valueDistrict, index) =>
                                          <option
                                            key={valueDistrict.codename}
                                            value={valueDistrict.codename}
                                          >
                                            {valueDistrict.name}
                                          </option>
                                      )
                                    : null
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={ward}
                              onChange={e => setWard(e.target.value)}
                              className={style.input}
                            >
                              <option value="">Phường/Xã/Trị Trấn</option>
                              {listDataAddress.map(
                                (valueCity, index) =>
                                  valueCity.codename === city
                                    ? valueCity.districts.map(
                                        (valueDistrict, index) =>
                                          valueDistrict.codename === district
                                            ? valueDistrict.wards.map(
                                                (valueWard, index) =>
                                                  <option
                                                    key={valueWard.codename}
                                                    value={valueWard.codename}
                                                  >
                                                    {valueWard.name}
                                                  </option>
                                              )
                                            : null
                                      )
                                    : null
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className={`form-control ${style.input}`}
                              id="adress"
                              value={address}
                              onChange={e => setAddress(e.target.value)}
                              placeholder="Số Nhà"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gutters mt-4">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="text-right">
                            <button
                              type="button"
                              id="submit"
                              name="submit"
                              className="btn btn-success"
                              onClick={handleSaleRegis}
                            >
                              Đăng ký
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
        </div>
        <div id="footer">
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
}
