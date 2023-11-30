import React, { useEffect, useRef, useState } from "react";
import style from "../../css/admin/category/editcategory.module.css";
import CategoryService from "../../service/CategoryService";
import { useDispatch, useSelector } from "react-redux";
import {
  getIdcategoryItemUpdate,
  getIdcategoryUpdate,
  reloadPage
} from "../../service/Actions";
import { ThongBao } from "../../service/ThongBao";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { GetDataLogin } from "../../service/DataLogin";

function EditCategory() {
  const [accountLogin, setAccountLogin] = useState(null);

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== undefined) {
      try {
        setAccountLogin(accountLogin);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    getAccountFromSession();
  }, []);

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [type_category, setTypeCate] = useState("");
  const [type_categoryItem, setTypeCateItem] = useState("");
  const [valueCategory, setValueCategory] = useState();
  const [categoryItem, setcategoryItem] = useState({});
  const [image, setimage] = useState(null);
  const [listCategory, setListcategory] = useState([]);
  const [reload, setreload] = useState(0);
  const [imageload, setimageload] = useState("");
  const [category, setcategory] = useState({});
  const navigate = useNavigate();
  //GET DATA REDUX
  const data = useSelector(state => state.allDataCategory);
  const idCategory = useSelector(state => state.idCategoryUpdate);
  const idCategoryItem = useSelector(state => state.idCategoryItemUpdate);
  const reloadold = useSelector(state => state.getreloadPage);

  useEffect(
    () => {
      if (Array.isArray(data)) {
        setListcategory(data);
        if (listCategory !== null && idCategory !== 0 && idCategoryItem === 0) {
          getCategoryId();
        } else if (
          listCategory !== null &&
          idCategory === 0 &&
          idCategoryItem !== 0
        ) {
          getCategoryItemId();
        } else if (
          idCategory !== 0 &&
          idCategoryItem !== 0 &&
          listCategory !== null
        ) {
          getCategoryId();
          getCategoryItemId();
        }
      }
    },
    [reload, data, idCategory, idCategoryItem, listCategory]
  );

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file.size > 800 * 1024) {
      alert(
        "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 1MB."
      );
    } else {
      setimage(file);
      const reader = new FileReader();
      reader.onload = event => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryId = async () => {
    try {
      const data = await CategoryService.getAllCategoryById(idCategory);
      dispatch(getIdcategoryUpdate(data.id));
      setTypeCate(data.type_category);
      setimageload(data.image);
      setcategory(data)
    } catch (error) {
      ThongBao("Có lỗi xảy ra. Thử lại", "error");
    }
  };

  //Category
  const handleAddCategory = async () => {
    const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
    if (type_category.trim() === "" || image === null) {
      ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
    } else if (type_category.length > 24) {
      ThongBao("Độ dài của loại sản phẩm không được quá 24 ký tự.", "error");
    } else if (!isAlphaWithSpace(type_category)) {
      ThongBao("Tên loại sản phẩm chứa kí tự không hợp lệ.", "error");
    } else {
      try {
        const response = await CategoryService.addCategory(
          type_category,
          image,
          accountLogin.id_account
        );
        if (response.status === "success") {
          ThongBao(response.message, response.status);
          dispatch(getIdcategoryUpdate(0));
          dispatch(reloadPage(reloadold + 1));
          setTypeCate('');
          setimage(null);
          setSelectedImage(null);
          setimageload("");
          setcategory({})
        } else {
          ThongBao(response.message, response.status);
          dispatch(getIdcategoryUpdate(0));
          dispatch(reloadPage(reloadold + 1));
          setTypeCate('');
          setimage(null);
          setSelectedImage(null);
          setimageload("");
          setcategory({})
        }
      } catch (error) {
        ThongBao("Thêm loại sản phẩm thất bại!", "error");
      }
    }
  };


  const handleUpdateCategory = async () => {
    const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
    if (type_category !== category.type_category) {
      if (type_category.trim() === "") {
        ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
      } else if (type_category.length > 24) {
        ThongBao("Độ dài của loại sản phẩm không được quá 24 ký tự.", "error");
      } else if (!isAlphaWithSpace(type_category)) {
        ThongBao("Tên loại sản phẩm chứa kí tự không hợp lệ.", "error");
      } else {
        try {
          const result = await CategoryService.updateCategory(
            idCategory,
            type_category,
            image
          );
          if (result.status === "success") {
            ThongBao(result.message, result.status);
            dispatch(getIdcategoryUpdate(0));
            dispatch(reloadPage(reloadold + 1));
            setTypeCate('');
            setimage(null);
            setSelectedImage(null);
            setimageload("")
            setcategory({})
          } else {
            ThongBao(result.message, result.status);
            dispatch(getIdcategoryUpdate(0));
            dispatch(reloadPage(reloadold + 1));
            setTypeCate('');
            setimage(null);
            setSelectedImage(null);
            setimageload("")
            setcategory({})
          }
        } catch (error) {
          ThongBao("Có lỗi xảy ra. Thử lại", "error");
        }
      }
    } else {
      try {
        const result = await CategoryService.updateCategory(
          idCategory,
          type_category,
          image
        );
        if (result.status === "success") {
          ThongBao(result.message, result.status);
          dispatch(getIdcategoryUpdate(0));
          dispatch(reloadPage(reloadold + 1));
          setTypeCate('');
          setimage(null);
          setSelectedImage(null);
          setimageload("")
          setcategory({})
        } else {
          ThongBao(result.message, result.status);
          dispatch(getIdcategoryUpdate(0));
          dispatch(reloadPage(reloadold + 1));
          setTypeCate('');
          setimage(null);
          setSelectedImage(null);
          setimageload("")
          setcategory({})
        }
      } catch (error) {
        ThongBao("Có lỗi xảy ra. Thử lại", "error");
      }
    }


  };

  const handleDeleteCategory = async () => {
    try {
      const reponse = await CategoryService.deleteCategory(idCategory);
      if (reponse.status === "success") {
        ThongBao(reponse.message, reponse.status);
        dispatch(getIdcategoryUpdate(0));
        dispatch(reloadPage(reloadold + 1));
        setTypeCate('');
        setimage(null);
        setSelectedImage(null);
        setimageload("")
        setcategory({})
      } else {
        ThongBao(reponse.message, reponse.status);
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra. Thử lại", "error");
    }
  };

  //CategoryItem
  const handleAddCategoryItem = async () => {
    const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
    if (valueCategory === "" || type_categoryItem.trim() === "") {
      ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
    } else if (type_categoryItem.length > 24) {
      ThongBao("Độ dài của phân loại sản phẩm không được quá 24 ký tự.", "error");
    } else if (!isAlphaWithSpace(type_categoryItem)) {
      ThongBao("Tên phân loại sản phẩm chứa kí tự không hợp lệ.", "error");
    } else {
      try {
        const reponse = await CategoryService.addCategoryItem(
          valueCategory,
          type_categoryItem,
          accountLogin.id_account
        );
        if (reponse.status === "success") {
          ThongBao(reponse.message, reponse.status);
          dispatch(reloadPage(reloadold + 1));
          dispatch(getIdcategoryItemUpdate(reponse.data.id));
        } else {
          ThongBao(reponse.message, reponse.status);
          dispatch(reloadPage(reloadold + 1));
        }
      } catch (error) {
        ThongBao("Có lỗi xảy ra. Thử lại", "error");
      }
    }
  };

  const getCategoryItemId = async () => {
    try {
      if (idCategoryItem !== 0) {
        const data = await CategoryService.getAllCategoryItemById(
          idCategoryItem
        );
        const matchingCategory = listCategory.find(category =>
          category.listCategory.some(listItem => listItem.id === data.id)
        );
        if (matchingCategory) {
          setValueCategory(matchingCategory.id);
          setcategoryItem(data);
          setTypeCateItem(data.type_category_item);
        } else {
          setreload(reload + 1);
        }
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra. Thử lại", "error");
    }
  };

  const handleUpdateCategoryItem = async () => {
    if (categoryItem.type_category_item !== type_categoryItem) {
      const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
      if (valueCategory === "" || type_categoryItem.trim() === "") {
        ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
      } else if (type_categoryItem.length > 24) {
        ThongBao("Độ dài của phân loại sản phẩm không được quá 24 ký tự.", "error");
      } else if (!isAlphaWithSpace(type_categoryItem)) {
        ThongBao("Tên phân loại sản phẩm chứa kí tự không hợp lệ.", "error");
      } else {
        try {
          const result = await CategoryService.updateCategoryItem(
            categoryItem.id,
            valueCategory,
            type_categoryItem,
            accountLogin.id_account
          );
          if (result.status === "success") {
            ThongBao(result.message, result.status);
            setTypeCateItem(result.data.type_category_item)
            dispatch(reloadPage(reloadold + 1));
          } else {
            ThongBao(result.message, result.status);
          }
        } catch (error) {
          ThongBao("Có lỗi xảy ra. Thử lại", "error");
        }
      };
    } else {
      try {
        const result = await CategoryService.updateCategoryItem(
          categoryItem.id,
          valueCategory,
          type_categoryItem,
          accountLogin.id_account
        );
        if (result.status === "success") {
          ThongBao(result.message, result.status);
          setTypeCateItem(result.data.type_category_item)
          dispatch(reloadPage(reloadold + 1));
        } else {
          ThongBao(result.message, result.status);
        }
      } catch (error) {
        ThongBao("Có lỗi xảy ra. Thử lại", "error");
      }
    }
  }
  const handleDeleteCategoryItem = async () => {
    try {
      const reponse = await CategoryService.deleteCategoryItem(idCategoryItem);
      if (reponse.status === "success") {
        ThongBao(reponse.message, reponse.status);
        dispatch(getIdcategoryItemUpdate(0));
        dispatch(reloadPage(reloadold + 1));
      } else {
        ThongBao(reponse.message, reponse.status);
      }
    } catch (error) {
      ThongBao("Có lỗi xảy ra. Thử lại", "error");
    }
  };

  return (
    <React.Fragment>
      <div className={style.cardForm}>
        <div className={style.form}>
          <div className={style.column}>
            <label className={style.heading}>Loại sản phẩm</label>
            <div className={style.formImage}>
              {selectedImage !== null
                ? <img
                  className={style.image}
                  src={selectedImage}
                  alt="Hình Ảnh"
                />
                : imageload !== ""
                  ? <img
                    className={style.image}
                    src={`http://localhost:8080/api/uploadImageProduct/${imageload}`}
                    alt="Hình Ảnh"
                  />
                  : null}
              <div className={style.action}>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="inputImage"
                  accept="image/*"
                  defaultValue={imageload}
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
            <input
              className={style.inputText}
              type="text"
              id="idInputcategory"
              placeholder="Tên loại..."
              value={type_category}
              onChange={e => {
                setTypeCate(e.target.value);
              }}
            />
            <div className={style.formButton}>
              <button
                className={style.button}
                onClick={() => {
                  handleAddCategory();
                }}
                disabled={idCategory !== 0}
              >
                <i className="bi bi-plus-lg" /> THÊM
              </button>
              <button className={style.button} onClick={handleUpdateCategory}>
                <i className="bi bi-pencil-square" /> SỬA
              </button>
              <button className={style.button} onClick={handleDeleteCategory}>
                <i className="bi bi-x-lg" /> XÓA
              </button>
              <button className={style.button} onClick={() => {
                dispatch(getIdcategoryUpdate(0));
                setTypeCate('');
                setimage(null);
                setSelectedImage(null);
                setimageload("");
                setcategory({})
              }}>
                <i className="bi bi-arrow-clockwise" /> LÀM MỚI
              </button>
            </div>
          </div>
          <div className={style.column}>
            <label className={style.heading}>Phân loại sản phẩm</label>
            <select
              className={style.select}
              value={valueCategory}
              onChange={e => {
                setValueCategory(e.target.value);
              }}
            >
              <option value="">Lựa chọn</option>
              {listCategory.map((value, index) =>
                <option key={index} value={value.id}>
                  {value.type_category}
                </option>
              )}
            </select>
            <input
              className={style.inputText}
              type="text"
              id="idInputcategoryItem"
              placeholder="Tên phân loại..."
              value={type_categoryItem}
              onChange={e => {
                setTypeCateItem(e.target.value);
              }}
            />
            <div className={style.formButton}>
              <button
                className={style.button}
                onClick={() => handleAddCategoryItem()}
                disabled={idCategoryItem !== 0}
              >
                <i className="bi bi-plus-lg" /> THÊM
              </button>
              <button
                className={style.button}
                onClick={handleUpdateCategoryItem}
              >
                <i className="bi bi-pencil-square" /> SỬA
              </button>
              <button
                className={style.button}
                onClick={handleDeleteCategoryItem}
              >
                <i className="bi bi-x-lg" /> XÓA
              </button>
              <button className={style.button} onClick={() => {
                dispatch(getIdcategoryItemUpdate(0));
                setTypeCateItem('');
                setcategory({})
                setValueCategory('')
              }}>
                <i className="bi bi-arrow-clockwise" /> LÀM MỚI
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EditCategory;
