import React, { useState } from "react";
import style from "../../css/admin/account/editaccount.module.css";
import Nav from "react-bootstrap/Nav";
import DataAddress from "../../service/AddressVietNam.json";
import { GetDataLogin } from "../../service/DataLogin";
import { useNavigate } from "react-router";

function EditAccount() {
  //SELECT IMAGE
  const [selectedImage, setSelectedImage] = useState(null);
  const listDataAddress = DataAddress;

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 800 * 1024) {
      alert(
        "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB."
      );
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <React.Fragment>
      <div className={style.header}>
        <div className={style.formSearch}>
          <i className={`bi bi-search ${style.icon}`}></i>
          <input
            className={style.input}
            type="text"
            placeholder="Tìm kiếm..."
          ></input>
        </div>
        <i className={`bi bi-person-circle ${style.iconUser}`}></i>
      </div>
      <div className={style.formAction}>
        <label className={style.heading}>Tài khoản</label>
        <div className={style.formImage}>
          {selectedImage !== null ? (
            <img className={style.image} src={selectedImage} alt="Hình Ảnh" />
          ) : null}
          <div className={style.action}>
            <input
              type="file"
              style={{ display: "none" }}
              id="inputImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="inputImage" className={style.button}>
              TẢI ẢNH
            </label>
            <label className={style.title}>
              Được phép JPG, GIF hoặc PNG. Kích thước tối đa 800KB
            </label>
          </div>
        </div>
        <div className={style.formContent}>
          <div className={style.contentLeft}>
            <input
              className={style.input}
              type="text"
              placeholder="Tên tài khoản"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Mật khẩu"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Số điện thoại"
            ></input>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={style.input}
            >
              <option value="">Tỉnh/Thành Phố</option>
              {listDataAddress.map((valueCity, index) => (
                <option key={valueCity.codename} value={valueCity.codename}>
                  {valueCity.name}
                </option>
              ))}
            </select>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={style.input}
            >
              <option value="">Quận/Huyện</option>
              {listDataAddress.map((valueCity, index) =>
                valueCity.codename === city
                  ? valueCity.districts.map((valueDistrict, index) => (
                      <option key={valueDistrict.codename} value={valueDistrict.codename}>
                        {valueDistrict.name}
                      </option>
                    ))
                  : null
              )}
            </select>
            <div className={style.gender}>
              <label className={style.label}>Giới tính</label>
              <div className={style.form}>
                <input
                  id="male"
                  className={style.inputRadio}
                  type="radio"
                  name="gender"
                  value="true"
                ></input>
                <label className={style.label} htmlFor="male">
                  Nam
                </label>
                <input
                  id="female"
                  className={style.inputRadio}
                  type="radio"
                  name="gender"
                  value="false"
                ></input>
                <label className={style.label} htmlFor="female">
                  Nữ
                </label>
              </div>
            </div>
            <div className={style.role}>
              <label className={style.label}>Vai trò</label>
              <div className={style.form}>
                <input
                  id="business"
                  className={style.inputCheckbox}
                  type="checkbox"
                  name="role"
                  value="BUSINESS"
                ></input>
                <label className={style.label} htmlFor="business">
                  BUSINESS
                </label>
                <input
                  id="admin"
                  className={style.inputCheckbox}
                  type="checkbox"
                  name="role"
                  value="ADMIN"
                ></input>
                <label className={style.label} htmlFor="admin">
                  ADMIN
                </label>
              </div>
            </div>
          </div>
          <div className={style.contentRight}>
            <input
              className={style.input}
              type="text"
              placeholder="Họ và tên"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Email"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="IDCard"
            ></input>
            <select
              value={district}
              onChange={(e) => setWard(e.target.value)}
              className={style.input}
            >
              <option value="">Phường/Xã</option>
              {listDataAddress.map((valueCity, index) =>
                valueCity.codename === city
                  ? valueCity.districts.map((valueDistrict, index) =>
                      valueDistrict.codename === district
                        ? valueDistrict.wards.map((valueWard, index) => (
                            <option
                              key={valueWard.codename}
                              value={valueWard.codename}
                            >
                              {valueWard.name}
                            </option>
                          ))
                        : null
                    )
                  : null
              )}
            </select>
            <input
              className={style.input}
              type="text"
              placeholder="Số nhà"
            ></input>
            <select className={style.input}>
              <option value="">Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="band">Cấm hoạt động</option>
            </select>
          </div>
        </div>
        <div className={style.formButton}>
          <button className={style.button}>
            <i className="bi bi-plus-lg"></i> THÊM
          </button>
          <button className={style.button}>
            <i className="bi bi-pencil-square"></i> SỬA
          </button>
          <button className={style.button}>
            <i className="bi bi-x-lg"></i> XÓA
          </button>
          <button className={style.button}>
            <i className="bi bi-arrow-clockwise"></i> LÀM MỚI
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditAccount;