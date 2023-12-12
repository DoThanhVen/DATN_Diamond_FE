import React from "react";
import "../page_user/css/user/login.css";
import style from "../page_user/css/user/login.module.css";
import MainNavbar from "../page_user/components/Navbar";
import Footer from "../page_user/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router";
import { callAPI } from "../service/API";
import Cookies from "js-cookie";
import axios from "axios";
import { ThongBao } from "../service/ThongBao";
import { signInWithGoogle } from "../service/firebase";

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await callAPI(`/api/login`, 'POST', {
      username: username,
      password: password
    })
    console.log(response)
    if (response.status === 'success') {
      console.log(response.data.token)
      sessionStorage.setItem('accessToken', response.data.token)
      const base64String = utf8_to_b64(JSON.stringify(response.data.data));
      sessionStorage.setItem("accountLogin", base64String);
      navigate("/")
    } else {
      ThongBao(response.message, response.status)
    }

    // axios
    //   .post(domain + `/api/account/login`, {
    //     username,
    //     password
    //   })
    //   .then((response) => {
    //     if(response.data.status === "success"){
    //       const data = {
    //         id_account: response.data.data.id,
    //         username: response.data.data.username,
    //         create_date: response.data.data.create_date,
    //         role: response.data.data.listRole.map((value) => value.role.role_name),
    //         gender: response.data.data.infoAccount.gender,
    //         address: []
    //       };
    //       //INFO ACCOUNT
    //       if (response.data.data.infoAccount && response.data.data.infoAccount.fullname) {
    //         data.fullname = response.data.data.infoAccount.fullname;
    //       }

    //       if (response.data.data.infoAccount && response.data.data.infoAccount.image) {
    //         data.image = response.data.data.infoAccount.image;
    //       }

    //       if (response.data.data.infoAccount && response.data.data.infoAccount.id_card) {
    //         data.id_card = response.data.data.infoAccount.id_card;
    //       }

    //       if (response.data.data.infoAccount && response.data.data.infoAccount.phone) {
    //         data.phone = response.data.data.infoAccount.phone;
    //       }

    //       if (response.data.data.infoAccount && response.data.data.infoAccount.email) {
    //         data.email = response.data.data.infoAccount.email;
    //       }

    //       if (response.data.data.shop) {
    //         data.shop = response.data.data.shop;
    //       }

    //       if (response.data.data.address_account) {
    //         response.data.data.address_account.forEach((value) => {
    //           data.address.push(value);
    //         });
    //       }

    //       //ENCODE
    //       const base64String = utf8_to_b64(JSON.stringify(data));

    //       sessionStorage.setItem("accountLogin",base64String);
    //       navigate("/");
    //     }else{
    //       ThongBao(response.data.message,"error")
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  const Login = async () => {
    const res = await signInWithGoogle();
    if (res) {
      const formData = new FormData();
      formData.append('email', res.user.email)
      formData.append('displayName', res.user.displayName)
      const response = await callAPI('/api/registerWithGoogle', 'POST', formData)
      if (response && response.status === 'success') {
        sessionStorage.setItem('accessToken', response.data.token)
        const base64String = utf8_to_b64(JSON.stringify(response.data.data));
        sessionStorage.setItem("accountLogin", base64String);
        navigate("/")
      } else {
        ThongBao(response.message, response.status)
      }
    }
  }

  return (
    <>
      <nav>
        <MainNavbar />
      </nav>
      <div id="main-wrapper" className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card border-0 ">
              <div className="card-body p-0">
                <div className="row no-gutters">
                  <div className="col-lg-6">
                    <div className="p-5">
                      <h6 className="h5 mb-0">
                        Chào mừng đến với Diamond Shop!
                      </h6>
                      <p className="text-muted mt-2 mb-3">
                        Vui lòng điền đầy đủ thông tin đăng nhập.
                      </p>
                      <form>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Tài khoản</label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="form-group mb-5 mt-4">
                          <label htmlFor="exampleInputPassword1">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center ">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleLogin()}
                          >
                            Đăng nhập
                          </button>
                          <a
                            href="/forgotPassword"
                            className="forgot-link float-right text-primary"
                          >
                            Quên mật khẩu?
                          </a>
                        </div>
                        <div className="or mt-4">
                          <span>hoặc</span>
                        </div>
                        <div className={style.groupButtonAuth}>
                          <button type="button" className={style.button} onClick={Login}>
                            <i className="bi bi-google"></i> Đăng nhập với
                            Google
                          </button>
                          <button type="submit" className={style.button}>
                            <i className="bi bi-facebook"></i> Đăng nhập với
                            Facebook
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="mt-3">
                      <img
                        src="images/san-thuong-mai-dien-tu-la-gi.webp"
                        alt=""
                        style={{ height: "400px" }}
                      ></img>
                    </div>
                    <p className="text-muted text-center mt-3 mb-0">
                      Bạn không có tài khoản?{" "}
                      <a href="/register" className="text-primary ml-1">
                        Đăng ký
                      </a>
                    </p>
                  </div>
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
export default Login;
