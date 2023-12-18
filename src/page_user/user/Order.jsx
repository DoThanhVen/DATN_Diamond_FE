import React, { useEffect, useState } from "react";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { ThongBao } from "../../service/ThongBao";
import { GetDataLogin } from "../../service/DataLogin";
import { callAPI } from "../../service/API";
import { useNavigate } from "react-router";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function OrderList() {
  const [orders, setOrders] = useState([]);
  const [load, isLoad] = useState(false);
  const [listStatus, setListStatus] = useState([]);

  const accountLogin = GetDataLogin();
  const accessToken = sessionStorage.getItem('accessToken')

  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  };
  const fectAPI = async () => {
    const response = await callAPI(`/api/auth/order/find/account/${accountLogin.id}`, 'GET', {}, config);
    const responseStatus = await callAPI(`/api/get/status`, 'GET');
    setListStatus(responseStatus.data)
    setOrders(response.data)


  };
  const handleFindOrders = async (status) => {
    const response = await callAPI(`/api/auth/order/find/account/${accountLogin.id}?status=1`, 'GET', {}, config);
    setOrders(response.data)
  };
  console.log(listStatus)
  useEffect(() => {
    fectAPI();
  }, [load]);

  const handelRemoveOrder = async (id) => {
    const response = await callAPI(`/api/auth/order/update/${id}/account/${accountLogin.id}?status=8`, 'PUT', {}, config);
    if(response.status === 'SUCCESS'){
      isLoad(!load);
      ThongBao("Huỷ thành công!", "Thông báo")
    }else {
      ThongBao("Lỗi","error")
    }
  };
  const ButtonCancel = ({ id, status }) => {
    if (status == 1) {
      return (
        <button
          style={{ border: "none", padding: 6, borderRadius: 4 }}
          onClick={() => {
            handelRemoveOrder(id);
          }}
        >
          Huỷ đặt
        </button>
      );
    }
  };
  const convertDate = (date) => {
    let fm = new Date(date).toLocaleDateString("vi-VI", { timeZone: "UTC" });
    return fm;
  };

  const [value, setValue] = React.useState(0);

  const handleChange = async (id) => {
    const response = await callAPI(`/api/auth/order/find/account/${accountLogin.id}?status=${id}`, 'GET', {}, config);
    setOrders(response.data)
  };

  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-xl-12 mt-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">Đơn hàng của tôi</h5>
                <div>
                  <ul>
                    {listStatus.map((item) => (
                    <li onClick={() => {
                      handleChange(item.id)
                    }}>
                      {item.name}
                    </li>
                     ))}
                  </ul>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr className="align-self-center">
                        <th>Mã hóa đơn</th>
                        <th>Địa chỉ nhận hàng</th>
                        <th> Ngày lập</th>
                        <th> Tổng tiền</th>
                        <th>Trang thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((item) => (
                        <tr key={item.id}>
                          <td className="text-start">HD23{item.id}</td>
                          <td className="text-start">
                            {item?.address_order}
                          </td>
                          <td className="text-start">
                            {convertDate(item.create_date)}
                          </td>
                          <td className="text-start">{item.total}</td>
                          <td className="text-start">
                            <span className="badge badge-boxed bg-warning text-dark">
                              {item.status[item.status.length - 1].status.name}
                            </span>
                          </td>

                          <td>
                            {" "}
                            <a href={`/orderDetail/${item.id}`}>
                              {" "}
                              Xem chi tiết{" "}
                            </a>{" "}
                          </td>
                          <td>
                            <ButtonCancel onClick
                              id={item.id}
                              status={
                                item?.status[item.status.length - 1].status.id
                              }
                            ></ButtonCancel>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}
export default OrderList;

// import React, { useEffect, useState } from "react";
// import MainNavbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { GetDataLogin } from "../../service/DataLogin";
// import { callAPI } from "../../service/API";
// import { ThongBao } from "../../service/ThongBao";

// function OrderList() {
//   // const [selectedTab, setSelectedTab] = useState("chuaGiao"); // Default tab
//   const [orders, setOrders] = useState([]);
//   const [load, isLoad] = useState(false);


//   const accountLogin = GetDataLogin();
//   const accessToken = sessionStorage.getItem('accessToken')
//   const config = {
//     headers: {
//       "Authorization": `Bearer ${accessToken}`
//     }
//   };
//   const fectAPI = async () => {
//     const response = await callAPI(`/api/auth/order/find/account/${accountLogin.id}`, 'GET', {}, config);
//     setOrders(response.data)

//   };

//   useEffect(() => {
//     fectAPI();
//   }, [load]);

//   const handelRemoveOrder = async (id) => {
//     const response = await callAPI(`/api/auth/order/update/${id}/account/${accountLogin.id}?status=6`, 'PUT', {}, config);
//     if (response.status == 'SUCCESS') {
//       isLoad(!load);
//       ThongBao("Huỷ thành công!", "Thông báo")
//     } else {
//       ThongBao("Lỗi", "error")
//     }
//   };
//   const handleTabChange = (tab) => {
//     // setSelectedTab(tab);
//   };

//   //   const toggleDetailVisibility = (itemID) => {
//   //     setDetailsVisibleForItem(detailsVisibleForItem === itemID ? null : itemID);
//   //   };

//   // const renderTableContent = () => {
//   //   const data = {
//   //     chuaGiao: [
//   //       {
//   //         id: "ID001",
//   //         name: "Product 1",
//   //         image: "https://www.bootdey.com/image/380x380/008B8B/000000",
//   //         description: "Description for Product 1",
//   //         store: "Store A",
//   //         price: "$15,000",
//   //         quantity: 2,
//   //         status: "chưa giải quyết",
//   //         additionalDetails: { totalPrice: "$30,000" },
//   //       },
//   //       {
//   //         id: "ID007",
//   //         name: "Product 8",
//   //         image: "https://www.bootdey.com/image/380x380/008B8B/000000",
//   //         description: "Description for Product 1",
//   //         store: "Store F",
//   //         price: "$15,000",
//   //         quantity: 4,
//   //         status: "chưa giải quyết",
//   //         additionalDetails: { totalPrice: "$30,000" },
//   //       },
//   //     ],
//   //     daGiao: [
//   //       {
//   //         id: "ID002",
//   //         name: "Product 2",
//   //         image: "https://www.bootdey.com/image/380x380/008B8B/000000",
//   //         description: "Description for Product 2",
//   //         store: "Store B",
//   //         price: "$20,000",
//   //         quantity: 1,
//   //         status: "đã giao",
//   //         additionalDetails: { totalPrice: "$20,000" },
//   //       },
//   //     ],
//   //     daHuy: [
//   //       // Data for Đã hủy tab
//   //       {
//   //         id: "ID003",
//   //         name: "Product 3",
//   //         image: "https://www.bootdey.com/image/380x380/008B8B/000000",
//   //         description: "Description for Product 3",
//   //         store: "Store C",
//   //         price: "$10,000",
//   //         quantity: 3,
//   //         status: "đã hủy",
//   //         additionalDetails: { totalPrice: "$30,000" },
//   //       },
//   //     ],
//   //   };

//   //   const handleCancelOrder = (itemID) => {
//   //     // Implement the logic for canceling the order
//   //     console.log(`Cancel order clicked for item ${itemID}`);
//   //   };

//   //   return (

//   //   );
//   // };

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "chưa giải quyết":
//         return "bg-warning text-dark";
//       case "đã giao":
//         return "bg-success text-white";
//       case "đã hủy":
//         return "bg-danger text-white";
//       default:
//         return "";
//     }
//   };

//   const handleBuyAgain = (itemID) => {
//     console.log(` ${itemID}`);
//   };
//   console.log(orders)
//   return (
//     <>
//       <nav>
//         <MainNavbar />
//       </nav>
//       <div className="container mb-4">
//         <div className="row">
//           <div className="col-xl-12 mt-4">
//             <div className="card">
//               <div className="card-body">
//                 <h5 className="header-title pb-3 mt-0">Đơn hàng của tôi</h5>

//                 {/* Tab navigation */}
//                 <ul className="nav nav-tabs">
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${'chuaGiao' === "chuaGiao" ? "active" : ""
//                         }`}
//                       onClick={() => handleTabChange("chuaGiao")}
//                       style={{
//                         backgroundColor:
//                           "chuaGiao" === "chuaGiao" ? "red" : "",
//                         color: "chuaGiao" === "chuaGiao" ? "white" : "",
//                         borderRadius: 0,
//                       }}
//                     >
//                       Chưa giao
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${"daGiao" === "daGiao" ? "active" : ""
//                         }`}
//                       onClick={() => handleTabChange("daGiao")}
//                       style={{
//                         backgroundColor: "daGiao" === "daGiao" ? "red" : "",
//                         color: "daGiao" === "daGiao" ? "white" : "",
//                         borderRadius: 0,
//                       }}
//                     >
//                       Đã giao
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${"daHuy" === "daHuy" ? "active" : ""
//                         }`}
//                       onClick={() => handleTabChange("daHuy")}
//                       style={{
//                         backgroundColor: "daHuy" === "daHuy" ? "red" : "",
//                         color: "daHuy" === "daHuy" ? "white" : "",
//                         borderRadius: 0,
//                       }}
//                     >
//                       Đã hủy
//                     </button>
//                   </li>
//                 </ul>
//                 <div className="table-responsive">
//                   <table className="table table-hover mb-0">
//                     <tbody>
//                       {orders?.map((item) => (
//                         <React.Fragment key={item.id}>
//                           <tr>
//                             <td className="text-start" colSpan="2">
//                               <div>
//                                 <img
//                                   src={''}
//                                   style={{ width: "80px", height: "80px" }}
//                                   alt=""
//                                   className="avatar-lg rounded"
//                                 />
//                               </div>
//                               <div className="mt-4">
//                                 <div className="col-lg-8 mb-4 d-flex">
//                                   <img
//                                     src="images/banner_style.jpg"
//                                     className="rounded-circle shop-image"
//                                     alt="Diamond_Fashion"
//                                     style={{
//                                       width: "50px",
//                                       height: "50px",
//                                       borderRadius: "50%",
//                                     }}
//                                   />
//                                   <div className="shop-name ms-4 ">
//                                     <b>{}</b> <br />
//                                     <span>Địa chỉ shop</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="text-start">
//                               <p>Số lượng: {item.quantity}</p>
//                               <p> Giá: {}</p>
//                             </td>
//                             <td className="text-start"></td>
//                             <td className="text-start"></td>
//                             <td className="text-start">
//                               <span
//                                 // className={`badge badge-boxed ${getStatusBadgeClass(
//                                 //   item.status
//                                 // )}`}
//                               >
//                                 {/* {item.status} */}
//                               </span>
//                             </td>
//                             <td colSpan="2" className="text-end">
//                               <div className="additional-details">
//                                 <p>Tổng tiền: {item.total}</p>
//                               </div>
//                               <div className="button-group">
//                                 {item.status === "chưa giải quyết" && (
//                                   <button
//                                     className="btn btn-danger"
//                                     style={{ marginRight: "10px" }}

//                                   >
//                                     Hủy mua
//                                   </button>
//                                 )}
//                                 {/* {["đã giao", "đã hủy"].includes(item.status) && (
//                                   <button
//                                     className="btn btn-success"
//                                     style={{ marginRight: "10px" }}
            
//                                   >
//                                     Mua lại
//                                   </button>
//                                 )} */}
//                                 <button className="btn btn-secondary">Xem chi tiết</button>
//                               </div>
//                             </td>
//                           </tr>
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div >
//       <div id="footer">
//         <Footer />
//       </div>
//     </>
//   );
// }

// export default OrderList;