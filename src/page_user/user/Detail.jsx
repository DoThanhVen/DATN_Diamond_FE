import React, { useState, useEffect, useReducer } from "react";
import "../css/user/detail.css";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products } from "./data";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import swal from "sweetalert";
import Cookies from "js-cookie";
import listDataAddress from "../../service/AddressVietNam.json";
import style from "../css/user/detail.module.css";
const API_BASE_URL = "http://localhost:8080";

function localStateReducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCT":
      return { ...state, product: action.payload };
    case "SET_SHOP_NAME":
      return { ...state, shopName: action.payload };
    case "SET_SHOP_ADDRESS":
      return { ...state, shopAddress: action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_SHOP_DATA":
      return { ...state, shopData: action.payload };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    case "SET_SHOW_ALL_COMMENTS":
      return { ...state, showAllComments: action.payload };
    case "SET_SIMILAR_PRODUCTS":
      return { ...state, similarProducts: action.payload };
    default:
      return state;
  }
}

function ProductPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");

  const [accountLogin, setAccountLogin] = useState(null);
  const getAccountFromCookie = () => {
    const accountCookie = Cookies.get("accountLogin");
    if (accountCookie !== undefined) {
      try {
        const data = JSON.parse(
          decodeURIComponent(escape(window.atob(Cookies.get("accountLogin"))))
        );
        setAccountLogin(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAccountFromCookie();
  }, []);
  const { productId } = useParams();
  const [localState, dispatch] = useReducer(localStateReducer, {
    product: null,
    shopName: null,
    shopData: null,
    shopAddress: null,
    city: "",
    count: parseInt(localStorage.getItem("count")) || 14,
    showAllComments: false
  });

  const { product, shopName, shopData, shopAddress, count, showAllComments } =
    localState;

  const increaseCount = () => {
    dispatch({ type: "SET_COUNT", payload: count + 1 });
  };

  const decreaseCount = () => {
    if (count > 1) {
      dispatch({ type: "SET_COUNT", payload: count - 1 });
    }
  };

  const handleShowMoreClick = () => {
    dispatch({ type: "SET_SHOW_ALL_COMMENTS", payload: true });
  };

  useEffect(() => {
    // Save the count to local storage when it changes
    localStorage.setItem("count", count.toString());
  }, [count]);

  useEffect(() => {
    // Fetch product details
    axios
      .get(`${API_BASE_URL}/api/product/${productId}`)
      .then((response) => {
        dispatch({ type: "SET_PRODUCT", payload: response.data });
      })
      .catch((error) => {
        console.error("Error loading product details:", error);
      });

    // Fetch shop and address
    axios
      .get(`${API_BASE_URL}/api/product/${productId}/shop`)
      .then((response) => {
        const shopData = response.data.data;
        console.log(response.data.data);
        dispatch({ type: "SET_SHOP_DATA", payload: shopData });
        dispatch({ type: "SET_SHOP_NAME", payload: shopData[1] });
      })
      .catch((error) => {
        console.error("Error loading shop data:", error);
      });
  }, [productId]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/product/${productId}/similar-products`
        );
        const data = response.data;

        if (data.status === "SUCCESS") {
          // Access the correct data structure
          const similarProducts = data.data[1];
          console.log("Similar Products Data:", similarProducts);

          dispatch({
            type: "SET_SIMILAR_PRODUCTS",
            payload: similarProducts
          });
        } else {
          // Xử lý khi API trả về lỗi
          console.error("Error fetching similar products:", data.message);
        }
      } catch (error) {
        // Xử lý khi có lỗi trong quá trình gọi API
        console.error("Error fetching similar products:", error);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  const handleLikeProduct = (productId) => {
    axios
      .post(
        `${API_BASE_URL}/api/like_Products?accountId=${accountLogin.id_account}&productId=${productId}`
      )
      .then((response) => {
        if (response.data === "Sản phẩm đã được like.") {
          swal("Thông báo", "Sản phẩm đã được like.", "success");
        } else {
          swal("Thông báo", "Sản phẩm đã được like trước đó.", "info");
        }
      })
      .catch((error) => {
        console.error(error);
        swal("Lỗi", "Đã xảy ra lỗi khi thực hiện thao tác.", "error");
      });
  };

  // Đánh giá sản phẩm

  const [description, setDescription] = useState("");
  const [value, setValue] = React.useState(0);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [userReviews, setUserReviews] = useState([]);

  const handleRatingChange = (event, newValue) => {
    setValue(newValue);
  };
  const isValidRating = () => {
    return value !== null && description.trim() !== "";
  };

  const handlePostRating = () => {
    if (isValidRating()) {
      const ratingData = {
        productId: parseInt(productId),
        accountId: parseInt(accountLogin.id),
        start: parseInt(value),
        description: description
      };

      console.log("Rating Payload:", ratingData);

      axios
        .post(`${API_BASE_URL}/api/ratings/add`, ratingData)
        .then((response) => {
          if (response.status === 200) {
            if (response.data === "Bạn đã đánh giá sản phẩm này.") {
              swal(
                "Thành công",
                "Bạn đã đánh giá sản phẩm này.",
                "success"
              ).then(() => {
                // Tải lại trang sau khi đánh giá thành công
                window.location.reload();
              });
            } else {
              swal("Lỗi", "Phản hồi từ server không đúng.", "error");
            }
          } else {
            // swal("Lỗi", `Lỗi không xác định: ${response.status}`, "error");
          }
        })
        .catch((error) => {
          swal("Lỗi", "Có lỗi xảy ra khi đánh giá sản phẩm.", "error");
        });
    } else {
      swal(
        "Lỗi",
        "Vui lòng chọn số sao và viết đánh giá trước khi đăng",
        "error"
      );
    }
  };

  useEffect(() => {
    if (accountLogin) {
      axios
        .get(`${API_BASE_URL}/api/ratings/${productId}`)
        .then((response) => {
          setReviews(response.data);
          setUserReviews(
            response.data.filter(
              (review) => review.account_rate.id === accountLogin.id
            )
          );
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [productId]);

  useEffect(() => {
    if (accountLogin) {
      axios
        .get(`${API_BASE_URL}/api/ratings/${productId}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [productId]);

  useEffect(() => {
    if (accountLogin) {
      axios
        .get(`${API_BASE_URL}/api/ratings/avg/${productId}`)
        .then((response) => {
          setAvg(response.data);
          console.log("AVG: ", response.data);
        });
    }
  }, []);

  const handleSelectUseAddress = async (city, district, ward, address) => {
    setCity(city);
    setDistrict(district);
    setWard(ward);
    setAddress(address);
  };

  const handleChangeCity = (value) => {
    setCity(value);
    setDistrict("");
    setWard("");
  };

  const handleChangeDistrict = (value) => {
    setDistrict(value);
    setWard("");
  };
  return (
    <>
      <nav>
        <MainNavbar />
      </nav>

      <div className="detail" style={{ backgroundColor: "#f5f5fa" }}>
        <section className="">
          <div
            className="container bg-white mt-4"
            style={{ borderRadius: "8px" }}
          >
            <div className="row p-4">
              <aside className="col-lg-6">
                {product &&
                product.image_product &&
                product.image_product.length > 0 ? (
                  <Carousel>
                    {product.image_product.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          height: "700px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <img
                          src={
                            `${API_BASE_URL}/api/uploadImageProduct/` +
                            image.url
                          }
                          alt={`Image ${index}`}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <p>No images available.</p>
                )}
              </aside>

              <main className="col-lg-6 ">
                <div className="ps-lg-3">
                  {product && shopName !== null ? (
                    <h4 className="title text-dark">{product.product_name}</h4>
                  ) : null}

                  <div className="d-flex flex-row my-3">
                    <div className="text-warning mb-1 me-2">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <span className="ms-1">4.5</span>
                    </div>
                    <span className="text-muted">
                      <i className="fas fa-shopping-basket fa-sm mx-1"></i>154
                      lượt mua
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="h5">
                      <div className="d-flex ">
                        <h2 className="text-danger">
                          {product ? `${product.price} ₫` : "Loading..."}
                        </h2>
                      </div>
                    </span>
                  </div>

                  <div className="address mb-2">
                    <b>
                      <span className="title ">ĐỊA CHỈ GIAO HÀNG</span>
                    </b>
                    <br />
                    {accountLogin ? (
                      <div className={style.listAddress}>
                        {accountLogin.address.map((value, index) =>
                          listDataAddress.map((valueCity, index) =>
                            valueCity.codename === value.city
                              ? valueCity.districts.map(
                                  (valueDistrict, index) =>
                                    valueDistrict.codename === value.district
                                      ? valueDistrict.wards.map(
                                          (valueWard, index) =>
                                            valueWard.codename ===
                                            value.ward ? (
                                              <div
                                                key={valueCity.codename}
                                                className={`${style.address} ${
                                                  value.status
                                                    ? style.active
                                                    : ""
                                                }`}
                                              >
                                                <div className={style.value}>
                                                  {valueCity.name},{" "}
                                                  {valueDistrict.name},{" "}
                                                  {valueWard.name},{" "}
                                                  {value.address}
                                                </div>
                                                <div
                                                  className={style.groupButton}
                                                >
                                                  <span
                                                    className={`${
                                                      style.status
                                                    } ${
                                                      value.status
                                                        ? style.active
                                                        : ""
                                                    } ms-2`}
                                                    onClick={() =>
                                                      handleSelectUseAddress(
                                                        valueCity.name,
                                                        valueDistrict.name,
                                                        valueWard.name,
                                                        value.address
                                                      )
                                                    }
                                                  >
                                                    Dùng
                                                  </span>
                                                </div>
                                              </div>
                                            ) : null
                                        )
                                      : null
                                )
                              : null
                          )
                        )}
                      </div>
                    ) : (
                      <div className="row gutters">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <h6 className="mt-3 text-primary">Địa chỉ</h6>
                        </div>
                        <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={city}
                              onChange={(e) => handleChangeCity(e.target.value)}
                              className={style.input}
                            >
                              <option value="">Tỉnh/Thành Phố</option>
                              {listDataAddress.map((valueCity, index) => (
                                <option
                                  key={valueCity.codename}
                                  value={valueCity.codename}
                                >
                                  {valueCity.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={district}
                              onChange={(e) =>
                                handleChangeDistrict(e.target.value)
                              }
                              className={style.input}
                            >
                              <option value="">Quận/Huyện</option>
                              {listDataAddress.map((valueCity, index) =>
                                valueCity.codename === city
                                  ? valueCity.districts.map(
                                      (valueDistrict, index) => (
                                        <option
                                          key={valueDistrict.codename}
                                          value={valueDistrict.codename}
                                        >
                                          {valueDistrict.name}
                                        </option>
                                      )
                                    )
                                  : null
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <select
                              value={ward}
                              onChange={(e) => setWard(e.target.value)}
                              className={style.input}
                            >
                              <option value="">Phường/Xã/Trị Trấn</option>
                              {listDataAddress.map((valueCity, index) =>
                                valueCity.codename === city
                                  ? valueCity.districts.map(
                                      (valueDistrict, index) =>
                                        valueDistrict.codename === district
                                          ? valueDistrict.wards.map(
                                              (valueWard, index) => (
                                                <option
                                                  key={valueWard.codename}
                                                  value={valueWard.codename}
                                                >
                                                  {valueWard.name}
                                                </option>
                                              )
                                            )
                                          : null
                                    )
                                  : null
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mt-2 col-md-6 col-sm-6 col-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className={`form-control ${style.input}`}
                              id="adress"
                              placeholder="Số nhà"
                              defaultValue={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr />
                  <div className="col-md-4 col-6 mb-3">
                    <b>
                      <span className="title ">SỐ LƯỢNG</span>
                    </b>
                    <div
                      className="input-group mb-3"
                      style={{ width: "170px" }}
                    >
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        id="button-addon1"
                        data-mdb-ripple-color="dark"
                        onClick={decreaseCount} // Gọi hàm giảm số khi nhấn vào nút "Giảm"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="text"
                        className="form-control text-center border border-secondary"
                        placeholder={count}
                        aria-label="Example text with button addon"
                        aria-describedby="button-addon1"
                      />
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        id="button-addon2"
                        data-mdb-ripple-color="dark"
                        onClick={increaseCount} // Gọi hàm tăng số khi nhấn vào nút "Tăng"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </div>
                  </div>
                  {accountLogin ? (
                    <div className="row mb-4">
                      <div className="col-md-4 col-6">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleLikeProduct(product.id)}
                        >
                          Thích
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className="btn shadow-0 "
                      style={{
                        padding: "10px 50px",
                        fontSize: "16px",
                        backgroundColor: "#ffc801",
                        color: "#fff"
                      }}
                    >
                      <i className="bi bi-bag-plus mx-2"></i>
                      <span style={{}}>Mua ngay</span>
                    </button>
                    <button
                      className="btn btn-success shadow-0 mx-4"
                      style={{ padding: "10px 50px", fontSize: "16px" }}
                    >
                      <i className="bi bi-basket3-fill"></i>
                      <span style={{}}>Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>

        <div className="container mt-4">
          <div className="row gx-4 ">
            <div className="col-lg-8 mb-4 d-flex">
              {product && shopName !== null && shopData ? (
                <>
                  <img
                    src={
                      shopData[4]
                        ? `http://localhost:8080/api/uploadImageProduct/${shopData[4]}`
                        : "https://bootdey.com/img/Content/avatar/avatar7.png"
                    }
                    className="rounded-circle shop-image"
                    alt={shopData[4]}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%"
                    }}
                  />
                  <Link to={`/shops/${productId}/shop`}>
                    <div className="shop-name ms-4">
                      <div>
                        <b>{shopName}</b> <br />
                        {listDataAddress.map((valueCity, index) =>
                          valueCity.codename === shopData[2].city
                            ? valueCity.name
                            : null
                        )}
                      </div>
                    </div>
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <section className=" border-top border-bottom pt-4">
          <div className="container">
            <div className="row gx-4">
              <div className="col-lg-8 mb-4">
                <div
                  className="  p-3  bg-white"
                  style={{ borderRadius: "8px" }}
                >
                  <b>
                    <span className="title ">MÔ TẢ SẢN PHẨM</span>
                  </b>
                  <div className="tab-content" id="ex1-content">
                    <div
                      className="tab-pane fade show active"
                      id="ex1-pills-1"
                      role="tabpanel"
                      aria-labelledby="ex1-tab-1"
                    >
                      <p dangerouslySetInnerHTML={{ __html: product ? product.description : '' }} />
                    </div>
                  </div>
                  <div className="shipping-info ">
                    <b>
                      <span className="title ">THÔNG TIN GIAO HÀNG</span>
                    </b>
                    <div className="pt-2 ">
                      <ul>
                        <li>
                          <strong>Miễn phí giao hàng</strong> cho đơn hàng trên
                          500.000 VNĐ.
                        </li>
                        <li>
                          <strong>Giao hàng toàn quốc</strong>, bạn có thể nhận
                          hàng ở bất kỳ đâu.
                        </li>
                        <li>
                          Thời gian giao hàng dự kiến: từ{" "}
                          <strong>3 - 7 ngày làm việc</strong>.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="return-policy ">
                    <b>
                      <span className="title ">CHÍNH SÁCH ĐỔI TRẢ</span>
                    </b>
                    <div className="pt-2 ">
                      <ul>
                        <li>
                          <strong>Chấp nhận đổi trả</strong> trong vòng 7 ngày
                          kể từ ngày nhận hàng.
                        </li>
                        <li>
                          Sản phẩm phải còn{" "}
                          <strong>nguyên vẹn và không bị hỏng hóc</strong>.
                        </li>
                        <li>
                          Để biết thêm chi tiết về chính sách đổi trả, vui lòng
                          liên hệ hotline: <strong>0123 456 789</strong>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div
                  className=" bg-white p-4 shadow-0"
                  style={{ borderRadius: "8px" }}
                >
                  <div className="">
                    <div className="card-body">
                      <h4 className="card-title">Sản phẩm tương tự</h4>

                      {localState.similarProducts &&
                        localState.similarProducts.map((product, index) => (
                          <div className="d-flex mb-3 mt-4" key={index}>
                            <Link to={`/product/${product.id}`}>
                              {product.image_product &&
                                product.image_product.length > 0 && (
                                  <img
                                    src={`${API_BASE_URL}/api/uploadImageProduct/${product.image_product[0].url}`}
                                    style={{ minWidth: "96px", height: "96px" }}
                                    className="img-md"
                                    alt={`Similar Product ${index + 1}`}
                                  />
                                )}
                            </Link>
                            <div className="info">
                              <Link
                                to={`/product/${product.id}`}
                                className="nav-link mb-1"
                              >
                                {product.product_name}
                              </Link>
                              <strong className="text-dark">
                                {product.price} ₫
                              </strong>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="">
          <div className="container">
            <div className="row gx-4">
              <div className="col-lg-8 mb-4">
                <div className=" p-3 bg-white" style={{ borderRadius: "8px" }}>
                  <div className="reviews">
                    <b>
                      <span component="legend" className="title">
                        ĐÁNH GIÁ SẢN PHẨM
                      </span>
                    </b>
                    {/* <Typography component="legend">
                      Đánh giá sản phẩm
                    </Typography> */}
                    <div className="rating-section">
                      {userReviews.length === 0 ? (
                        <>
                          <Rating
                            name="product-rating"
                            value={value}
                            onChange={handleRatingChange}
                          />

                          <label htmlFor="description">Mô tả:</label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />

                          <button
                            onClick={handlePostRating}
                            disabled={!isValidRating()}
                          >
                            Đăng
                          </button>
                        </>
                      ) : (
                        <p>Sản phẩm này bạn đã đánh giá</p>
                      )}
                    </div>

                    <div className="average-rating-section">
                      {avg !== null && (
                        <div>
                          <p>Average Rating: {avg}</p>
                        </div>
                      )}

                      <Typography variant="h6">
                        Đánh giá của người dùng
                      </Typography>

                      {userReviews.length > 0 ? (
                        userReviews.map((review) => (
                          <div key={review.id} className="user-review">
                            <Typography>
                              Người đánh giá: {review.account_rate.username}
                            </Typography>
                            <Rating
                              name="read-only"
                              value={review.star}
                              readOnly
                            />
                            <Typography>Mô tả: {review.description}</Typography>
                            {review.account_rate.infoAccount && (
                              <Typography>
                                {/* Email: {review.account_rate.infoAccount.email} */}
                              </Typography>
                            )}
                          </div>
                        ))
                      ) : (
                        <Typography>
                          Chưa có bình luận nào về sản phẩm này.
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default ProductPage;
