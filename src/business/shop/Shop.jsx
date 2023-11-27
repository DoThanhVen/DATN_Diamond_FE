import React, { useEffect, useState } from "react";
import style from "../../css/business/shop.module.css";
import getAccountFromCookie from "../../service/getAccountLogin";
import { useNavigate } from "react-router";
import { ThongBao } from "../../service/ThongBao";
import { callAPI } from "../../service/API";
import DataAddress from "../../service/AddressVietNam.json";
function Shop() {
  //SELECT IMAGE
  const [selectedImage, setSelectedImage] = useState(null);
  const [accountLogin, setAccountLogin] = useState({});
  const [shop, setshop] = useState({});
  const [shopName, setShopName] = useState('')
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [image, setimage] = useState()
  const navigate = new useNavigate();
  const listDataAddress = DataAddress;
  const [reload, setreload] = useState(0)
  useEffect(() => {
    getData();
  }, [reload]);

  const getData = async () => {
    try {
      const accountData = await getAccountFromCookie();
      if (accountData !== undefined) {
        setAccountLogin(accountData)
        getDataShop(accountData.shop.id)
      }
      else {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDataShop = async (idshop) => {
    try {
      const res = await callAPI(`/api/shop/get/${idshop}`, 'GET');
      console.log('shop', res.data)
      setshop(res.data)
      setShopName(res.data.shop_name)
      setCity(res.data.addressShop.city)
      setDistrict(res.data.addressShop.district)
      setWard(res.data.addressShop.ward)
      setAddress(res.data.addressShop.address)
      setSelectedImage(`http://localhost:8080/api/uploadImageProduct/${res.data.image}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validation for shopName
      const isValidShopName = /^[a-zA-Z0-9\s]+$/g.test(shopName) && shopName.length <= 30;

      // Validation for address
      const isValidAddress = /^[a-zA-Z0-9\s]+$/g.test(address) && address.length <= 100;

      // Validation for city, district, ward (checking for emptiness)
      const areFieldsEmpty = !city || !district || !ward;

      if (!isValidShopName) {
        ThongBao("Tên cửa hàng không hợp lệ.", 'error');
        return; // Stop execution if validation fails
      }

      if (!isValidAddress) {
        ThongBao("Địa chỉ không hợp lệ.", 'error');
        return; // Stop execution if validation fails
      }

      if (!city) {
        ThongBao("Vui lòng chọn Tỉnh/Thành Phố.", 'error');
        return;
      }
  
      if (!district || !listDataAddress.find(cityItem => cityItem.codename === city)?.districts.find(districtItem => districtItem.codename === district)) {
        ThongBao("Quận/Huyện không hợp lệ.", 'error');
        return;
      }
  
      if (!ward || !listDataAddress.find(cityItem => cityItem.codename === city)?.districts.find(districtItem => districtItem.codename === district)?.wards.find(wardItem => wardItem.codename === ward)) {
        ThongBao("Phường/Xã/Trị Trấn không hợp lệ.", 'error');
        return;
      }
      console.log('dis', district)
      const formData = new FormData();
      formData.append('shop_name', shopName);
      formData.append('image', image);
      formData.append('city', city);
      formData.append('district', district);
      formData.append('ward', ward);
      formData.append('address', address);

      const res = await callAPI(`/api/shop/bussiness/updateInfShop/${shop.id}`, 'PUT', formData);
      if (res.status === 'success') {
        ThongBao(res.message, res.status);
        setreload(reload + 1);
      } else {
        ThongBao("Đã xảy ra lỗi.", 'error');
      }
    } catch (error) {
      console.log(error);
    }
  }



  const handleImageChange = e => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jxr', 'image/vnd.wap.wbmp'];
    const file = e.target.files[0]; // Lấy chỉ tệp đầu tiên
    if (!file) {
      return; // Không có tệp nào được chọn
    }
    if (!allowedFormats.includes(file.type)) {
      ThongBao("Vui lòng chỉ chọn tệp hình ảnh có định dạng phù hợp.", "info");
      return;
    }
    if (file.size > 1000 * 1024) {
      ThongBao(
        "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB.",
        "info"
      );
      return;
    }
    setimage(file)
    const reader = new FileReader();
    reader.onload = event => {
      setSelectedImage(event.target.result);
    };
    reader.readAsDataURL(file);
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
              value={shopName}
              onChange={(e) => { setShopName(e.target.value) }}
            ></input>
            <div className="row gutters">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h6 className="mt-3 text-primary">Địa chỉ</h6>
              </div>
              <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                <div className="form-group">
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

                </div>
              </div>
              <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                <div className="form-group">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={style.input}
                  >
                    <option value="">Quận/Huyện</option>
                    {listDataAddress
                      .find((valueCity) => valueCity.codename === city)
                      ?.districts.map((valueDistrict, index) => (
                        <option key={valueDistrict.codename} value={valueDistrict.codename}>
                          {valueDistrict.name}
                        </option>
                      ))}
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
                    {listDataAddress
                      .find((valueCity) => valueCity.codename === city)
                      ?.districts.find((valueDistrict) => valueDistrict.codename === district)
                      ?.wards.map((valueWard, index) => (
                        <option key={valueWard.codename} value={valueWard.codename}>
                          {valueWard.name}
                        </option>
                      ))}
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
          </div>
        </div>
        <div className={style.formButton}>
          <button className={style.button} onClick={handleSubmit}>
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
