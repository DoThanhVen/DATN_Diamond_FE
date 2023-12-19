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
import { GetDataLogin } from "../../service/DataLogin";
import ModalAction from "../../service/ModalAction";
import { uploadImageToFirebaseStorage } from "../../service/firebase";
import LoadingOverlay from "../../service/loadingOverlay";
import { callAPI } from "../../service/API";

function EditCategory() {
  const [accountLogin, setAccountLogin] = useState(null);
  const [token, settoken] = useState(null);

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    const tokenac = sessionStorage.getItem('accessToken');
    settoken(tokenac)
    if (accountLogin !== null) {
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
  const [image, setimage] = useState("");
  const [imageNew, setimageNew] = useState("");
  const [listCategory, setListcategory] = useState([]);
  const [reload, setreload] = useState(0);
  const [category, setcategory] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //GET DATA REDUX
  const data = useSelector(state => state.allDataCategory);
  const idCategory = useSelector(state => state.idCategoryUpdate);
  const idCategoryItem = useSelector(state => state.idCategoryItemUpdate);
  const reloadold = useSelector(state => state.getreloadPage);
  useEffect(
    () => {
      getdataCategory();
    },
    [reload]
  );
  useEffect(
    () => {
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

    },
    [reload, data, idCategory, idCategoryItem, listCategory]
  );
  const getdataCategory = async () => {
    const response = await callAPI(`/api/category?key=&keyword=&offset=0&sizePage=10000`, "GET");
    setListcategory(response.content);
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

  const getCategoryId = async () => {
    try {
      const data = await CategoryService.getAllCategoryById(idCategory);
      dispatch(getIdcategoryUpdate(data.id));
      setTypeCate(data.type_category);
      setimage(data.image);
      setcategory(data)
    } catch (error) {
      ThongBao("Có lỗi xảy ra. Thử lại", "error");
    }
  };

  //Category
  const handleAddCategory = async () => {
    const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
    if (type_category.trim() === "" || imageNew === null) {
      ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
    } else if (type_category.length > 24) {
      ThongBao("Độ dài của loại sản phẩm không được quá 24 ký tự.", "error");
    } else if (!isAlphaWithSpace(type_category)) {
      ThongBao("Tên loại sản phẩm chứa kí tự không hợp lệ.", "error");
    } else {
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        try {
          setIsLoading(true);
          const downloadURL = await uploadImageToFirebaseStorage(imageNew);
          const response = await CategoryService.addCategory(
            type_category,
            downloadURL,
            accountLogin.id,
            token
          );
          setIsLoading(false);
          if (response) {
            ThongBao(response.message, response.status);
            dispatch(getIdcategoryUpdate(0));
            dispatch(reloadPage(reloadold + 1));
            setTypeCate('');
            setimage(null);
            setSelectedImage(null);
            setimage("");
            setcategory({})
            setreload(reload + 1);
          }
        } catch (error) {
          ThongBao("Thêm loại sản phẩm thất bại!", "error");
        }
      }
    }
  };


  const handleUpdateCategory = async () => {
    const isAlphaWithSpace = (str) => /^[A-Za-z\sáÁàÀảẢãÃạẠăĂắẮằẰẳẲẵẴặẶâÂấẤầẦẩẨẫẪậẬđĐéÉèÈẻẺẽẼẹẸêÊếẾềỀểỂễỄệỆíÍìÌỉỈĩĨịỊóÓòÒỏỎõÕọỌôÔốỐồỒổỔỗỖộỘơƠớỚờỜởỞỡỠợỢúÚùÙủỦũŨụỤưỨỨừỪửỬữỮựỰýÝỳỲỷỶỹỸỵỴ]+$/.test(str);
    if (type_category.trim() === "") {
      ThongBao("Vui lòng điền đầy đủ dữ liệu.", "error");
    } else if (type_category.length > 24) {
      ThongBao("Độ dài của loại sản phẩm không được quá 24 ký tự.", "error");
    } else if (!isAlphaWithSpace(type_category)) {
      ThongBao("Tên loại sản phẩm chứa kí tự không hợp lệ.", "error");
    } else {
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        try {
          if (selectedImage === null) {
            setIsLoading(true);
            const result = await CategoryService.updateCategory(
              idCategory,
              type_category,
              image,
              token
            );
            setIsLoading(false);
            if (result) {
              ThongBao(result.message, result.status);
              dispatch(getIdcategoryUpdate(0));
              dispatch(reloadPage(reloadold + 1));
              setTypeCate('');
              setimage(null);
              setSelectedImage(null);
              setimage("")
              setcategory({})
              setreload(reload + 1);
            }
          } else {
            setIsLoading(true);
            const downloadURL = await uploadImageToFirebaseStorage(imageNew);
            const result = await CategoryService.updateCategory(
              idCategory,
              type_category,
              downloadURL,
              token
            );
            setIsLoading(false);
            if (result) {
              ThongBao(result.message, result.status);
              dispatch(getIdcategoryUpdate(0));
              dispatch(reloadPage(reloadold + 1));
              setTypeCate('');
              setimage(null);
              setSelectedImage(null);
              setimage("")
              setcategory({})
              setreload(reload + 1);
            }
          }
        } catch (error) {
          ThongBao("Có lỗi xảy ra. Thử lại", "error");
        }
      }
    }
  };

  const handleDeleteCategory = async () => {
    const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
    if (isConfirmed) {
      try {
        setIsLoading(true);
        const reponse = await CategoryService.deleteCategory(idCategory, token);
        setIsLoading(false);
        if (reponse.status === "success") {
          ThongBao(reponse.message, reponse.status);
          dispatch(getIdcategoryUpdate(0));
          dispatch(reloadPage(reloadold + 1));
          setTypeCate('');
          setimage(null);
          setSelectedImage(null);
          setimage("")
          setcategory({})
          setreload(reload + 1);
        } else {
          ThongBao(reponse.message, reponse.status);
        }
      } catch (error) {
        ThongBao("Có lỗi xảy ra. Thử lại", "error");
      }

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
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        try {
          const reponse = await CategoryService.addCategoryItem(
            valueCategory,
            type_categoryItem,
            accountLogin.id,
            token
          );
          if (reponse.status === "success") {
            ThongBao(reponse.message, reponse.status);
            dispatch(reloadPage(reloadold + 1));
            dispatch(getIdcategoryItemUpdate(0));
          } else {
            ThongBao(reponse.message, reponse.status);
            dispatch(reloadPage(reloadold + 1));
          }
        } catch (error) {
          ThongBao("Có lỗi xảy ra. Thử lại", "error");
        }
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
        const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
        if (isConfirmed) {
          try {
            const result = await CategoryService.updateCategoryItem(
              categoryItem.id,
              valueCategory,
              type_categoryItem,
              accountLogin.id,
              token
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
      };
    } else {
      const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
      if (isConfirmed) {
        try {
          const result = await CategoryService.updateCategoryItem(
            categoryItem.id,
            valueCategory,
            type_categoryItem,
            accountLogin.id,
            token
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
  }
  const handleDeleteCategoryItem = async () => {
    const isConfirmed = await ModalAction("Bạn có chắc muốn thực hiện hành động này?", "warning");
    if (isConfirmed) {
      try {
        const reponse = await CategoryService.deleteCategoryItem(idCategoryItem, token);
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
                : image !== ""
                  ? <img
                    className={style.image}
                    src={image}
                    alt="Hình Ảnh"
                  />
                  : null}
              <div className={style.action}>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="inputImage"
                  accept="image/*"
                  defaultValue={image}
                  onChange={handleImageChange}
                />
                <label htmlFor="inputImage" className={style.button}>
                  TẢI ẢNH
                </label>
                <label className={style.title}>
                  Được phép JPG hoặc PNG. Kích thước tối đa 800KB
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
                setimage("");
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
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}

export default EditCategory;
