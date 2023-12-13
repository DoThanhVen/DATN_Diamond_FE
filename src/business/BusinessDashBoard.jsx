import React, { useState, useEffect } from "react";
import Home from "./Home";
import Bill from "./bill/Bill";
import Product from "./product/Product";
import Storge from "./storge/Storge";
import Shop from "./shop/Shop";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "../css/business/nav.module.css";
import Nav from "react-bootstrap/Nav";
import { GetDataLogin } from "../service/DataLogin";
import { ThongBao } from "../service/ThongBao";

function Navbar() {
  const [accountLogin, setAccountLogin] = useState(null);
  const navigate = useNavigate();

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();

    if (accountLogin !== null) {
      console.log(accountLogin)
      const isAdmin = accountLogin.authorities.some(role => role.authority === 'ROLE_Admin' || role.authority === 'ROLE_Bussiness');
      const isStatus = accountLogin.shop.status===1;
      if (isAdmin) {
        if (isStatus) {
          try {
            setAccountLogin(accountLogin);
          } catch (error) {
            console.log(error);
          }
        }else{
          ThongBao("Cửa hàng của bạn đã bị cấm hoạt động. Liên hệ Admin để được giải quyết","error")
          navigate("/");
        }

      } else {
        navigate("/not-found");
      }

    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    getAccountFromSession();
  }, []);

  const location = useLocation();
  const isActiveHome = location.pathname === "/business";
  const isActiveBill = location.pathname === "/business/bill";
  const isActiveProduct = location.pathname === "/business/product";
  const isActiveStorge = location.pathname === "/business/storge";
  const isActiveEditShop = location.pathname === "/business/shop";
  //SHOW THÔNG BÁO
  const [activeNotifycation, setNotifycation] = useState(false);
  //SHOW MENU
  const [activeMenu, setActiveMenu] = useState(false);

  //DANH SÁCH MENU
  const menuItems = [
    {
      id: 0,
      label: "Trang Chủ",
      icon: "bi bi-house",
      mapping: "/business",
      active: isActiveHome
    },
    {
      id: 1,
      label: "Quản Lý Đơn Hàng",
      icon: "bi bi-receipt",
      mapping: "/business/bill",
      active: isActiveBill
    },
    {
      id: 2,
      label: "Quản Lý Sản Phẩm",
      icon: "bi bi-handbag",
      mapping: "/business/product",
      active: isActiveProduct
    },
    {
      id: 3,
      label: "Quản Lý Kho Hàng",
      icon: "bx bx-store-alt",
      mapping: "/business/storge",
      active: isActiveStorge
    },
    {
      id: 4,
      label: "Thông Tin Cửa Hàng",
      icon: "bi bi-pencil-square",
      mapping: "/business/shop",
      active: isActiveEditShop
    }
  ];

  const styleMenuActive = {
    color: "#8F6D02",
    backgroundColor: "#F8EECE",
    borderRadius: "10px"
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accountLogin");
    const delay = setTimeout(() => {
      navigate("/");
    }, 800);
    return () => clearTimeout(delay);
  };

  return (
    <React.Fragment>
      <div id={style.businessDashBoard}>
        <div className={`${style.header}`}>
          <div className={`${style.logo}`}>
            <img src="/images/diamond.png" alt="Hình Ảnh" />
            <Nav.Link href="/business">Kênh Người Bán</Nav.Link>
          </div>
          <div className={`${style.others}`}>
            <div className={`${style.account}`}>
              <img
                className={style.image}
                src={
                  accountLogin &&
                    accountLogin.infoAccount &&
                    accountLogin.infoAccount.image
                    ? `http://localhost:8080/api/uploadImageProduct/${accountLogin
                      .infoAccount.image}`
                    : "https://bootdey.com/img/Content/avatar/avatar7.png"
                }
                alt="Hình Ảnh"
              />
              <label className={`${style.label} ms-2`}>
                {accountLogin && accountLogin.fullname}
              </label>
            </div>
            <div
              className={`${style.logout} ms-2 me-2`}
              onClick={() => handleLogout()}
            >
              <i className="bi bi-door-open"></i>
              Đăng xuất
            </div>
          </div>
        </div>
        <div className={`${style.menu} ${activeMenu ? style.active : ""}`}>
          {menuItems.map(item =>
            <Link
              to={`${item.mapping}`}
              onClick={() => setActiveMenu(false)}
              className={`p-0 ${style.li}`}
            >
              <div
                className={`${style.menuItem}`}
                style={item.active ? styleMenuActive : {}}
              >
                <label>
                  <i className={`${item.icon}`} /> {item.label}
                </label>
              </div>
            </Link>
          )}
        </div>
        <div className={`${style.content}`}>
          {isActiveHome ? <Home /> : null}
          {isActiveBill ? <Bill /> : null}
          {isActiveProduct ? <Product /> : null}
          {isActiveStorge ? <Storge /> : null}
          {isActiveEditShop ? <Shop /> : null}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Navbar;
