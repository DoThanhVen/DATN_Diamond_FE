import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Pattern, Update } from "@mui/icons-material";
import { callAPI } from "../service/API";
import { ThongBao } from "../service/ThongBao";
import Cookies from "js-cookie";
import { useEffect } from "react";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [renewpassword, setReNewPassword] = useState("");
  const [valicode, setValiCode] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const domain = process.env.REACT_APP_API || "http://localhost:8080";

  const handleForgot = async () => {
    if (email === "") {
      ThongBao("Vui lòng nhập địa chỉ email của bạn!", "error");
    } else {
      axios
        .post(domain + "/api/account/forgot", { email })
        .then((response) => {
          ThongBao(response.data.message, response.data.status);
          if (response.data.status === "success") {
            const timeCookie = new Date();
            timeCookie.setTime(timeCookie.getTime() + 5 * 60 * 1000);
            Cookies.set("codeForgot", response.data.data, {
              expires: timeCookie
            });
            setCode(Cookies.get("codeForgot"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChangePass = async () => {
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
                      required=""
                      onChange={(e) => setEmail(e.target.value)}
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
                    >
                      GỬI MÃ
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
    </React.Fragment>
  );
}
export default ForgotPass;
