import React, { useState, useRef, useEffect } from "react";
import MainNavbar from "../page_user/components/Navbar";
import Footer from "../page_user/components/Footer";
import "../page_user/css/user/profile.css";
import style from "../page_user/css/user/profile.module.css";
import DataAddress from "../service/AddressVietNam.json";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import axios from "axios";
import { ThongBao } from "../service/ThongBao";
import { callAPI } from "../service/API";
import { GetDataLogin } from "../service/DataLogin";
import moment from "moment";
import { uploadImageToFirebaseStorage } from "../service/firebase";
import LoadingOverlay from "../service/loadingOverlay";
import ModalAction from "../service/ModalAction";
function utf8_to_b64(obj) {
  const jsonString = JSON.stringify(obj);
  const base64String = btoa(unescape(encodeURIComponent(jsonString)));
  return base64String;
}
function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}
function Profile_User() {
  const [accountLogin, setAccountLogin] = useState(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageNew, setimageNew] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, settoken] = useState(null);
  const [reload, setreload] = useState(0)

  const [phoneAddress, setPhoneAddress] = useState(null);
  const [nameAddress, setNameAddress] = useState(null);
  const [checked, setchecked] = useState(false)
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    const tokenac = sessionStorage.getItem('accessToken');
    settoken(tokenac)
    if (accountLogin !== null) {
      try {
        setAccountLogin(accountLogin);
        setDataLogin(accountLogin);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const setDataLogin = (data) => {
    if (data !== null) {
      console.log('data',data)
      try {
        setUsername(data.username);
        if (data?.infoAccount?.fullname) {
          setFullname(data?.infoAccount?.fullname);
        }
        if (data?.infoAccount?.phone) {
          setPhone(data?.infoAccount?.phone);
        }
        if (data?.infoAccount?.id_card) {
          setIdCard(data?.infoAccount?.id_card);
        }
        if (data.infoAccount.email) {
          setEmail(data.infoAccount.email);
        }
        setGender(data?.infoAccount?.gender);
        if (data?.infoAccount?.city) {
          setCity(data?.infoAccount?.city);
        }
        if (data?.address_account.length > 0) {
          data?.address_account.filter((value) => {
            if (value?.status) {
              setCity(value?.city);
              setDistrict(value?.district);
              setWard(value?.ward);
              setAddress(value?.address);
              setIdAddressUse(value?.id);
              setNameAddress(value?.name)
              setPhoneAddress(value?.phone)
            }
          });
        }
        if (data?.infoAccount?.image) {
          setImage(data?.infoAccount?.image);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAccountFromSession();
  }, [reload]);

  //SELECT IMAGE
  const [image, setImage] = useState("");
  const listDataAddress = DataAddress;

  const [idAddressUse, setIdAddressUse] = useState(0);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");

  const handleChangeCity = (value) => {
    setCity(value);
    setDistrict("");
    setWard("");
  };

  const handleChangeDistrict = (value) => {
    setDistrict(value);
    setWard("");
  };
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [id_card, setIdCard] = useState("");
  const [gender, setGender] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleUpdateProfile = async () => {
    try {
      if (
        fullname === "" ||
        phone === "" ||
        id_card === ""
      ) {
        ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
      } else {
        const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
        if (isConfirmed) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          if (selectedImage === null) {
            setIsLoading(true);
            const response = await callAPI(`/api/auth/account/updateprofile/${username}`, 'POST', {
              fullname,
              id_card,
              phone,
              gender,
              email,
              image
            }, config)
            setIsLoading(false)
            if (response.status === "success") {
              ThongBao(response.message, "success");
              accountLogin.infoAccount.id_card = id_card;
              accountLogin.infoAccount.phone = phone;
              accountLogin.infoAccount.gender = gender;
              accountLogin.infoAccount.email = email;
              accountLogin.infoAccount.fullname = fullname;
              const base64String = utf8_to_b64(accountLogin);
              sessionStorage.setItem("accountLogin", base64String);
            } else {
              ThongBao(response.message, "error");
            }
          } else {
            if (imageNew === null) {
              ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
            }
            setIsLoading(true);
            const downloadURL = await uploadImageToFirebaseStorage(imageNew);
            const response = await callAPI(`/api/auth/account/updateprofile/${username}`, 'POST', {
              fullname,
              id_card,
              phone,
              gender,
              email,
              image: downloadURL
            }, config)
            setIsLoading(false)
            if (response.status === "success") {
              ThongBao(response.message, "success");
              accountLogin.infoAccount.id_card = id_card;
              accountLogin.infoAccount.phone = phone;
              accountLogin.infoAccount.gender = gender;
              accountLogin.infoAccount.email = email;
              accountLogin.infoAccount.fullname = fullname;
              accountLogin.infoAccount.image = downloadURL;
              const base64String = utf8_to_b64(accountLogin);
              sessionStorage.setItem("accountLogin", base64String);
            } else {
              ThongBao(response.message, "error");
            }
          }
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra.", "error")
    }
  }
  const handleImageChange = e => {
    const allowedFormats = ['image/jpeg', 'image/png'];
    const files = e.target.files;
    const imageFiles = Array.from(files).filter(file => allowedFormats.includes(file.type));
    if (imageFiles.length === 0) {
      ThongBao("Vui lòng chỉ chọn tệp hình ảnh có định dạng phù hợp.", "info");
      return;
    }
    if (imageFiles[0].size > 1000 * 1024) {
      ThongBao(
        "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB.",
        "info"
      );
      return;
    } else {
      setimageNew(imageFiles[0]);
      const reader = new FileReader();
      reader.onload = event => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(imageFiles[0]);
    }
  };

  const handleChangePass = async () => {
    try {
      if (oldPassword === "" || newPassword === "" || reNewPassword === "") {
        ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
      } else {
        const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
        if (isConfirmed) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const formData = new FormData();
          formData.append("oldPassword", oldPassword);
          formData.append("newPassword", newPassword);
          formData.append("reNewPassword", reNewPassword);
          const response = await callAPI(`/api/auth/account/changepass/${username}`, 'POST', formData, config);
          ThongBao(response.message, response.status)
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra", "error")
    }

  };

  const handleCreateAddress = async () => {
    try {
      const phoneRegex = /^(0\d{9,10})$/;
      if (!phoneAddress || !nameAddress || city === "" || address === "" || district === "" || ward === "") {
        ThongBao("Vui lòng nhập đầy đủ thông tin hoặc số điện thoại không hợp lệ!", "error");
      } else {
        const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
        if (isConfirmed) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const response = await callAPI(
            `/api/auth/account/createAddress/${username}`,
            "POST",
            { name: nameAddress, phone: phoneAddress, city, district, ward, address }, config
          );
          if (response.status === "success") {
            ThongBao(response.message, "success");
            accountLogin.address_account = response.data;
            const base64String = utf8_to_b64(accountLogin);
            sessionStorage.setItem("accountLogin", base64String);
            setreload(reload + 1)
          }
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra.", "error")
    }

  };

  const handleUpdateAddress = async () => {
    try {
      const phoneRegex = /^(0\d{9,10})$/;
      if (idAddressUse === 0) {
        ThongBao("Vui lòng chọn địa chỉ cần cập nhật!", "info");
      } else if (!phoneAddress || !nameAddress ||
        city === "" ||
        address === "" ||
        district === "" ||
        ward === ""||!phoneRegex.test(phoneAddress)
      ) {
        ThongBao("Vui lòng nhập đầy đủ thông tin hoặc số điện thoại không hợp lệ!", "error");
      } else {
        const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
        if (isConfirmed) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const response = await callAPI(
            `/api/auth/account/updateAddress/${username}/${idAddressUse}`,
            "POST",
            { name: nameAddress, phone: phoneAddress, city, district, ward, address }, config
          );
          if (response.status === "success") {
            ThongBao(response.message, "success");
            console.log(response.data)
            accountLogin.address_account = response.data;
            const base64String = utf8_to_b64(accountLogin);
            sessionStorage.setItem("accountLogin", base64String);
            setreload(reload + 1)
          } else {
            ThongBao("Lỗi!", "error");
          }
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra.", "error")
    }

  };

  const handleSelectUseAddress = async (id, status) => {
    try {
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        if (!status) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const response = await callAPI(
            `/api/auth/account/useAddress/${username}/${id}`,
            "POST", {}, config
          );
          if (response.status === "success") {
            setIdAddressUse(id);
            ThongBao(response.message, "success");
            accountLogin.address_account = response.data;
            const base64String = utf8_to_b64(accountLogin);
            sessionStorage.setItem("accountLogin", base64String);
            setchecked(true)
            setreload(reload + 1)
          } else {
            ThongBao("Lỗi!", "error");
          }
        } else {
          ThongBao("Địa Chỉ Đã Được Sử Dụng!", "info");
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra.", "error")
    }

  };


  const handleDeleteAddress = async (id) => {
    try {
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };
        const response = await callAPI(
          `/api/auth/account/deleteAddress/${username}/${id}`,
          "POST", {}, config
        );
        if (response.status === "success") {
          ThongBao(response.message, "success");
          accountLogin.address_account = response.data;
          const base64String = utf8_to_b64(accountLogin);
          sessionStorage.setItem("accountLogin", base64String);
          setreload(reload + 1)
        } else {
          ThongBao("Lỗi!", "error");
        }
      };
    } catch (error) {
      ThongBao("Có lỗi xảy ra.", "error")
    }

  }
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div className="container mt-4">
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card-profile h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar" style={{ cursor: "pointer" }}>
                      {accountLogin && accountLogin.infoAccount && accountLogin.infoAccount.image !== '' && accountLogin.infoAccount.image !== null && selectedImage === null ? (
                        <img
                          src={
                            accountLogin.infoAccount.image
                          }
                          alt="user"
                          onClick={handleImageClick}
                        />
                      ) : (
                        <img
                          src={
                            selectedImage
                              ? selectedImage
                              : "https://bootdey.com/img/Content/avatar/avatar7.png"
                          }
                          alt="user"
                          onClick={handleImageClick}
                        />
                      )}

                      <input
                        type="file"
                        accept="/image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </div>
                    <h5 className="user-name">{username}</h5>
                    <h6 className="user-date">
                      Ngày tạo: {formatDate(accountLogin?.create_date)}
                    </h6>
                  </div>
                  <div className="about">
                    {accountLogin && accountLogin.provider === 'myweb' ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Đổi mật khẩu
                      </button>
                    ) : null}
                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              Đổi mật khẩu
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="col-12">
                              <label
                                htmlFor="inputpass1"
                                className="form-label"
                              >
                                Mật khẩu cũ:
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                onChange={(e) => setOldPassword(e.target.value)}
                                id="prepassword"
                                defaultValue={oldPassword}
                              />
                            </div>
                            <div className="col-12">
                              <label
                                htmlFor="inputpass2"
                                className="form-label"
                              >
                                Mật khẩu mới:
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                onChange={(e) => setNewPassword(e.target.value)}
                                id="password"
                                defaultValue={newPassword}
                              />
                            </div>
                            <div className="col-12">
                              <label
                                htmlFor="inputpass3"
                                className="form-label"
                              >
                                Nhập lại mật khẩu mới:
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                onChange={(e) =>
                                  setReNewPassword(e.target.value)
                                }
                                id="repassword"
                                defaultValue={reNewPassword}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Thoát
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleChangePass()}
                            >
                              Lưu thay đổi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <h6 className="mb-2 text-primary">Thông tin cá nhân</h6>
                  </div>
                  <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="fullName">Họ tên:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ email:</label>
                      <input
                        type="url"
                        className="form-control"
                        id="email"
                        value={email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="email">IDCard:</label>
                      <input
                        type="url"
                        className="form-control"
                        id="email"
                        value={id_card}
                        onChange={(e) => setIdCard(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="email">Giới tính:</label>
                      <div className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="gridRadios1"
                            onChange={() => setGender(true)}
                            defaultChecked={
                              accountLogin && accountLogin?.infoAccount?.gender === true
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="gridRadios1"
                          >
                            Nam
                          </label>
                        </div>
                        <div
                          className="form-check "
                          style={{ marginLeft: "40px" }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="gridRadios2"
                            onChange={() => setGender(false)}
                            defaultChecked={
                              accountLogin && accountLogin?.infoAccount?.gender === false
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="gridRadios2"
                          >
                            Nữ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right">
                      <button
                        type="button"
                        id="submit"
                        name="submit"
                        className="btn btn-primary mt-2"
                        onClick={() => handleUpdateProfile()}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mt-3 text-primary">Địa chỉ</h6>
                </div>
                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={phoneAddress}
                      onChange={(e) => setPhoneAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phone">Tên người nhận:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={nameAddress}
                      onChange={(e) => setNameAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <select
                      value={city}
                      onChange={(e) => handleChangeCity(e.target.value)}
                      className={style.input}
                    >
                      <option value="">Tỉnh/Thành Phố</option>
                      {listDataAddress.map((valueCity, index) => (
                        <option
                          key={valueCity.codename}
                          value={valueCity.codename}
                        >
                          {valueCity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <select
                      value={district}
                      onChange={(e) => handleChangeDistrict(e.target.value)}
                      className={style.input}
                    >
                      <option value="">Quận/Huyện</option>
                      {listDataAddress.map((valueCity, index) =>
                        valueCity.codename === city
                          ? valueCity.districts.map((valueDistrict, index) => (
                            <option
                              key={valueDistrict.codename}
                              value={valueDistrict.codename}
                            >
                              {valueDistrict.name}
                            </option>
                          ))
                          : null
                      )}
                    </select>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className={style.input}
                    >
                      <option value="">Phường/Xã/Trị Trấn</option>
                      {listDataAddress.map((valueCity, index) =>
                        valueCity.codename === city
                          ? valueCity.districts.map((valueDistrict, index) =>
                            valueDistrict.codename === district
                              ? valueDistrict.wards.map(
                                (valueWard, index) => (
                                  <option
                                    key={valueWard.codename}
                                    value={valueWard.codename}
                                  >
                                    {valueWard.name}
                                  </option>
                                )
                              )
                              : null
                          )
                          : null
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${style.input}`}
                      id="adress"
                      placeholder="Số nhà"
                      defaultValue={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex">
                <div className="text-right">
                  <button
                    type="button"
                    id="submit"
                    name="submit"
                    className="btn btn-primary"
                    onClick={() => handleCreateAddress()}
                  >
                    Thêm Mới
                  </button>
                </div>
                <div className="text-right ms-2">
                  <button
                    type="button"
                    id="submit"
                    name="submit"
                    className="btn btn-primary"
                    onClick={() => handleUpdateAddress()}
                  >
                    Cập Nhật
                  </button>
                </div>
              </div>
              <div className={style.listAddress}>
                {accountLogin &&
                  accountLogin?.address_account?.map((value, index) =>
                    listDataAddress.map((valueCity, index) =>
                      valueCity.codename === value.city
                        ? valueCity.districts.map((valueDistrict, index) =>
                          valueDistrict.codename === value.district
                            ? valueDistrict.wards.map((valueWard, index) =>
                              valueWard.codename === value.ward ? (
                                <div
                                  key={valueCity.codename}
                                  className={`${style.address} ${value.status ? style.active : ""
                                    }`}
                                >
                                  <div className={style.value}>
                                    {valueCity.name}, {valueDistrict.name},{" "}
                                    {valueWard.name}, {value.address}
                                  </div>
                                  <div className={style.groupButton}>
                                    <span
                                      className={`${style.status} ${value.status ? style.active : ""
                                        }`}
                                      onClick={() =>
                                        handleSelectUseAddress(
                                          value.id,
                                          value.status
                                        )
                                      }
                                    >
                                      {value.status
                                        ? "Đang Dùng"
                                        : "Sử Dụng"}
                                    </span>
                                    <i
                                      className={`bi bi-dash-lg ${style.remove
                                        } ${value.status ? style.active : ""
                                        }`}
                                      onClick={() =>
                                        handleDeleteAddress(value.id)
                                      }
                                    ></i>
                                  </div>
                                </div>
                              ) : null
                            )
                            : null
                        )
                        : null
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
      <LoadingOverlay isLoading={isLoading} />
    </>
  );
}

export default Profile_User;