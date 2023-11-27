import React, { useState, useEffect } from "react";
import "../css/user/suggestedProducts.css";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/user/responsive.css";

const API_BASE_URL = "http://localhost:8080";

const SidebarM = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API
    axios
      .get(`${API_BASE_URL}/api/category`)
      .then((response) => {
        setCategories(response.data.content);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="col-xs-12 col-sm-12 col-md-3 sidebar">
        <div className="col-xs-12 col-sm-12 col-md-3 sidebar">
          <div className="sidebar-widget hot-deals outer-bottom-xs bg-white">
            <ul className="list-group list-group-flush">
              <button
                type="button"
                className="list-group-item list-group-item-action active"
                aria-current="true"
              >
                <i className="fa fa-bars"></i> Danh mục
              </button>
              {categories.map((category) => (
                <li key={category.id} className="list-group-item">
                  <Link to={`/category/${category.id}`}>
                    {category.type_category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sidebar-widget hot-deals outer-bottom-xs bg-white mt-4">
          <h5 className="section-title">
            {" "}
            <strong>Ưu đãi lớn</strong>{" "}
          </h5>
          <div className="owl-carousel sidebar-carousel custom-carousel owl-theme outer-top-ss">
            <div className="item">
              <div className="products">
                <div className="hot-deal-wrapper">
                  <div className="image">
                    <a href="#">
                      <img src="images/best-saler-4.jpg" alt="" />
                      <img
                        src="images/best-saler-2.jpg"
                        alt=""
                        className="hover-image"
                      />
                    </a>
                  </div>
                  <div className="sale-offer-tag">
                    <span>
                      49%
                      <br />
                      off
                    </span>
                  </div>
                  <div className="timing-wrapper">
                    <div className="box-wrapper">
                      <div className="date box">
                        <span className="key">120</span>
                        <span className="value">DAYS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="hour box">
                        <span className="key">20</span>
                        <span className="value">HRS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="minutes box">
                        <span className="key">36</span>
                        <span className="value">MINS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="seconds box">
                        <span className="key">60</span>
                        <span className="value">SEC</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-info text-left m-t-20">
                  <h3 className="name">
                    <a href="detail.html">Floral Print Buttoned</a>
                  </h3>
                  <div className="rating rateit-small"></div>
                  <div className="product-price">
                    <span className="price"> $600.00 </span>
                    <span className="price-before-discount">$800.00</span>
                  </div>
                </div>

                <div className="cart clearfix animate-effect">
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#319F43 ", color: "#fff" }}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="products">
                <div className="hot-deal-wrapper">
                  <div className="image">
                    <a href="#">
                      <img src="images/best-saler-4.jpg" alt="" />
                      <img
                        src="images/best-saler-2.jpg"
                        alt=""
                        className="hover-image"
                      />
                    </a>
                  </div>
                  <div className="sale-offer-tag">
                    <span>
                      35%
                      <br />
                      off
                    </span>
                  </div>
                  <div className="timing-wrapper">
                    <div className="box-wrapper">
                      <div className="date box">
                        <span className="key">120</span>
                        <span className="value">Days</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="hour box">
                        <span className="key">20</span>
                        <span className="value">HRS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="minutes box">
                        <span className="key">36</span>
                        <span className="value">MINS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="seconds box">
                        <span className="key">60</span>
                        <span className="value">SEC</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-info text-left m-t-20">
                  <h3 className="name">
                    <a href="detail.html">Floral Print Buttoned</a>
                  </h3>
                  <div className="rating rateit-small"></div>
                  <div className="product-price">
                    <span className="price"> $600.00 </span>
                    <span className="price-before-discount">$800.00</span>
                  </div>
                </div>

                <div className="cart clearfix animate-effect">
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#319F43 ", color: "#fff" }}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="products">
                <div className="hot-deal-wrapper">
                  <div className="image">
                    <a href="#">
                      <img src="images/best-saler-4.jpg" alt="" />
                      <img
                        src="images/best-saler-3.jpg"
                        alt=""
                        className="hover-image"
                      />
                    </a>
                  </div>
                  <div className="sale-offer-tag">
                    <span>
                      35%
                      <br />
                      off
                    </span>
                  </div>
                  <div className="timing-wrapper">
                    <div className="box-wrapper">
                      <div className="date box">
                        <span className="key">120</span>
                        <span className="value">Days</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="hour box">
                        <span className="key">20</span>
                        <span className="value">HRS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="minutes box">
                        <span className="key">36</span>
                        <span className="value">MINS</span>
                      </div>
                    </div>
                    <div className="box-wrapper">
                      <div className="seconds box">
                        <span className="key">60</span>
                        <span className="value">SEC</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-info text-left m-t-20">
                  <h3 className="name">
                    <a href="detail.html">Floral Print Buttoned</a>
                  </h3>
                  <div className="rating rateit-small"></div>
                  <div className="product-price">
                    <span className="price"> $600.00 </span>
                    <span className="price-before-discount">$800.00</span>
                  </div>
                </div>

                <div className="cart clearfix animate-effect">
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#319F43 ", color: "#fff" }}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-widget product-tag bg-white mt-4">
          <h5 className="section-title">
            {" "}
            <strong>Tags</strong>{" "}
          </h5>
          <div className="sidebar-widget-body outer-top-xs">
            <div className="tag-list">
              <a className="item" title="Phone" href="category.html">
                Phone
              </a>
              <a className="item active" title="Vest" href="category.html">
                Vest
              </a>
              <a className="item" title="Smartphone" href="category.html">
                Smartphone
              </a>
              <a className="item" title="Furniture" href="category.html">
                Furniture
              </a>
              <a className="item" title="T-shirt" href="category.html">
                T-shirt
              </a>
              <a className="item" title="Sweatpants" href="category.html">
                Sweatpants
              </a>
              <a className="item" title="Sneaker" href="category.html">
                Sneaker
              </a>
              <a className="item" title="Toys" href="category.html">
                Toys
              </a>
              <a className="item" title="Rose" href="category.html">
                Rose
              </a>
            </div>
          </div>
        </div>
        <div className="sidebar-widget outer-bottom-small bg-white mt-4">
          <h5>
            {" "}
            <strong className="section-title">Ưu đãi đặc biệt</strong>{" "}
          </h5>
          <div className="sidebar-widget-body outer-top-xs">
            <div className="owl-carousel sidebar-carousel special-offer custom-carousel owl-theme outer-top-xs">
              <div className="item">
                <div className="products special-product">
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img src="images/best-saler-4.jpg" alt="" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img src="images/best-saler-1.jpg" alt="" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img
                                  src="images/best-saler-2.jpg"
                                  alt="image"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="products special-product">
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img src="images/best-saler-3.jpg" alt="" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img src="images/best-saler-5.jpg" alt="" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product">
                    <div className="product-micro">
                      <div className="row product-micro-row">
                        <div className="col col-xs-5">
                          <div className="product-image">
                            <div className="image">
                              <a href="#">
                                <img src="images/best-saler-3.jpg" alt="" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col col-xs-7">
                          <div className="product-info">
                            <h3 className="name">
                              <a href="#">Floral Print Shirt</a>
                            </h3>
                            <div className="rating rateit-small"></div>
                            <div className="product-price">
                              <span className="price"> $450.99 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="item">
                    <div className="products special-product">
                      <div className="product">
                        <div className="product-micro">
                          <div className="row product-micro-row">
                            <div className="col col-xs-5">
                              <div className="product-image">
                                <div className="image">
                                  <a href="#">
                                    <img
                                      src="images/best-saler-4.jpg"
                                      alt="images"
                                    />
                                    <div className="zoom-overlay"></div>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col col-xs-7">
                              <div className="product-info">
                                <h3 className="name">
                                  <a href="#">Floral Print Shirt</a>
                                </h3>
                                <div className="rating rateit-small"></div>
                                <div className="product-price">
                                  <span className="price"> $450.99 </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="product">
                        <div className="product-micro">
                          <div className="row product-micro-row">
                            <div className="col col-xs-5">
                              <div className="product-image">
                                <div className="image">
                                  <a href="#">
                                    <img
                                      src="images/best-saler-5.jpg"
                                      alt=""
                                    />
                                    <div className="zoom-overlay"></div>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col col-xs-7">
                              <div className="product-info">
                                <h3 className="name">
                                  <a href="#">Floral Print Shirt</a>
                                </h3>
                                <div className="rating rateit-small"></div>
                                <div className="product-price">
                                  <span className="price"> $450.99 </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="product">
                        <div className="product-micro">
                          <div className="row product-micro-row">
                            <div className="col col-xs-5">
                              <div className="product-image">
                                <div className="image">
                                  <a href="#">
                                    <img
                                      src="images/best-saler-4.jpg"
                                      alt="image"
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="col col-xs-7">
                              <div className="product-info">
                                <h3 className="name">
                                  <a href="#">Floral Print Shirt</a>
                                </h3>
                                <div className="rating rateit-small"></div>
                                <div className="product-price">
                                  <span className="price"> $450.99 </span>
                                </div> </div>
                            </div></div></div> </div>
                    </div>
                  </div> */}
            </div>
          </div>
        </div>
        {/* <div className="sidebar-widget newsletter outer-bottom-small bg-white mt-4">
          <h3 className="section-title">Newsletters</h3>
          <div className="sidebar-widget-body outer-top-xs">
            <p>Sign Up for Our Newsletter!</p>
            <form>
              <div className="form-group">
                <label className="sr-only" htmlFor="exampleInputEmail1">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Subscribe to our newsletter"
                />
              </div>
              <button className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default SidebarM;
