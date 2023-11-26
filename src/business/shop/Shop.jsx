import React, { useState } from "react";
import style from "../../css/business/shop.module.css";

function Shop() {
     //SELECT IMAGE
  const [selectedImage, setSelectedImage] = useState(null);

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
      <div className={style.formAction}>
        <label className={style.heading}>Thông tin cửa hàng</label>
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
              placeholder="Tên cửa hàng"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Quận"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Số nhà"
            ></input>
          </div>
          <div className={style.contentRight}>
            <input
              className={style.input}
              type="text"
              placeholder="Thành phố"
            ></input>
            <input
              className={style.input}
              type="text"
              placeholder="Đường"
            ></input>
          </div>
        </div>
        <div className={style.formButton}>
          <button className={style.button}>
            <i className="bi bi-pencil-square"></i> SỬA
          </button>
          <button className={style.button}>
            <i className="bi bi-arrow-clockwise"></i> LÀM MỚI
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Shop;
