import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "../css/user/contact.css";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";

function ContactInfo() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_nc9zmfr",
        "template_rbvp4kb",
        form.current,
        "P6iZRWlAwj-Yj6GoE"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div>
      <MainNavbar />

      <form ref={form} onSubmit={sendEmail}>
        <label>Name</label>
        <input type="text" name="user_name" />
        <label>Email</label>
        <input type="email" name="user_email" />
        <label>Message</label>
        <textarea name="message" />
        <input type="submit" value="Send" />
      </form>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center"></div>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="wrapper">
                <div className="row no-gutters mb-5">
                  <div className="col-md-7">
                    <div className="contact-wrap w-100 p-md-5 p-4">
                      <h3 className="mb-4">Liên hệ với chúng tôi</h3>
                      <div id="form-message-warning" className="mb-4"></div>
                      <div id="form-message-success" className="mb-4">
                        Tin nhắn của bạn đã được gửi, cảm ơn bạn!
                      </div>
                      <form
                        method="POST"
                        id="contactForm"
                        name="contactForm"
                        className="contactForm"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="label" for="name">
                                Tên đầy đủ
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                id="name"
                                placeholder="Nguyễn Văn A"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="label" for="email">
                                Địa chỉ email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder="info@gmail.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-12 mt-2">
                            <div className="form-group">
                              <label className="label" for="subject">
                                Tiêu đề
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="subject"
                                id="subject"
                                placeholder="Cửa hàng A, sản phẩm 1..."
                              />
                            </div>
                          </div>
                          <div className="col-md-12 mt-2">
                            <div className="form-group">
                              <label className="label" for="#">
                                Nội dung
                              </label>
                              <textarea
                                name="message"
                                className="form-control"
                                id="message"
                                cols="30"
                                rows="4"
                                placeholder="Rất tốt, tốt...."
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-md-12 mt-2">
                            <div className="form-group">
                              <button className="btn btn-primary">
                                {" "}
                                Gửi phản hồi{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-5 d-flex mt-4 align-items-stretch">
                    <div id="map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443980540085!2d106.62348867451811!3d10.853796757762948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a20d8555e69%3A0x743b1e9558fb89e0!2sQTSC%209%20Building!5e0!3m2!1svi!2s!4v1698402331114!5m2!1svi!2s"
                        width="600"
                        height="450"
                        style={{ border: "0" }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="dbox w-100 text-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span
                          className="fa fa-map-marker"
                          style={{ color: "#f5f5f5" }}
                        ></span>
                      </div>
                      <div className="text">
                        <p>
                          <span>Địa chỉ:</span> Tòa nhà QTSC 9 (Tòa T) - Tô Ký,
                          Phường Tân Chánh Hiệp, Quận 12, TP.Hồ Chí Minh
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dbox w-100 text-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span
                          className="fa fa-phone"
                          style={{ color: "#f5f5f5" }}
                        ></span>
                      </div>
                      <div className="text">
                        <p>
                          <span>Số điện thoại:</span>{" "}
                          <a href="tel://0999000999">0999000999</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dbox w-100 text-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span
                          className="fa fa-paper-plane"
                          style={{ color: "#f5f5f5" }}
                        ></span>
                      </div>
                      <div className="text">
                        <p>
                          <span>Email:</span>{" "}
                          <a href="mailto:diamondshop@gmail.com">
                            diamondshop@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="dbox w-100 text-center">
                      <div className="icon d-flex align-items-center justify-content-center">
                        <span
                          className="fa fa-globe"
                          style={{ color: "#f5f5f5" }}
                        ></span>
                      </div>
                      <div className="text">
                        <p>
                          <span>Website</span> <a href="#">yoursite.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}

export default ContactInfo;
