import React, { useEffect, useState } from "react";
import style from "../../css/admin/product/listproduct.module.css";
// ... (other imports)

function ListProduct() {
  const dispatch = useDispatch();
  // ... (other state variables)

  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    getdata(currentPage);
  }, [data, currentPage, reload, sortType]);

  const getdata = async (page) => {
    try {
      const response = await callAPI(`/api/product/getAll?key=${keyfind}&keyword=${keyword}&offset=${(page - 1) * numberPage}&sizePage=${numberPage}&sort=${sortBy}&sortType=${sortType}`, "GET");
      const responseData = response.data;
      setProducts(responseData || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ... (other functions)

  return (
    <React.Fragment>
      <div className={style.listProduct}>
        {/* Existing JSX code */}
        <div className={style.typeProduct}>
          <label>Lọc sản phẩm theo trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
            }}
            className={`${style.optionSelectType}`}
          >
            <option value="">Tất cả</option>
            <option value="0">Chờ Phê Duyệt</option>
            <option value="1">Đang Hoạt Động</option>
            <option value="2">Cấm Hoạt Động</option>
          </select>
        </div>

        {/* Existing JSX code */}
        <div className={style.table}>
          {/* Existing JSX code */}
          {products?.content
            ?.filter((value) => {
              if (filterStatus === '') {
                return true;
              } else {
                return value.status.toString() === filterStatus;
              }
            })
            .map((value, index) => (
              <div key={index} className={style.tableBody}>
                {/* Existing JSX code */}
              </div>
            ))}
        </div>
        {/* Existing JSX code */}
        <div className={style.paginationContainer}>
          {/* Existing JSX code */}
        </div>
      </div>
      {/* Existing JSX code */}
    </React.Fragment>
  );
}

export default ListProduct;
