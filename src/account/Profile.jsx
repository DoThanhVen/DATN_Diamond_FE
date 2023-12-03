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
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function Profile_User() {
  const [accountLogin, setAccountLogin] = useState(null);
  const navigate = useNavigate();

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

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
      try {
        setUsername(data.username);
        if (data.fullname) {
          setFullname(data.fullname);
        }
        if (data.phone) {
          setPhone(data.phone);
        }
        if (data.id_card) {
          setIdCard(data.id_card);
        }
        if (data.email) {
          setEmail(data.email);
        }
        setGender(data.gender);
        if (data.city) {
          setCity(data.city);
        }
        if (data.address.length > 0) {
          data.address.filter((value) => {
            if (value.status) {
              setCity(value.city);
              setDistrict(value.district);
              setWard(value.ward);
              setAddress(value.address);
              setIdAddressUse(value.id);
            }
          });
        }
        if (data.image) {
          setImage(data.image);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAccountFromSession();
  }, []);

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

  const domain = process.env.REACT_APP_API || "http://localhost:8080";

  const handleUpdateProfile = async () => {
    if (
      fullname === "" ||
      fullname === null ||
      phone === "" ||
      phone === null ||
      id_card === "" ||
      id_card === null
    ) {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      axios
        .post(domain + "/api/account/updateprofile/" + username, {
          fullname,
          id_card,
          phone,
          gender,
          email
        })
        .then((response) => {
          if (response.data.status === "success") {
            ThongBao(response.data.message, "success");
            accountLogin.id_card = id_card;
            accountLogin.phone = phone;
            accountLogin.gender = gender;
            accountLogin.email = email;
            accountLogin.fullname = fullname;

            console.log(accountLogin);
            const base64String = utf8_to_b64(JSON.stringify(accountLogin));
            sessionStorage.setItem("accountLogin", base64String);
          } else {
            ThongBao(response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChangePass = async () => {
    if (oldPassword === "" || newPassword === "" || reNewPassword === "") {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      const formData = new FormData();
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("reNewPassword", reNewPassword);
      axios
        .post(domain + `/api/account/changepass/${username}`, formData)
        .then((response) => {
          ThongBao(response.data.message, response.data.status);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFileChange = async (event) => {
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
        `/api/account/updateImage/${username}`,
        "POST",
        formData,
        config
      );
      if (response) {
        ThongBao(response.message, response.status);
        console.log(response);
        accountLogin.image = response.data.image;
        const base64String = utf8_to_b64(JSON.stringify(accountLogin));
        sessionStorage.setItem("accountLogin", base64String);
        const delay = setTimeout(() => {
          window.location.reload();
        }, 800);
        return () => clearTimeout(delay);
      } else {
        ThongBao("Lỗi!", "error");
      }
    }
  };

  const handleCreateAddress = async () => {
    if (city === "" || address === "" || district === "" || ward === "") {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      const response = await callAPI(
        `/api/account/createAddress/${username}`,
        "POST",
        { city, district, ward, address }
      );
      if (response.status === "success") {
        ThongBao(response.message, "success");
        accountLogin.address = response.data;
        const base64String = utf8_to_b64(JSON.stringify(accountLogin));
        sessionStorage.setItem("accountLogin", base64String);
        const delay = setTimeout(() => {
          window.location.reload();
        }, 800);
        return () => clearTimeout(delay);
      }
    }
  };

  const handleUpdateAddress = async () => {
    if (idAddressUse === 0) {
      ThongBao("Vui lòng chọn địa chỉ cần cập nhật!", "info");
    } else if (
      city === "" ||
      address === "" ||
      district === "" ||
      ward === ""
    ) {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      const response = await callAPI(
        `/api/account/updateAddress/${username}/${idAddressUse}`,
        "POST",
        { city, district, ward, address }
      );
      if (response.status === "success") {
        ThongBao(response.message, "success");
        accountLogin.address = response.data;
        const base64String = utf8_to_b64(JSON.stringify(accountLogin));
        sessionStorage.setItem("accountLogin", base64String);
        const delay = setTimeout(() => {
          window.location.reload();
        }, 800);
        return () => clearTimeout(delay);
      } else {
        ThongBao("Lỗi!", "error");
      }
    }
  };

  const handleSelectUseAddress = async (id, status) => {
    if (!status) {
      const response = await callAPI(
        `/api/account/useAddress/${username}/${id}`,
        "POST"
      );
      if (response.status === "success") {
        setIdAddressUse(id);
        ThongBao(response.message, "success");
        accountLogin.address = response.data;
        const base64String = utf8_to_b64(JSON.stringify(accountLogin));
        sessionStorage.setItem("accountLogin", base64String);
        const delay = setTimeout(() => {
          window.location.reload();
        }, 800);
        return () => clearTimeout(delay);
      } else {
        ThongBao("Lỗi!", "error");
      }
    } else {
      ThongBao("Địa Chỉ Đã Được Sử Dụng!", "info");
    }
  };

  const handleDeleteAddress = async (id) => {
    const response = await callAPI(
      `/api/account/deleteAddress/${username}/${id}`,
      "POST"
    );
    if (response.status === "success") {
      ThongBao(response.message, "success");
      accountLogin.address = response.data;
      const base64String = utf8_to_b64(JSON.stringify(accountLogin));
      sessionStorage.setItem("accountLogin", base64String);
      const delay = setTimeout(() => {
        window.location.reload();
      }, 800);
      return () => clearTimeout(delay);
    } else {
      ThongBao("Lỗi!", "error");
    }
  };
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
                      <img
                        src={
                          image
                            ? `http://localhost:8080/api/uploadImageProduct/${image}`
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
                    <h5 className="user-name">{username}</h5>
                    <h6 className="user-date">
                      Ngày tạo: {accountLogin && accountLogin.create_date}
                    </h6>
                  </div>
                  <div className="about">
                    <button
                      type="button"
                      className="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Đổi mật khẩu
                    </button>

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
                        defaultValue={fullname}
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
                        defaultValue={phone}
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
                        defaultValue={id_card}
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
                              accountLogin && accountLogin.gender === true
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
                              accountLogin && accountLogin.gender === false
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
                  accountLogin.address.map((value, index) =>
                    listDataAddress.map((valueCity, index) =>
                      valueCity.codename === value.city
                        ? valueCity.districts.map((valueDistrict, index) =>
                            valueDistrict.codename === value.district
                              ? valueDistrict.wards.map((valueWard, index) =>
                                  valueWard.codename === value.ward ? (
                                    <div
                                      key={valueCity.codename}
                                      className={`${style.address} ${
                                        value.status ? style.active : ""
                                      }`}
                                    >
                                      <div className={style.value}>
                                        {valueCity.name}, {valueDistrict.name},{" "}
                                        {valueWard.name}, {value.address}
                                      </div>
                                      <div className={style.groupButton}>
                                        <span
                                          className={`${style.status} ${
                                            value.status ? style.active : ""
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
                                          className={`bi bi-dash-lg ${
                                            style.remove
                                          } ${
                                            value.status ? style.active : ""
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
    </>
  );
}

export default Profile_User;
