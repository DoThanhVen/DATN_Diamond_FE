import React, { useState, useEffect, useReducer, useHistory } from "react";
import "../css/user/detail.css";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import swal from "sweetalert";
import style from "../css/user/detail.module.css";
import { GetDataLogin } from "../../service/DataLogin.js";
import { useDispatch } from "react-redux";
import cartSilce from "../../Reducer/cartSilce";
import { callAPI } from "../../service/API.js";
import { ThongBao } from "../../service/ThongBao.js";
import { uploadImageToFirebaseStorage } from "../../service/firebase.js";
import listDataAddress from "../../service/AddressVietNam.json"
const API_BASE_URL = "http://localhost:8080";
function formatCurrency(price, promotion) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
  return formatter.format(price - price * (promotion / 100));
}

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
  const [accountLogin, setAccountLogin] = useState(null);
  const [reload, setreload] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setfile] = useState(null);
  const [totalBuy, setTotalBuy] = useState(0);
  const [isCheck, setIsCheck] = useState(true);
  const [disSableTruBtn, setDisableTruBtn] = useState(false);
  const [previousStarValue, setpreviousStarValue] = useState(0);
  const [ratings, setRatings] = useState([
    { name: 'Tất Cả', code: 0, quantity: 0 },
    { name: '5 Sao', code: 5, quantity: 0 },
    { name: '4 Sao', code: 4, quantity: 0 },
    { name: '3 Sao', code: 3, quantity: 0 },
    { name: '2 Sao', code: 2, quantity: 0 },
    { name: '1 Sao', code: 1, quantity: 0 }
  ]);

  const getAccountFromSession = () => {
    const accountLogin = GetDataLogin();
    if (accountLogin !== undefined) {
      try {
        setAccountLogin(accountLogin);
        axios
          .get(`${API_BASE_URL}/api/ratings/avg/${productId}`)
          .then((response) => {
            setAvg(response.data);
          });


        axios
          .get(`${API_BASE_URL}/api/ratings/getTotalBuy/${productId}`)
          .then((response) => {
            setTotalBuy(response.data)
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    getAllRatings()
  }, [reload])
  const getAllRatings = async () => {
    const res = await callAPI(`/api/ratings/${productId}`, 'GET');
    const updatedRatings = ratings?.map((rating) => {
      if (rating.code === 0) {
        return { ...rating, quantity: res.length };
      }
      const foundItems = res.filter((item) => item.star === rating.code);
      if (foundItems.length > 0) {
        return { ...rating, quantity: foundItems.length };
      }
      return rating;
    });
    setRatings(updatedRatings)
  }
  const handleImageChange = e => {
    const allowedFormats = ['image/jpeg', 'image/png'];
    const files = e.target.files;
    const imageFiles = Array.from(files).filter(file => allowedFormats.includes(file.type));
    if (imageFiles.length === 0) {
      ThongBao("Vui lòng chỉ chọn tệp hình ảnh có định dạng phù hợp.", "info");
      return;
    }
    if (imageFiles[0].size > 50 * 1024) {
      ThongBao(
        "Kích thước ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 50Kb.",
        "info"
      );
      return;
    } else {
      setfile(imageFiles[0]);
      const reader = new FileReader();
      reader.onload = event => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(imageFiles[0]);
    }
  };
  useEffect(() => {
    getAccountFromSession();
  }, [reload]);

  const { productId } = useParams();
  const [localState, dispatch] = useReducer(localStateReducer, {
    product: null,
    shopName: null,
    shopData: null,
    shopAddress: null,
    city: "",
    count: parseInt(localStorage.getItem("count")) || 14,
    showAllComments: false,
  });

  const { product, shopName, shopData, shopAddress, count, showAllComments } =
    localState;

  const increaseCount = () => {
    setQuantity(Number(quantity) + 1);
    setDisableTruBtn(false);
    // dispatch({ type: "SET_COUNT", payload: count + 1 });
  };

  const decreaseCount = () => {
    if (quantity > 1) {
      setQuantity(Number(quantity) - 1);
      setDisableTruBtn(false);
    } else {
      setDisableTruBtn(true);
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
        dispatch({ type: "SET_SHOP_DATA", payload: shopData });
        dispatch({ type: "SET_SHOP_NAME", payload: shopData[1] });
      })
      .catch((error) => {
        console.error("Error loading shop data:", error);
      });
  }, [productId, accountLogin, reload]);

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
          dispatch({
            type: "SET_SIMILAR_PRODUCTS",
            payload: similarProducts,
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
  }, [productId, accountLogin, reload]);

  const handleLikeProduct = (productId) => {
    axios
      .post(
        `${API_BASE_URL}/api/like_Products?accountId=${accountLogin.id}&productId=${productId}`
      )
      .then((response) => {
        console.log(response)
        swal("Thông báo", "Sản phẩm đã được like.", "success");
        setreload(reload + 1)
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
  const [isEditing, setIsEditing] = useState(false);
  const handleRatingChange = (event, newValue) => {
    setValue(newValue);
  };
  const [ratingId, setRatingId] = useState(null);
  const [newRating, setNewRating] = useState({
    star: 0,
    description: "",
  });
  const navigate = useNavigate();

  const isValidValue = (value) => {
    return value !== null && !isNaN(parseInt(value)); // Modify the condition based on the value's expected format
  };

  const isValidDescription = (description) => {
    return description.trim() !== "";
  };
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/ratings/findByStar/${productId}/${selectedRating}`)
      .then((response) => {
        console.log(response);
        setReviews(response.data.data);
        if (response.data.data.length > 0) {
          const data = response.data.data.filter((review) => review.account_rate.id === accountLogin.id);
          if (data && data.length > 0) {
            setUserReviews(data);
            setIsCheck(false);
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy đánh giá:", error);
      });
  }, [productId, accountLogin, reload, selectedRating, isCheck]);


  const handlePostRating = async () => {
    if (accountLogin && accountLogin.id) {
      if (isValidValue(value) && isValidDescription(description)) {
        let urlImage = null;
        if (file === null) {
          urlImage = null;
        } else {
          urlImage = await uploadImageToFirebaseStorage(file);
        }
        const ratingData = {
          productId: parseInt(productId),
          start: parseInt(value),
          description: description,
          image: urlImage
        };
        axios
          .post(`${API_BASE_URL}/api/ratings/add/${parseInt(accountLogin.id)}`, ratingData)
          .then((response) => {
            setreload(reload + 1)
            setIsCheck(false)
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
    } else {
      // Handle the case when accountLogin is null or its id is undefined
      console.error("Error: Account information is not available.");
    }
  };


  const handleUpdateRating = async () => {
    if (file === null) {
      if (newRating.description.length > 250) {
        swal("Lỗi", "Mô tả tối đa 250 kí tự", "error");
      } else {
        axios
          .put(`${API_BASE_URL}/api/ratings/update/${ratingId}`, newRating)
          .then((response) => {


            const updatedReviews = reviews.map((review) =>
              review.id === ratingId
                ? {
                  ...review,
                  star: newRating.star,
                  description: newRating.description,
                  image: newRating.image
                }
                : review
            );

            setReviews(updatedReviews);

            // Cập nhật userReviews nếu người dùng hiện tại đã đánh giá sản phẩm
            const updatedUserReviews = userReviews.map((userReview) =>
              userReview.id === ratingId
                ? {
                  ...userReview,
                  star: newRating.star,
                  description: newRating.description,
                  image: newRating.image
                }
                : userReview
            );

            setUserReviews(updatedUserReviews);

            // Chuyển về nút "Chỉnh sửa"
            navigate(`/product/${productId}#edit`);
            setreload(reload + 1)
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật đánh giá:", error);
            swal("Lỗi", "Không thể cập nhật đánh giá", "error");
          });
        console.log("Cập nhật đánh giá. ID đánh giá:", ratingId);
      }
    }
    else {
      if (newRating.description.length > 250) {
        swal("Lỗi", "Mô tả tối đa 250 kí tự", "error");
      } else {
        const urlImage = await uploadImageToFirebaseStorage(file);
        const newData = { star: newRating.star, description: newRating.description, image: urlImage };
        axios
          .put(`${API_BASE_URL}/api/ratings/update/${ratingId}`, newData)
          .then((response) => {

            const updatedReviews = reviews.map((review) =>
              review.id === ratingId
                ? {
                  ...review,
                  star: newRating.star,
                  description: newRating.description,
                }
                : review
            );

            setReviews(updatedReviews);

            // Cập nhật userReviews nếu người dùng hiện tại đã đánh giá sản phẩm
            const updatedUserReviews = userReviews.map((userReview) =>
              userReview.id === ratingId
                ? {
                  ...userReview,
                  star: newRating.star,
                  description: newRating.description,
                }
                : userReview
            );

            setUserReviews(updatedUserReviews);
            setreload(reload + 1)
            setIsEditing(false);
            // Chuyển về nút "Chỉnh sửa"
            navigate(`/product/${productId}#edit`);
          })
          .catch((error) => {
            console.error("Lỗi khi cập nhật đánh giá:", error);
            swal("Lỗi", "Không thể cập nhật đánh giá", "error");
          });
        console.log("Cập nhật đánh giá. ID đánh giá:", ratingId);
      }
    }
    getAllRatings();
    const previousRating = ratings.find((rating) => rating.code === previousStarValue);
    if (previousRating) {
      const updatedPreviousRating = { ...previousRating };
      updatedPreviousRating.quantity -= 1; // Decrease the count of the previous rating
      setRatings((prevRatings) =>
        prevRatings.map((rating) =>
          rating.code === previousStarValue ? updatedPreviousRating : rating
        )
      );
    }
  };


  const dispatchs = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddCart = async () => {
    const quantityFind=await callAPI(`/api/storage/${productId}`,'GET')
    if(quantity>quantityFind.data){
        ThongBao('Số lượng mặt hàng này không đủ','error');
        return;
    }
    let newProduct = null;
    let shop;
    const response = await callAPI(
      `/api/shop/findByProduct/${product.id}`,
      "GET"
    );
    if (response.status == "SUCCESS") {
      shop = response.data;
    } else {
      return;
    }

    newProduct = {
      ...product,
      shop: shop,
    };
    if (newProduct == null) {
      alert("Đang có lỗi vui lòng thử lại sau");
      return;
    }
    dispatchs(
      cartSilce.actions.addToCart({
        product: newProduct,
        quantity: quantity,
      })
    );
    ThongBao("Thêm thành công", "success");
  };
  const handleBuy = async () => {
    let newProduct = null;
    let shop;
    const response = await callAPI(
      `/api/shop/findByProduct/${product.id}`,
      "GET"
    );
    if (response.status == "SUCCESS") {
      shop = response.data;
    } else {
      return;
    }

    newProduct = {
      ...product,
      shop: shop,
    };
    if (newProduct == null) {
      alert("Đang có lỗi vui lòng thử lại sau");
      return;
    }
    dispatchs(
      cartSilce.actions.addToCart({
        product: newProduct,
        quantity: quantity,
      })
    );
    navigate("/checkOut");
  };
  const renderStars = (avg) => {
    const fullStars = Math.floor(avg); // Number of full stars
    const hasHalfStar = avg % 1 !== 0; // Check for half star
    const starIcons = [];
    // Full star icons
    for (let i = 0; i < fullStars; i++) {
      starIcons.push(<i key={i} className="bi bi-star-fill"></i>);
    }

    // Half star icon
    if (hasHalfStar) {
      starIcons.push(<i key={starIcons.length} className="bi bi-star-half"></i>);
    }

    // Outlined star icons for the remaining stars
    const remainingStars = 5 - Math.ceil(avg); // Calculate the remaining stars to be outlined

    for (let j = 0; j < remainingStars; j++) {
      starIcons.push(<i key={starIcons.length + j} className="bi bi-star"></i>);
    }
    return starIcons;
  }
  const formatQuantity = (quantity) => {
    if (quantity > 1000) {
      return (quantity / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return quantity;
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
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={image.url ? image.url : "/images/nullImage.png"}
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
                  ) : (
                    <p>Loading...</p>
                  )}

                  <div className="d-flex flex-row my-3">
                    <div className="text-warning mb-1 me-2">
                      {renderStars(avg).map((icon, index) => (
                        <span key={index}>{icon}</span>
                      ))}
                      <span className="ms-1">{avg}</span>
                    </div>
                    <span className="text-muted">
                      <i className="fas fa-shopping-basket fa-sm mx-1"></i>{totalBuy}
                      <span className="mx-2">lượt mua</span>
                    </span>
                    {/* {accountLogin && (
                    <button
                      onClick={() => handleLikeProduct(product.id)}
                      disabled={isLiked}
                      style={{ color: isLiked ? "blue" : "black" }}
                    >
                      {isLiked ? "Đã Like" : "Like"}
                    </button>
                  )} */}
                  </div>

                  <div className="mb-3">
                    <span className="h5">
                      <div className="d-flex ">
                        <h2 className="text-danger">
                          {product ? formatCurrency(product.price, 0) : null}
                        </h2>
                      </div>
                    </span>
                  </div>
                  <hr />
                  <div className="col-md-4 col-6 mb-3">
                    <b>
                      <span className="title ">SỐ LƯỢNG</span>
                    </b>
                    <div className="input-group mb-3">
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        id="button-addon1"
                        data-mdb-ripple-color="dark"
                        disabled={disSableTruBtn}
                        onClick={decreaseCount}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
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
                  <div >
                    <button
                      type="button"
                      className="btn btn-success mt-2 me-2 pe-4"
                      onClick={() => {
                        handleBuy();
                      }}
                    // className={style.buttonBuy}
                    >
                      <i className="bi bi-bag-plus mx-2"></i>
                      Mua ngay
                    </button>
                    <button type="button" className="btn btn-success mt-2 me-2 pe-4" onClick={handleAddCart} >

                      <i className="bi bi-basket3-fill me-2"></i>
                      Thêm vào giỏ hàng
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
                        ? `${shopData[4]}`
                        : "https://bootdey.com/img/Content/avatar/avatar7.png"
                    }
                    className="rounded-circle shop-image"
                    alt={shopData[4]}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                  <Link to={`/shops/${productId}/shop`}>
                    <div className="shop-name ms-4">
                      <div>
                        <b>{shopName}</b> <br />
                        {listDataAddress.map((valueCity, index) =>
                          shopData[2] && valueCity.codename === shopData[2].city
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
                      <p
                        dangerouslySetInnerHTML={{
                          __html: product ? product.description : "",
                        }}
                      />
                    </div>
                  </div>
                  {/* <div className="shipping-info ">
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
                  </div> */}
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
                        localState.similarProducts.map((product, index) =>
                          product.status === 1 ? (
                            <div className="d-flex mb-3 mt-4" key={index} onClick={() => { setreload(reload + 1) }}>
                              <Link
                                className={`me-2`}
                                to={`/product/${product.id}`}
                              >
                                {product.image_product &&
                                  product.image_product.length > 0 && (
                                    <img
                                      src={`${product.image_product[0].url}`}
                                      style={{
                                        minWidth: "96px",
                                        height: "96px",
                                      }}
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
                          ) : null
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={style.rating}>
          <div className="container">
            <div className="row gx-4">
              <div className="col-lg-8 mb-4">
                <div className=" p-3 bg-white" style={{ borderRadius: "8px" }}>
                  <div>
                    <div className={style.area_rating}>
                      <b className={style.heading}>
                        <span component="legend" className="title">
                          ĐÁNH GIÁ SẢN PHẨM
                        </span>
                      </b>
                      <div className={style.content}>
                        {accountLogin &&
                          isCheck
                          ? (
                            <>
                              <Rating
                                name="product-rating"
                                value={value}
                                onChange={handleRatingChange}
                              />

                              <div class="mb-3">
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                                  value={description}
                                  placeholder="Tối đa 250 kí tự"
                                  onChange={(e) => setDescription(e.target.value)}></textarea>
                                {selectedImage !== null ? (
                                  <img src={selectedImage} alt="" width={'200px'} style={{ marginTop: '20px' }} />
                                ) : (
                                  null
                                )}
                                <div class="input-group mt-3">
                                  <input type="file" class="form-control" id="inputGroupFile01" onChange={handleImageChange} />
                                </div>
                                <button type="button" class="btn btn-success mt-3" onClick={handlePostRating}>Đăng</button>
                              </div>


                            </>
                          ) : null}
                      </div>
                    </div>

                    <div className="average-rating-section"  >

                      {avg !== 0 && (
                        <div className="text-warning mb-1 me-2">
                          <div className="container text-center">
                            <div className="row">
                              <div className="col-sm-4 ">
                                <div className="inner">
                                  <div className="rating">
                                    <span className="rating-num"> {avg} </span>
                                    <div className="rating-stars">
                                      {renderStars(avg).map((icon, index) => (
                                        <span
                                          style={{ fontSize: "30px" }}
                                          key={index}
                                        >
                                          {icon}
                                        </span>
                                      ))}
                                    </div>
                                    {/* <div className="rating-users">
                                      <i className="icon-user"></i> 15 đánh giá
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-8" >
                                <div className="btn-group d-flex flex-wrap  row-cols-4 ">
                                  {ratings.map((rating, index) => (
                                    <button type="button"
                                      className="btn btn-success mt-2 me-2 pe-4" key={index} onClick={() => setSelectedRating(rating.code)}>
                                      {rating.name} ({formatQuantity(rating.quantity)})
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Phần đánh giá */}
                        </div>
                      )}

                      <br />
                      <Typography variant="h6">
                        Đánh giá của người dùng
                      </Typography>
                      <div style={{ height: '500px', overflow: 'auto' }}>
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="user-review" >
                              <Typography>
                                Người đánh giá: {review.account_rate.username}
                              </Typography>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Rating
                                  name="read-only"
                                  value={review.star}
                                  readOnly
                                />
                                {review.image !== null ? (
                                  <img
                                    style={{ width: '100px', marginTop: '10px' }}
                                    src={review.image}
                                    alt="Review Image"
                                  />
                                ) : null}
                              </div>
                              <br />
                              <Typography>Mô tả: {review.description}</Typography>
                              <div key={review.id} className="user-review" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                              </div>

                              {userReviews.length > 0 &&
                                review.account_rate.id === accountLogin.id && (
                                  <>
                                    {isEditing ? (
                                      <>
                                        <Rating
                                          name="edited-rating"
                                          value={newRating.star}
                                          onChange={(event, newValue) =>
                                            setNewRating({
                                              ...newRating,
                                              star: newValue,
                                            })
                                          }
                                        />

                                        <div class="container">
                                          <div class="row">
                                            <div class="col-6">
                                              <div class="mb-3">
                                                <textarea class="form-control" placeholder="Tối đa 250 kí tự" id="exampleFormControlTextarea1" rows="3" value={newRating.description}
                                                  onChange={(e) =>
                                                    setNewRating({
                                                      ...newRating,
                                                      description: e.target.value,
                                                    })
                                                  }></textarea>
                                                {selectedImage !== null ? (
                                                  <img src={selectedImage} alt="" width={'100px'} style={{ marginTop: '20px' }} />
                                                ) : (
                                                  null
                                                )}
                                                <div class="input-group mt-3">
                                                  <input type="file" class="form-control" id="inputGroupFile01" onChange={handleImageChange} />
                                                </div>
                                                <button type="button" class="btn btn-success mt-3" onClick={handleUpdateRating}>Lưu</button>
                                              </div>
                                            </div>

                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div id="edit">
                                        <button
                                          type="button" className="btn btn-success"
                                          onClick={() => {
                                            setIsEditing(!isEditing);
                                            setRatingId(review.id);
                                            setpreviousStarValue(review.star)
                                            setNewRating({
                                              star: review.star,
                                              description: review.description,
                                              image: review.image
                                            });
                                          }}
                                        >
                                          Chỉnh sửa
                                        </button>

                                      </div>
                                    )}
                                  </>
                                )}
                            </div>
                          ))
                        ) : (
                          <Typography className={`text-danger`}>
                            Không có.
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >
      </div >
      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default ProductPage;
