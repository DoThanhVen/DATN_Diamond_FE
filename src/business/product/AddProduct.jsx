import { callAPI } from '../../service/API'
import style from "../../css/business/product.module.css";
import React, { useEffect, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ProductService from '../../service/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { reloadPage } from '../../service/Actions';
import { ThongBao } from '../../service/ThongBao';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

function AddProduct() {
    const [accountLogin, setAccountLogin] = useState(null);

    const navigate = useNavigate();
    const getAccountFromCookie = () => {
      const accountCookie = Cookies.get("accountLogin");
  
      if (accountCookie !== undefined) {
        try {
          const data = JSON.parse(
            decodeURIComponent(escape(window.atob(Cookies.get("accountLogin"))))
          );
          setAccountLogin(data);
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
    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [description, setdescription] = useState('')
    const reloadold = useSelector((state) => state.getreloadPage);
    const MAX_NAME_LENGTH = 300; // Example maximum name length
    const MAX_DESCRIPTION_LENGTH = 1000; // Example maximum description length
    
    useEffect(() => {
        getdataCategory()
        getAccountFromCookie()
    }, []);

    const getdataCategory = async () => {
        const reponse = await callAPI(`/api/category`, "GET");
        setcategorydata(reponse.content)
    }

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


    const handleImageChange = (e) => {
        const files = e.target.files;
        const filesave = e.target.files[0]
        const listsave = [...imagesave]
        listsave.push(filesave)
        setimagesave(listsave);
        const selectedImagesArray = Array.from(files)
            .filter((file) => file.type.startsWith("image/"))
            .map((file) => URL.createObjectURL(file));
        if (selectedImagesArray.length > 9) {
            selectedImagesArray.splice(9);
        }
        const list = [...selectedImages];
        list.push(selectedImagesArray);
        setSelectedImages(list);
    };

    const handleDeleteImage = (index) => {
        const deletedImage = [...selectedImages];
        deletedImage.splice(index, 1);
        setSelectedImages(deletedImage);
    };

    const handleSubmitAdd = async () => {
        try {
            if (!name || !price || !description || !valueCategoryItem || !selectedImages) {
                ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
                return;
            }
        
            if (name.length > MAX_NAME_LENGTH) {
                ThongBao(`Tên sản phẩm không được vượt quá ${MAX_NAME_LENGTH} ký tự.`, "error");
                return;
            }
        
            if (isNaN(price) || price <= 0) {
                ThongBao("Giá phải là số và lớn hơn 0.", "error");
                return;
            }
        
            if (isNaN(quantityValue) && quantityValue <= 0) {
                ThongBao("Số lượng phải là số và lớn hơn 0.", "error");
                return;
            }
        
            if (description.length > MAX_DESCRIPTION_LENGTH) {
                ThongBao(`Mô tả sản phẩm không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự.`, "error");
                return;
            }
        
            const response = await ProductService.addProduct(name, price, description, 0, valueCategoryItem, quantityValue, selectedImages, imagesave, accountLogin.shop.id);
            if (response.status === 'success') {
                dispatch(reloadPage(reloadold + 1));
                ThongBao(response.message, response.status);
            } else {
                ThongBao(response.message, response.status);
            }
        } catch (error) {
            ThongBao('Đã xảy ra lỗi.', "error");
            console.log(error)
        }
        
    };
    

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
                        {selectedImages.slice(0, 9).map((image, index) => (
                            <div className={`${style.selectedImages}`} key={index}>
                                <img src={image} alt={`Selected ${index}`} />
                                <label onClick={() => handleDeleteImage(index)}>
                                    <i className="bx bx-trash"></i>
                                </label>
                            </div>
                        ))}
                        <input
                            id="selectedImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                        {selectedImages.length < 9 ? (
                            <label
                                htmlFor="selectedImage"
                                className={`${style.labelSelected}`}
                            >
                                <i class="bx bx-image-add"></i>
                                <span>Thêm hình ảnh ({selectedImages.length}/9)</span>
                            </label>
                        ) : null}
                    </div>
                </div></div>
            <div className={`${style.productName}`}>
                <label>Tên sản phẩm</label>
                <input type="text" placeholder="Tên sản phẩm..." onChange={(e) => { setname(e.target.value) }}></input>
            </div>
            <div className={`${style.price}`}>
                <label>Giá sản phẩm</label>
                <input type="number" placeholder="Giá sản phẩm..." onChange={(e) => { setprice(e.target.value) }}></input>
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
                            <option key={index} value={value.id}>{value.type_category}</option>)
                    })}
                </select>
                {valueCategory !== "" ? (
                    <select
                        value={valueCategoryItem}
                        onChange={handleChangeCategoryItem}
                        className={`${style.optionSelectType}`}
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
            <div className={`${style.quantity}`}>
                <label>Số lượng</label>
                <input
                    type="number"
                    placeholder="Số lượng..."
                    onChange={(e) => {
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
            <button className={`${style.buttonCreateProduct}`} onClick={handleSubmitAdd}>LƯU SẢN PHẨM</button>
        </React.Fragment >
    );
}
export default AddProduct;