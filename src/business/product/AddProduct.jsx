import { callAPI } from "../../service/API";
import style from "../../css/business/product.module.css";
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ProductService from "../../service/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { reloadPage } from "../../service/Actions";
import { ThongBao } from "../../service/ThongBao";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { GetDataLogin } from "../../service/DataLogin";
import ModalAction from "../../service/ModalAction";
import LoadingOverlay from "../../service/loadingOverlay";

function AddProduct() {
  const [accountLogin, setAccountLogin] = useState(null);
  const [token, settoken] = useState(null);
  const navigate = useNavigate();
  const getAccountFromSession = () => {
    const accountSession = GetDataLogin();
    const tokenac = sessionStorage.getItem('accessToken');
    settoken(tokenac)
    if (accountSession !== null) {
      try {
        setAccountLogin(accountSession)
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  const dispatch = useDispatch();
  const [datacategory, setcategorydata] = useState([]);
  const [categoryItemData, setcategoryItem] = useState([]);
  const [valueCategory, setValueCategory] = useState("");
  const [valueCategoryItem, setValueCategoryItem] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesave, setimagesave] = useState([]);
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [description, setdescription] = useState("");
  const reloadold = useSelector(state => state.getreloadPage);
  const MAX_NAME_LENGTH = 300; // Example maximum name length
  const MAX_DESCRIPTION_LENGTH = 100000; // Example maximum description length
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getdataCategory();
    getAccountFromSession();
  }, []);

  const getdataCategory = async () => {
    const reponse = await callAPI(`/api/category?sizePage=10000`, "GET");
    setcategorydata(reponse.content);
  };

  const getdataCategoryItem = async id => {
    const reponseItem = await callAPI(`/api/category/${id}`, "GET");
    setcategoryItem(reponseItem.listCategory);
  };

  const handleChangeCategory = event => {
    const selectedOptionValue = event.target.value;
    setValueCategory(selectedOptionValue);
    getdataCategoryItem(event.target.value);
  };

  const handleChangeCategoryItem = event => {
    const selectedOptionValue = event.target.value;
    setValueCategoryItem(selectedOptionValue);
  };

  const handleImageChange = e => {
    const files = e.target.files;
    const allowedFormats = ['image/jpeg', 'image/png'];
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
      const filesave = imageFiles[0];
      const listsave = [...imagesave];
      listsave.push(filesave);
      setimagesave(listsave);
      const selectedImagesArray = imageFiles
        .slice(0, 9) // Lấy tối đa 9 ảnh nếu có nhiều hơn
        .map(file => URL.createObjectURL(file));
      setSelectedImages(prevSelectedImages => [...prevSelectedImages, selectedImagesArray]);
    }
  };


  const handleDeleteImage = index => {
    const deletedImage = [...selectedImages];
    deletedImage.splice(index, 1);
    setSelectedImages(deletedImage);
  };
  const handleSubmitAdd = async () => {
    if (name.trim() === "" || !price || !description || !valueCategoryItem || !selectedImages) {
      ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
      return;
    }

    const isValidName = /^[\p{L}0-9\s]+$/u.test(name) && !/[!@#$%^&*(),.?":{}|<>]/g.test(name);
    if (!isValidName || name.length > MAX_NAME_LENGTH) {
      ThongBao(`Tên sản phẩm không hợp lệ hoặc vượt quá ${MAX_NAME_LENGTH} ký tự.`, "error");
      return;
    }

    const isValidPrice = /^\d+(\.\d{1,2})?$/u.test(price);
    const isValidQuantity = /^\d+$/u.test(quantityValue);

    if (!isValidPrice || parseFloat(price) <= 0) {
      ThongBao("Giá phải là số dương.", "error");
      return;
    }

    if (!isValidQuantity || parseInt(quantityValue) <= 0) {
      ThongBao("Số lượng phải là số nguyên dương.", "error");
      return;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      ThongBao(`Mô tả sản phẩm không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự.`, "error");
      return;
    }
    if (imagesave.length < 1) {
      ThongBao(`Vui lòng chọn hình ảnh.`, "error");
      return;
    }
    const isConfirmed = await ModalAction("Bạn có chắc muốn thêm sản phẩm này?", "warning");
    if (isConfirmed) {
      try {
        setIsLoading(true);
        const response = await ProductService.addProduct(
          name,
          price,
          description,
          0,
          valueCategoryItem,
          quantityValue,
          selectedImages,
          imagesave,
          accountLogin.shop.id,
          token
        );
        setIsLoading(false);
        if (response.status === "success") {
          dispatch(reloadPage(reloadold + 1));
          ThongBao(response.message, response.status);
        } else {
          ThongBao(response.message, response.status);
        }
      } catch (error) {
        ThongBao("Có lỗi xảy ra.", "error");
      }

    };
  }


  return (
    <React.Fragment>
      <div className={`${style.cardHeading}`}>Thông tin cơ bản</div>
      <div className={`${style.addImage}`}>
        <label>Hình ảnh sản phẩm</label>
        <div className={`${style.infoImages}`}>
          <div>
            <span>* </span>
            <label> Hình ảnh tỷ lệ 1:1</label>
          </div>
          <div className={`${style.listImage}`}>
            {selectedImages.slice(0, 9).map((image, index) =>
              <div className={`${style.selectedImages}`} key={index}>
                <img src={image} alt={`Selected ${index}`} />
                <label onClick={() => handleDeleteImage(index)}>
                  <i className="bx bx-trash" />
                </label>
              </div>
            )}
            <input
              id="selectedImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {selectedImages.length < 9
              ? <label
                htmlFor="selectedImage"
                className={`${style.labelSelected}`}
              >
                <i class="bx bx-image-add" />
                <span>
                  Thêm hình ảnh ({selectedImages.length}/9)
                </span>
              </label>
              : null}
          </div>
        </div>
      </div>
      <div className={`${style.productName}`}>
        <label>Tên sản phẩm</label>
        <input
          type="text"
          placeholder="Tên sản phẩm..."
          className={style.input}
          onChange={e => {
            setname(e.target.value);
          }}
        />
      </div>
      <div className={`${style.price}`}>
        <label>Giá sản phẩm</label>
        <input
          type="number"
          className={style.input}
          placeholder="Giá sản phẩm..."
          onChange={e => {
            setprice(e.target.value);
          }}
        />
      </div>
      <div className={`${style.category}`}>
        <label>Ngành hàng</label>
        <select
          value={valueCategory}
          onChange={handleChangeCategory}
          className={`${style.optionSelectType}`}
        >
          <option value="">Loại Sản Phẩm...</option>
          {datacategory.map((value, index) => {
            return (
              <option key={index} value={value.id}>
                {value.type_category}
              </option>
            );
          })}
        </select>
        {valueCategory !== ""
          ? <select
            value={valueCategoryItem}
            onChange={handleChangeCategoryItem}
            className={`${style.optionSelectType}`}
          >
            <option value="">Phân Loại Sản Phẩm...</option>
            {categoryItemData.map((value, index) => {
              return (
                <option key={index} value={value.id}>
                  {value.type_category_item}
                </option>
              );
            })}
          </select>
          : null}
      </div>
      <div className={`${style.quantity}`}>
        <label>Số lượng</label>
        <input
          type="number"
          className={style.input}
          placeholder="Số lượng..."
          onChange={e => {
            setQuantityValue(e.target.value);
          }}
        />
      </div>
      <CKEditor
        editor={ClassicEditor}
        data=""
        onChange={(event, editor) => {
          setdescription(editor.getData());
        }}
      />
      <button
        className={`mt-2 ${style.buttonCreateProduct}`}
        onClick={handleSubmitAdd}
      >
        LƯU SẢN PHẨM
      </button>
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}
export default AddProduct;
