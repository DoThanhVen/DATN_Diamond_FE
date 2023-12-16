import React, { useEffect, useRef, useState } from "react";
import style from "../../css/admin/category/listcategory.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory, getIdcategoryItemUpdate, getIdcategoryUpdate, reloadPage } from "../../service/Actions";
import { callAPI } from "../../service/API";
import { Pagination } from "@mui/material";
import moment from "moment";
import LoadingOverlay from "../../service/loadingOverlay";
function ListCategory() {
  const [listCategory, setlistcategory] = useState([])
  const reload = useSelector((state) => state.getreloadPage);
  const dispatch = useDispatch();
  const numberPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setkeyword] = useState('');
  const [keyfind, setkeyfind] = useState('');
  const [reloadinPage, setreload] = useState(0)
  const [sortBy, setsortBy] = useState('')
  const [sortType, setsortType] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getdataCategory(currentPage)
  }, [reload,currentPage, reloadinPage, sortType]);

  const getdataCategory = async (page) => {
    setIsLoading(true);
    const response = await callAPI(`/api/category?key=${keyfind}&keyword=${keyword}&offset=${(page - 1)}&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}`, "GET");
    setlistcategory(response.content || []);
    setTotalPages(response.totalPages || 1);
    setIsLoading(false);
    dispatch(getAllCategory(response.content))
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  function formatDate(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  }
  return (
    <React.Fragment>
      <div className={style.listCategory}>
        <div className={style.heading}>
          <div className={style.column}>
            <label className={style.title}>Danh sách phân loại sản phẩm</label>
            <div className={`${style.formSearch}`}>
              <select
                className={`${style.optionSelect}`}
                value={keyfind}
                onChange={(e) => {
                  setkeyfind(e.target.value)
                }}
              >
                <option value="id">Mã danh mục</option>
                <option value="type_category">Tên danh mục</option>
              </select>
              <input
                className={`${style.inputSearch}`}
                type="text"
                onChange={(e) => {
                  setkeyword(e.target.value)
                }}
              />
              <button className={`${style.buttonSearch}`} onClick={() => { setreload(reloadinPage + 1) }}>Tìm Kiếm</button>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className={`${style.sort}`}>
          <label>Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setsortBy(e.target.value)
            }}
            className={`ms-2 ${style.optionSelect}`}
          >
            <option value="">Lựa chọn...</option>
            <option value={'id'}>
              Mã danh mục
            </option>
            <option value={'type_category'}>
              Tên danh mục
            </option>
            <option value={'create_date'}>
              Ngày tạo
            </option>
          </select>
          {sortBy !== ''
            ? <select
              value={sortType}
              onChange={(e) => {
                setsortType(e.target.value)
              }}
              className={`${style.optionSelect}`}
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
            : null}
        </div>
        <div className={style.table}>
          <div className={style.tableHeading}>
            <label className={style.column}>Mã</label>
            <label className={style.column}>Hình ảnh</label>
            <label className={style.column}>Tên loại</label>
            <label className={style.column}>Danh sách loại</label>
            <label className={style.column}>Ngày tạo</label>
            <label className={style.column}>Trạng thái</label>
            <label className={style.column}></label>
          </div>
          {listCategory.map((value, index) => (
            <div key={value.id} className={style.tableBody}>
              <label className={style.column}>{value.id}</label>
              <label className={style.column}>
                <img
                  className={style.image}
                  src={value.image}
                  alt="Hình Ảnh"
                ></img>
              </label>
              <label className={style.column}>{value.type_category}</label>
              <div className={style.column}>
                <ul className={style.menu}>
                  {value.listCategory?.map((valueCategory, indexCategory) => (
                    <li key={indexCategory} className={style.menuItem}>
                      {valueCategory.type_category_item}
                      <i className="ms-2 bi bi-pencil-square" onClick={() => {
                        dispatch(getIdcategoryItemUpdate(valueCategory.id));
                      }}></i>

                    </li>
                  ))}
                </ul>
              </div>
              <label className={style.column}>{formatDate(value.create_date)}</label>
              <label className={style.column}>
                <span
                  className={style.status}
                  style={{ backgroundColor: value.status ? "green" : "red" }}
                >
                  {value.status ? "Đang hoạt động" : "Dừng hoạt động"}
                </span>
              </label>
              <label className={style.column}>
                <i className="bi bi-pencil-square" onClick={() => {
                  dispatch(getIdcategoryUpdate(value.id));
                }}></i>
              </label>
            </div>
          ))}
        </div>
        <div className={style.paginationContainer} style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
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
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}

export default ListCategory;