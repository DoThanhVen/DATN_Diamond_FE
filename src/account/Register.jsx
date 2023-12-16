import React from "react";
import MainNavbar from "../page_user/components/Navbar";
import Footer from "../page_user/components/Footer";
import style from "../page_user/css/user/register.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ThongBao } from "../service/ThongBao";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { callAPI } from "../service/API";
import LoadingOverlay from "../service/loadingOverlay";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [email, setEmail] = useState("");
  const [checkEmail, setCheckEmail] = useState("");
  const [validateCode, setValidateCode] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const domain = process.env.REACT_APP_API || "http://localhost:8080";
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const clearInput = () => {
    setUsername("");
    setPassword("");
    setRepassword("");
    setCode("");
    setEmail("");
    setCheckEmail("");
    setCheckbox(false);
    Cookies.remove("codeRegister");
  };

  useEffect(() => {
    let intervalId;
    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      setDisableButton(false);
      clearInterval(intervalId);
    }
    if (countdown === 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
    return () => clearInterval(intervalId);
  }, [countdown]);


  const handleValidate = async (e) => {
    if (
      username === "" ||
      password === "" ||
      email === "" ||
      repassword === ""
    ) {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else {
      setIsLoading(true);
      axios
        .post(domain + "/api/account/" + email)
        .then((response) => {
          setIsLoading(false);
          if (response.data.success) {
            ThongBao(response.data.message, "success");
            const timeCookie = new Date();
            timeCookie.setTime(timeCookie.getTime() + 5 * 60 * 1000);
            Cookies.set("codeRegister", response.data.data, {
              expires: timeCookie
            });
            setCheckEmail(email);
            setValidateCode(response.data.data);
            setDisableButton(true);
            setCountdown(5 * 60);
          } else {
            ThongBao(response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleRegis = async (e) => {
    if (username === "" || password === "" || email === "" || code === "") {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else if (email !== checkEmail) {
      ThongBao("Email không khớp với email đã xác nhận!", "error");
    } else if (
      validateCode !== "" &&
      Cookies.get("codeRegister") === undefined
    ) {
      ThongBao("Mã OTP đã hết hạn!", "error");
    } else {
      if (checkbox === false) {
        ThongBao(
          "Vui lòng đồng ý với các điều khoản trước khi đăng ký!",
          "error"
        );
      } else {
        if (password === repassword) {
          if (code === validateCode) {
            const response = await callAPI(`/api/register`, 'POST', {
              username: username,
              password: password,
              email: email
            })
            if (response.status === 'success') {
              ThongBao(response.message, response.status);
              clearInput();
              const delay = setTimeout(() => {
                navigate("/login");
              }, 800);
              return () => clearTimeout(delay);
            } else {
              ThongBao(response.message, response.status);
            }
          } else {
            ThongBao("Mã xác nhận không chính xác!", "error");
          }
        } else {
          ThongBao("Mật khẩu không trùng khớp!", "error");
        }
      }
    }
  };
  return (
    <div>
      <nav>
        <MainNavbar />
      </nav>
      <div id="main-wrapper" className="container ">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card border-0 ">
              <div className="card-body p-0">
                <div className="row no-gutters">
                  <div className="col-lg-6 ">
                    <div className="mt-3">
                      <img
                        src="images/register.png"
                        alt=""
                        style={{ height: "400px" }}
                      />
                    </div>
                    <p className="text-muted text-center mt-3 mb-0">
                      Bạn đã có tài khoản?{" "}
                      <a href="/login" className="text-primary ml-1">
                        Đăng nhập
                      </a>
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-4">
                      <h6 className="h5 mb-0">
                        Chào mừng đến với Diamond Shop!
                      </h6>
                      <p className="text-muted mt-2 mb-4">
                        Vui lòng nhập tất cả thông tin vào form bên dưới.
                      </p>
                      <form className="row g-3">
                        <div className="col-12">
                          <label htmlFor="inputUsername" className="form-label">
                            Tài khoản:
                          </label>
                          <input
                            type="text"
                            className={`form-control ${style.input}`}
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="inputAddress2" className="form-label">
                            Mật khẩu:
                          </label>
                          <input
                            type="password"
                            className={`form-control ${style.input}`}
                            id="passwordd"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="inputAddress2" className="form-label">
                            Nhập lại mật khẩu:
                          </label>
                          <input
                            type="password"
                            className={`form-control ${style.input}`}
                            id="repassword"
                            onChange={(e) => setRepassword(e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="inputAddress2" className="form-label">
                            Email
                          </label>
                          <input
                            type="text"
                            className={`form-control ${style.input}`}
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-8">
                          <input
                            type="text"
                            className={`form-control ${style.input}`}
                            id="code"
                            placeholder="CODE"
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => handleValidate()}
                            disabled={disableButton}
                          >
                            GỬI MÃ {countdown > 0 ? `(${Math.floor(countdown / 60)}:${countdown % 60})` : ""}
                          </button>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkBox"
                              onChange={() => setCheckbox(!checkbox)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gridCheck"
                            >
                              Đã đọc và đồng ý với các{" "}
                              <a href="/policy">chính sách và điều khoản</a>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleRegis}
                          >
                            Đăng ký
                          </button>
                        </div>
                      </form>
                    </div>
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
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}
