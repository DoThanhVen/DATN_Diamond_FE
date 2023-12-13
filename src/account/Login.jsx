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

function encodeObjectToBase64(obj) {
  const jsonString = JSON.stringify(obj);
  const base64String = btoa(unescape(encodeURIComponent(jsonString)));
  return base64String;
}


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await callAPI(`/api/login`, 'POST', {
      username: username,
      password: password
    })
    if (response.status === 'success') {
      sessionStorage.setItem('accessToken', response.data.token)
      const base64String = encodeObjectToBase64(response.data.data);
      sessionStorage.setItem("accountLogin", base64String);
      navigate("/")
    } else {
      ThongBao(response.message, response.status)
    }
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
        const base64String = encodeObjectToBase64(response.data.data);
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
                            type="submit"
                            className="btn btn-primary"
                            onClick={(e) => handleLogin(e)}
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
