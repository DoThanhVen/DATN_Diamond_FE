import React, { useEffect, useRef, useState } from "react";
import style from "../../css/business/product.module.css";
import { callAPI } from "../../service/API";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ProductService from "../../service/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { reloadPage } from "../../service/Actions";
import { ThongBao } from "../../service/ThongBao";

export default function ModelEdit({ onReload, data, closeModal }) {
  const dispatch = useDispatch();
  const [product, setproduct] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [valueCategory, setValueCategory] = useState("");
  const [valueCategoryItem, setValueCategoryItem] = useState()
  const [categoryItemData, setcategoryItem] = useState([]);
  const [imagesave, setimagesave] = useState([]);
  const [description, setdescription] = useState('')
  const [name, setname] = useState('')
  const [price, setprice] = useState('')
  const reloadold = useSelector((state) => state.getreloadPage);
  const MAX_NAME_LENGTH = 300; // Example maximum name length
  const MAX_DESCRIPTION_LENGTH = 1000; // Example maximum description length
  useEffect(() => {
    getdataproductbyid()
  }
    , []);

  const getdataproductbyid = async () => {
    const reponse = await ProductService.getProductbyId(data.id)
    setproduct(reponse)
    setname(reponse.product_name)
    setprice(reponse.price)
    setValueCategoryItem(reponse.categoryItem_product.id)
  }


  //SELECT IMAGE
  const handleImageChange = (e) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jxr', 'image/vnd.wap.wbmp'];
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
    }
    const listsave = [...imagesave]
    listsave.push(imageFiles[0])
    setimagesave(listsave);
    const selectedImagesArray = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    if ((selectedImagesArray.length + product.image_product.length) > 9) {
      selectedImagesArray.splice(9);
    }
    //LIST LOCAL
    const list = [...selectedImages];
    list.push(selectedImagesArray);
    setSelectedImages(list);
  };

  const handleDeleteImageById = async (id) => {
    await callAPI(`/api/uploadImageProduct/${id}`, 'DELETE')
    getdataproductbyid()
  };
  const handleDeleteImage = (index) => {
    const deletedImage = [...selectedImages];
    deletedImage.splice(index, 1);
    setSelectedImages(deletedImage);
  };

  const getdataCategoryItem = async (id) => {
    const reponseItem = await callAPI(`/api/category/${id}`, "GET")
    setcategoryItem(reponseItem.listCategory)
  }

  const handleChangeCategory = (event) => {
    const selectedOptionValue = event.target.value;
    setValueCategory(selectedOptionValue);
    getdataCategoryItem(event.target.value)
  };

  const handleChangeCategoryItem = (event) => {
    const selectedOptionValue = event.target.value;
    setValueCategoryItem(selectedOptionValue);
  };

  const handleSubmit = async () => {
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

    if (!isValidPrice || parseFloat(price) <= 0) {
      ThongBao("Giá phải là số dương.", "error");
      return;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      ThongBao(`Mô tả sản phẩm không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự.`, "error");
      return;
    }


    const response = await ProductService.updateProduct(product.id, name, price, description, 0, valueCategoryItem, selectedImages, imagesave);
    dispatch(reloadPage(reloadold + 1));
    setproduct(response)
    ThongBao(response.message, response.status);
    closeModal();
  };

  return (
    <React.Fragment>
      <div className={`${style.formCardModel}`}>
        <div className={`${style.cardModel}`}>
          <div className={`${style.cardHeadingModel}`}>Cập nhật thông tin</div>
          <label className={`${style.heading}`}>
            Mã sản phẩm: <b>{product.id}</b>
          </label>
          <div className={`${style.addImage}`}>
            <label>Hình ảnh sản phẩm</label>
            <div className={`${style.infoImages}`}>
              <div>
                <span>* </span>
                <label> Hình ảnh tỷ lệ 1:1</label>
              </div>
              <div className={`${style.listImage}`}>
                {product?.image_product?.map((image, index) => (
                  <div key={index} className={`${style.selectedImages}`}>
                    <img src={`http://localhost:8080/api/uploadImageProduct/${image.url}`} alt={`Selected ${index}`} />
                    <label onClick={() => handleDeleteImageById(image.id)}>
                      <i className="bx bx-trash"></i>
                    </label>
                  </div>
                ))}
                {product?.image_product?.length < 9 ? (
                  selectedImages.map((image, index) => (
                    <div className={`${style.selectedImages}`} key={index}>
                      <img src={image} alt={`Selected ${index}`} />
                      <label onClick={() => handleDeleteImage(index)}>
                        <i className="bx bx-trash"></i>
                      </label>
                    </div>
                  ))
                ) : null}
                <input
                  id="selectedImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {selectedImages?.length + product?.image_product?.length < 9 ? (
                  <label
                    htmlFor="selectedImage"
                    className={`${style.labelSelected}`}
                  >
                    <i class="bx bx-image-add"></i>
                    <span>Thêm hình ảnh ({selectedImages?.length + product?.image_product?.length}/9)</span>
                  </label>
                ) : null}
              </div>
            </div>
          </div>
          <div className={`${style.productName}`}>
            <label>Tên sản phẩm</label>
            <input type="text" defaultValue={product.product_name} onChange={(e) => { setname(e.target.value) }} name="product_name"></input>
          </div>
          <div className={`${style.productName}`}>
            <label>Giá sản phẩm</label>
            <input type="number" defaultValue={product.price} onChange={(e) => { setprice(e.target.value) }} name="price"></input>
          </div>
          <div className={`${style.category}`}>
            <label>Ngành hàng</label>
            <select
              value={valueCategory}
              onChange={handleChangeCategory}
              className={`${style.optionSelectType}`}

            >
              <option value="">Loại Sản Phẩm...</option>
              {data.datacategory.map((value, index) => {
                return (
                  <option key={index} value={value.id}>{value.type_category}</option>)
              })}
            </select>
            {valueCategory !== "" ? (
              <select
                value={valueCategoryItem}
                onChange={handleChangeCategoryItem}
                className={`${style.optionSelectType}`}
                name="categoryItem_product"
              >
                <option value="">Phân Loại Sản Phẩm...</option>
                {categoryItemData.map((value, index) => {

                  return (
                    <option key={index} value={value.id}>
                      {value.type_category_item}
                    </option>)

                })}
              </select>
            ) : null}
          </div>
          <div className={`${style.description}`}>
            <label>Mô tả sản phẩm</label>
            <CKEditor
              editor={ClassicEditor}
              data={product.description}
              onChange={(event, editor) => {
                setdescription(editor.getData());

              }}

            />
          </div>
          <button className={`btn btn-primary mt-3`} onClick={handleSubmit}>LƯU THAY ĐỔI</button>
          <span onClick={closeModal} className={`${style.closeModal}`}>
            X
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}