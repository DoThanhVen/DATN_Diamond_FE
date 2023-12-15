import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ThongBao } from "../service/ThongBao";
import Cookies from "js-cookie";
import { useEffect } from "react";
import LoadingOverlay from "../service/loadingOverlay";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [renewpassword, setReNewPassword] = useState("");
  const [valicode, setValiCode] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const domain = process.env.REACT_APP_API || "http://localhost:8080";
  const [emailDisabled, setEmailDisabled] = useState(false);
  const loadCountdownFromStorage = () => {
    const savedCountdown = sessionStorage.getItem("countdown");
    if (savedCountdown) {
      setCountdown(parseInt(savedCountdown, 10));
    }
  };

  const saveCountdownToStorage = (countdownValue) => {
    sessionStorage.setItem("countdown", countdownValue.toString());
  };

  useEffect(() => {
    loadCountdownFromStorage();
  }, []);

  useEffect(() => {
    const mail = sessionStorage.getItem("email");
    let intervalId;
    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          saveCountdownToStorage(prevCountdown - 1);
          return prevCountdown - 1;
        });
      }, 1000);
      setEmail(mail);
    } else {
      setDisableButton(false);
      clearInterval(intervalId);
    }
    if (countdown === 0) {
      setEmailDisabled(false);
      setDisableButton(false);
    } else {
      setEmailDisabled(true);
      setDisableButton(true);
    }
    return () => clearInterval(intervalId);
  }, [countdown]);


  const handleForgot = async () => {
    if (email === "") {
      ThongBao("Vui lòng nhập địa chỉ email của bạn!", "error");
    } else {
      setIsLoading(true)
      axios
        .post(domain + "/api/account/forgot", { email })
        .then((response) => {
          setIsLoading(false)
          ThongBao(response.data.message, response.data.status);
          if (response.data.status === "success") {
            const timeCookie = new Date();
            timeCookie.setTime(timeCookie.getTime() + 5 * 60 * 1000);
            Cookies.set("codeForgot", response.data.data, {
              expires: timeCookie
            });
            setDisableButton(true);
            setCountdown(5 * 60);
            setEmailDisabled(true);
            sessionStorage.setItem("email", email);
          }

        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleChangePass = async () => {
    const code = Cookies.get("codeForgot");
    if (code !== "" && Cookies.get("codeForgot") === undefined) {
      ThongBao("Mã OTP đã hết hạn!", "error");
    } else if (valicode === "" || newpassword === "" || renewpassword === "") {
      ThongBao("Vui lòng nhập đầy đủ thông tin!", "error");
    } else if (valicode !== code) {
      ThongBao("Mã xác nhận không chính xác!", "error");
    } else if (newpassword.length < 6) {
      ThongBao("Độ dài tối thiểu của mật khẩu là 8 ký tự!", "error");
    } else if (newpassword !== renewpassword) {
      ThongBao("Mật khẩu xác nhận không khớp!", "error");
    } else {
      axios
        .post(domain + "/api/account/" + email + "/" + newpassword)
        .then((response) => {
          ThongBao(response.data.message, response.data.status);
          if (response.data.status === "success") {
            Cookies.remove("codeForgot")
            const delay = setTimeout(() => {
              navigate("/login");
            }, 800);
            return () => clearTimeout(delay);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <React.Fragment>
      <div>
        <div className="container padding-bottom-3x mb-2">
          <div className="row justify-content-center">
            <div
              className="col-lg-8 col-md-10  border p-4 "
              style={{ marginTop: "120px", borderRadius: "10px" }}
            >
              <h2>Quên mật khẩu?</h2>
              <p>
                Thay đổi mật khẩu của bạn trong hai bước đơn giản. Điều này giúp
                giữ mật khẩu mới của bạn an toàn.
              </p>
              <ol className="list-unstyled">
                <li>
                  <span className="text-primary text-medium">1. </span>Điền địa
                  chỉ email của bạn dưới đây.
                </li>
                <li>
                  <span className="text-primary text-medium">2. </span>Chúng tôi
                  sẽ gửi cho bạn mã OTP xác nhận để đổi mật khẩu.
                </li>
              </ol>
              <form className="card mt-4">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="email-for-pass">
                      Vui lòng nhập địa chỉ email của bạn:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="email"
                      value={email}
                      required=""
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (sessionStorage.getItem("email")) {
                          sessionStorage.removeItem("email")
                        }
                      }
                      }
                      disabled={emailDisabled}
                    />
                    <small className="form-text text-muted">
                      Nhập địa chỉ email bạn đã sử dụng khi đăng ký. Sau đó,
                      chúng tôi sẽ gửi mã OTP qua email đến địa chỉ này.
                    </small>
                    <br />
                    <button
                      className="btn btn-success px-4"
                      type="button"
                      onClick={handleForgot}
                      disabled={disableButton || emailDisabled}
                    >
                      GỬI MÃ {countdown > 0 ? `(${Math.floor(countdown / 60)}:${countdown % 60})` : ""}
                    </button>
                  </div>
                  <div className="form-group">
                    <label htmlFor="code">Mã xác nhận</label>
                    <input
                      className="form-control"
                      type="text"
                      id="code"
                      required=""
                      onChange={(e) => setValiCode(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newpassword">Mật khẩu mới</label>
                    <input
                      className="form-control"
                      type="password"
                      id="newpassword"
                      required=""
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="renewpassword">Nhập mật khẩu mới</label>
                    <input
                      className="form-control"
                      type="password"
                      id="renewpassword"
                      required=""
                      onChange={(e) => setReNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-success px-4"
                    type="button"
                    onClick={handleChangePass}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <LoadingOverlay isLoading={isLoading} />
    </React.Fragment>
  );
}
export default ForgotPass;
