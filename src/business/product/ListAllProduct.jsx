import React, { useEffect, useRef, useState } from "react";
import style from "../../css/business/product.module.css";
import ModelEdit from "./updateProduct";
import { callAPI } from "../../service/API";
import { useSelector } from "react-redux";
import moment from "moment";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router";
import { GetDataLogin } from "../../service/DataLogin";
import ModalAction from "../../service/ModalAction";
import { ThongBao } from "../../service/ThongBao";
import axios from "axios";
import LoadingOverlay from "../../service/loadingOverlay";
import { deleteImageFromFirebaseStorage } from "../../service/firebase";
import ProductService from "../../service/ProductService";

const numberPage = 10;
function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  });
  return formatter.format(price - price * (promotion / 100));
}
function formatDate(date) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

export default function ListProduct() {

  const navigate = useNavigate();
  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    const log = sessionStorage.getItem('accessToken')
    settoken(log)
    if (accountLogin !== null) {
      try {
        getdataProduct(currentPage, accountLogin.shop.id);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      navigate("/login");
    }
  };

  const reload = useSelector((state) => state.getreloadPage);
  //MODEL EDIT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [datacategory, setcategorydata] = useState([]);
  const [categoryItemData, setcategoryItem] = useState([]);
  const [valueCategory, setValueCategory] = useState("");
  const [valueCategoryItem, setValueCategoryItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [reloadinPage, setreload] = useState(0);
  const [sortBy, setsortBy] = useState("");
  const [sortType, setsortType] = useState("");
  const [token, settoken] = useState();
  const [filterbyStatus, setFilterStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getdataCategory();
    getAccountFromSession();
  }, [reload, currentPage, reloadinPage, sortType, filterbyStatus]);

  function handleClickEditProduct(event) {
    const rowElement = event.currentTarget.parentElement.parentElement;
    const columns = Array.from(rowElement.querySelectorAll("label"));
    const id = columns[1].innerText;
    setModalData({
      id,
      datacategory,
      getdataProduct
    });
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({});
  };

  const getdataProduct = async (page, idShop) => {
    try {
      setIsLoading(true);
      const response = await callAPI(
        `/api/product/search?key=${valueOption}&keyword=${textInput}&category=${valueCategoryItem}&shop=${idShop}&offset=${(page - 1)
        }&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}&status=${filterbyStatus}&isActive=`,
        "GET"
      );
      setIsLoading(false);
      setProducts(response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getdataCategory = async () => {
    const reponse = await callAPI(`/api/category?sizePage=10000`, "GET");
    if (reponse) {
      setcategorydata(reponse.content);
    }
  };

  const getdataCategoryItem = async (id) => {
    const reponseItem = await callAPI(`/api/category/${id}`, "GET");
    if (reponseItem) {
      setcategoryItem(reponseItem.listCategory);
    }
  };

  //FORM SEARCH
  const [valueOption, setValueOption] = useState("id");
  const [textInput, setTextInput] = useState("");

  //LOẠI SẢN PHẨM
  const handleChangeCategory = (event) => {
    const selectedOptionValue = event.target.value;
    setValueCategory(selectedOptionValue);
    if (selectedOptionValue !== "") {
      getdataCategoryItem(event.target.value);
    }
    if (selectedOptionValue === "") {
      setValueCategoryItem("");
    }
  };

  const handleChangeCategoryItem = (event) => {
    const selectedOptionValue = event.target.value;
    if (selectedOptionValue !== "") {
      setValueCategoryItem(selectedOptionValue);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await ModalAction("Bạn có chắc muốn xóa sản phẩm này?", "warning");
    if (isConfirmed) {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };
      setIsLoading(true);
      const reponse = await ProductService.getProductbyId(id);
      reponse.image_product?.map(async (item) => {
        await deleteImageFromFirebaseStorage(item.url)
      })
      const res = await callAPI(`/api/auth/product/delete/${id}`, "DELETE", {}, config);
      setIsLoading(false);
      if (res) {
        ThongBao(res.message, res.status)
        setreload(reloadinPage + 1)
      }
    }
  };

  const exportExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/product/exportProductsToExcel', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Failed to export to Excel');
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };


  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post(
          'http://localhost:8080/api/auth/product/importProductsFromExcel',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Import successful!', response.data);
        setreload(reloadinPage + 1)
      } catch (error) {
        console.error('Import failed!', error);
      }
    } else {
      console.error('Please select a file to import!');
    }
  };

  const shutdownProduct = async (id) => {
    const isConfirmed = await ModalAction("Bạn có chắc muốn ngừng hoạt động sản phẩm này?", "warning");
    if (isConfirmed) {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };

      const res = await callAPI(`/api/auth/product/shutdownProduct/${id}`, 'GET', {}, config)
      if (res && res.status === 'success') {
        ThongBao(res.message, res.status)
        setreload(reloadinPage + 1)
      }
    }
  }
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <React.Fragment>
      <div className={`${style.action}`}>
        <div className={`${style.formSearch}`}>
          <select
            value={valueOption}
            onChange={(e) => {
              setValueOption(e.target.value);
            }}
            className={`${style.optionSelect}`}
          >
            <option value="id">Mã Sản Phẩm</option>
            <option value="product_name">Tên Sản Phẩm</option>
          </select>
          <input
            className={`${style.inputSearch}`}
            type="text"
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
        <div className={`${style.typeProduct}`}>
          <label>Danh mục</label>
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
                  </option>
                );
              })}
            </select>
          ) : null}
        </div>
        <button
          className={`${style.buttonSearch}`}
          onClick={() => setreload(reloadinPage + 1)}
        >
          Tìm Kiếm
        </button>
      </div>

      <div className={`${style.typeProduct}`}>
        <label>Sắp xếp</label>
        <select
          value={sortBy}
          onChange={(e) => {
            setsortBy(e.target.value);
          }}
          className={`${style.optionSelectType}`}
        >
          <option value="">Lựa chọn...</option>
          <option value={"id"}>Mã sản phẩm</option>
          <option value={"product_name"}>Tên sản phẩm</option>
          <option value={"price"}>Giá</option>
          <option value={"create_date"}>Ngày tạo</option>
        </select>
        {sortBy !== "" ? (
          <select
            value={sortType}
            onChange={(e) => {
              setsortType(e.target.value);
            }}
            className={`${style.optionSelectType}`}
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        ) : null}
      </div>
      <div className={style.typeProduct}>
        <label>Trạng thái:</label>
        <select
          value={filterbyStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
          }}
          className={`ms-2 ${style.optionSelect}`}
        >
          <option value="">Tất cả</option>
          <option value="0">Chờ Phê Duyệt</option>
          <option value="1">Đang Hoạt Động</option>
          <option value="2">Dừng Hoạt Động</option>
          <option value="3">Cấm Hoạt Động</option>
        </select>
      </div>
      <div className={style.groupButtonExcel}>
        <button onClick={exportExcel} className={style.export_excel}>
          Xuất Excel
        </button>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button onClick={handleButtonClick} className={style.import_excel}>
            Nhập Excel
          </button>
        </div>
      </div>
      <div className={`${style.listProduct}`}>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>STT</label>
            <label className={style.column}>Mã SP</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên SP</label>
            <label className={style.column}>Loại SP</label>
            <label className={style.column}>Giá SP</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column} />
            <label className={style.column} />
          </div>
          {products?.content?.map((value, index) => (
            <div key={index} className={style.tableBody}>
              <label className={style.column}>{((currentPage - 1) * 10) + index + 1}</label>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                {Array.isArray(value.image_product) ? (
                  value.image_product?.map((item, index) => (
                    <img
                      key={index}
                      className={style.image}
                      src={item.url ? item.url : "/images/nullImage.png"}
                      alt="Hình Ảnh"
                    />
                  ))
                ) : (
                  <img
                    className={style.image}
                    src={`/images/nullImage.png`}
                    alt="Hình Ảnh"
                  />
                )}
              </label>
              <label className={style.column}>{value.product_name}</label>
              <label className={style.column}>
                {value.categoryItem_product.type_category_item}
              </label>
              <label className={style.column}>
                {formatCurrency(value.price, 0)}
              </label>
              <label className={style.column}>
                <span
                  className={style.status}
                  style={{
                    backgroundColor:
                      value.status === 0
                        ? "#34219E"
                        : value.status === 1
                          ? "green"
                          : value.status === 2
                            ? "red"
                            : "#E74C3C"
                  }}
                  value={`${value.status}`}
                >
                  {value.status === 0
                    ? "Chờ Phê Duyệt"
                    : value.status === 1
                      ? "Đang Hoạt Động"
                      : value.status === 2
                        ? "Ngừng Hoạt Động"
                        : value.status === 3
                          ? "Cấm hoạt động"
                          : "Lỗi"}
                </span>
              </label>
              <label className={style.column}>
                {formatDate(value.create_date)}
              </label>
              <label className={style.column}>
                {value.status === 0 || value.status === 1 ? (
                  <i
                    className={`bi bi-pencil-square ${style.buttonEdit}`}
                    onClick={handleClickEditProduct}
                  />
                ) : (
                  null
                )
                }
              </label>
              <label className={style.column}>
                {value.status === 0 ? (
                  <i
                    className={`bi bi-trash ${style.buttonDelete}`}
                    onClick={() => handleDelete(value.id)}
                  />
                ) : value.status === 1 ? (
                  <button className={style.button_ban} onClick={() => { shutdownProduct(value.id) }}>Ngừng hoạt động</button>
                ) : <span/>}
              </label>
            </div>
          ))}
        </div>
        <div
          className={style.paginationContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            boundaryCount={2}
            variant="outlined"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
          />
        </div>
      </div>
      {isModalOpen && (
        <ModelEdit
          onReload={getdataProduct}
          data={modalData}
          closeModal={closeModal}
        />
      )}
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}
