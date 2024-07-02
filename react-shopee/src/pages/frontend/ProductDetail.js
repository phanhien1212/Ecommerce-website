import { useEffect, useState } from "react";
import ProductService from "../../service/ProductService";
import { urlImage } from "../../config";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseCountProductDetail } from "../../state/cartSlice";
import "../../CSS/reviews.css";
import ReviewService from "../../service/ReviewService";
import UserService from "../../service/UserService";
import ShopProfileService from "../../service/ShopProfileService";
import axios from "axios";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

const ProductDetail = () => {
  const [load, setLoad] = useState(Date.now());
  const storedUserId = localStorage.getItem("userId");
  const [attribute_name1, setAttributeName1] = useState("");
  const [attribute_name2, setAttributeName2] = useState("");
  const [attribute_value1, setAttributeValue1] = useState([]);
  const [sellerId, setSellerId] = useState("");
  const [attribute_value2, setAttributeValue2] = useState([]);
  const { slug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dispatch = useDispatch();
  var cartItems = useSelector((state) => state.cart.items);
  // Hàm này được gọi khi button được nhấn
  const [selectedOptions, setSelectedOptions] = useState({
    attribute1: null,
    attribute2: null,
  });

  // Hàm xử lý khi click vào một thuộc tính
  const handleButtonClick = (attribute, attributeName) => {
    setSelectedOptions({
      ...selectedOptions,
      [attributeName]: attribute,
    });
  };

  const [product, setProduct] = useState({});

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ProductService.getBySlug(slug);
        setProduct(result.data);
        const productId = result.data.id;
        const resultAttribute = await ProductService.getattribute(productId);
        setAttributeName1(resultAttribute.data.attribute_name1);
        setAttributeName2(resultAttribute.data.attribute_name2);
        var value1 = resultAttribute.data.attribute_value1;
        var value2 = resultAttribute.data.attribute_value2;
        var attributevalue1 = value1.split(",");
        var attributevalue2 = value2.split(",");
        setAttributeValue1(attributevalue1);
        setAttributeValue2(attributevalue2);
        setSellerId(result.data.seller_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug, product]);
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce(
      (accumulator, review) => accumulator + review.rating,
      0
    );
    return totalRating / reviews.length;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product by slug
        const result = await ProductService.getBySlug(slug);
        if (!result.data) {
          throw new Error("Product not found");
        }

        setProduct(result.data);
        const productId = result.data.id;

        // Fetch review by product ID
        const resultReview = await ReviewService.getByIdReview(productId);
        if (!resultReview.data) {
          throw new Error("Review not found");
        }

        // Fetch user by user ID from the review
        const user = await UserService.getById(resultReview.data.user_id);
        if (!user.data) {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);
  const renderStars1 = () => {
    const averageRating = calculateAverageRating();
    const starIcons = [];

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(averageRating)) {
        starIcons.push(
          <i key={i} className="product-reviews__rating-star fas fa-star" />
        );
      } else if (i < averageRating) {
        starIcons.push(
          <i
            key={i}
            className="product-reviews__rating-star fas fa-star-half-alt"
          />
        );
      } else {
        starIcons.push(
          <i key={i} className="product-reviews__rating-star far fa-star" />
        );
      }
    }

    return starIcons;
  };
  const [shopprofile, setShopProfile] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ShopProfileService.getShopProfileBySellerId(
          parseInt(sellerId, 10)
        );
        console.log("ạ", result.data);
        setShopProfile(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [load, slug, sellerId]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin sản phẩm bằng slug
        const productResult = await ProductService.getBySlug(slug);
        setProduct(productResult.data);
        // Lấy ID của sản phẩm
        const productId = productResult.data.id;
        // Lấy danh sách người dùng
        const userResult = await UserService.getUsers();
        setUsers(userResult.data);
        // Lấy danh sách đánh giá của sản phẩm
        const reviewResult = await ReviewService.getByIdReviewProduct(
          productId
        );
        setReviews(reviewResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userid = parseInt(localStorage.getItem("userId"), 10);
        setUserId(userid);
        const result = await UserService.getById(userid);
        setUser(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [load]);
  const handleAddToCart = async () => {
    if (userId) {
      try {
        // Check product quantity
        const response = await fetch(`http://localhost:8080/api/check-quantity?productId=${product.id}&quantity=${quantity}`);

        if (response.ok) {
          // Proceed with adding to cart
          const existingItem = cartItems.find((item) => {
            return (
              item.id === product.id &&
              item.selectedOptions.attribute1 === selectedOptions.attribute1 &&
              item.selectedOptions.attribute2 === selectedOptions.attribute2 &&
              item.userId === userId
            );
          });

          if (existingItem) {
            dispatch(
              increaseCountProductDetail({
                id: existingItem.id,
                selectedOptions: existingItem.selectedOptions,
                userId: userId,
                count: existingItem.count + quantity
              })
            );
          } else {
            // Nếu sản phẩm tương tự không tồn tại, thêm một sản phẩm mới vào giỏ hàng
            const productWithAdCampaignId = searchParams.get(
              "productWithAdCampaignId"
            );

            if (productWithAdCampaignId !== null) {
              // Nếu sản phẩm tương tự không tồn tại hoặc đã tồn tại nhưng có kích thước và màu sắc khác, thêm một sản phẩm mới vào giỏ hàng
              dispatch(
                addToCart({
                  item: {
                    ...product,
                    count: quantity,
                    price: sale.pricesale > 0 ? sale.pricesale : product.price,
                    seller_id: product.seller_id,
                    storeName: product.storeName,
                    selectedOptions: selectedOptions,
                    productWithAdCampaignId: productWithAdCampaignId,
                    userId: userId, // Gửi kèm productWithAdCampaignId
                  },
                })
              );
            } else {
              // Nếu không có productWithAdCampaignId, gửi sản phẩm mà không có trường này
              dispatch(
                addToCart({
                  item: {
                    ...product,
                    count: quantity,
                    price: sale.pricesale > 0 ? sale.pricesale : product.price,
                    seller_id: product.seller_id,
                    storeName: product.storeName,
                    selectedOptions: selectedOptions,
                    userId: userId,
                  },
                })
              );
            }
          }

          setLoad(Date.now());
        } else {
          // Handle insufficient quantity
          const errorMessage = await response.text();
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error checking product quantity:", error);
      }
    } else {
      alert("Hãy đăng nhập");
      console.log("Người dùng chưa đăng nhập");
    }
  };


  const toggleFavorite = async () => {
    try {
      // Call your backend API to toggle favorite status
      const result = await ProductService.getBySlug(slug);
      setProduct(result.data);
      const productId = result.data.id;
      const favoriteData = {
        // Thay thế giá trị này bằng id của  người dùng cần theo dõi
        user_id: storedUserId,
        // Thay thế giá trị này bằng id của cửa hàng hiện tại
        product_id: productId,
      };

      await axios.post("http://localhost:8080/api/favorite", favoriteData);
      // Toggle the favorite state locally
      setIsFavorited(true);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleUnFavorite = async () => {
    try {
      // Call your backend API to toggle favorite status
      const result = await ProductService.getBySlug(slug);
      setProduct(result.data);
      const productId = result.data.id;
      const favoriteData = {
        // Thay thế giá trị này bằng id của  người dùng cần theo dõi
        user_id: user.id,
        // Thay thế giá trị này bằng id của cửa hàng hiện tại
        product_id: productId,
      };

      await axios.post("http://localhost:8080/api/unfavorite", favoriteData);
      // Toggle the favorite state locally
      setIsFavorited(false);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const result = await ProductService.getBySlug(slug);
        setProduct(result.data);
        const userid = parseInt(localStorage.getItem("userId"), 10);
        const productId = result.data.id;
        const response = await axios.get(
          `http://localhost:8080/api/isFavorited?user_id=${userid}&product_id=${productId}`
        );
        setIsFavorited(response.data.isFavorited);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [user.id, slug]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const [sale, setSale] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ProductService.getBySlug(slug);
        setProduct(result.data);
        const productId = result.data.id;
        const resultSale = await ProductService.getsale(productId);
        setSale(resultSale.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);



  const [imageUrls, setImageUrls] = useState([]);
  useEffect(() => {
    const fetchDataa = async () => {
      try {
        const result = await ProductService.getBySlug(slug);
        setProduct(result.data);
        const productId = result.data.id;
        const response = await ProductService.getproductimage(productId);
        console.log('asdasd', response.data)
        setImageUrls(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataa();
  }, [slug]);


  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await ProductService.getBySlug(slug);
        setProduct(result.data);
        const productId = result.data.id;
        const response = await axios.get(
          `http://localhost:8080/api/${productId}/favorites/count`
        );

        setCount(response.data);
        console.log("dadsadsvcvxcvxc", response.data);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetch();
  }, []);


  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const imagesPerPage = 5;


  const handlePrevClick = () => {
    setCurrentGroupIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextClick = () => {
    setCurrentGroupIndex((prevIndex) => (prevIndex < Math.ceil(imageUrls.length / imagesPerPage) - 1 ? prevIndex + 1 : prevIndex));
  };





  return (
    <div id="product-info-container">
      <div className="grid wide">
        {/* Product slide & content */}
        <div className="row sm-gutter product">
          <div className="col l-5 c-12">
            <div className="product-slide">
              <img
                alt=""
                src={`${urlImage}product/${selectedImageUrl ? selectedImageUrl.image : product.image}`}
                className="product__img"
              />

              <div className="product__cards product__cards-mobile">
                <button
                  className="product__cards-btn product__cards-btn--prev"
                  style={{ display: 'block' }}
                  onClick={handlePrevClick}
                  disabled={currentGroupIndex === 0}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="product__cards-btn product__cards-btn--next"
                  style={{ display: 'block' }}
                  onClick={handleNextClick}
                  disabled={currentGroupIndex === Math.ceil(imageUrls.length / imagesPerPage) - 1}
                >
                  <i className="fas fa-chevron-right" />
                </button>
                <div className="product__cards-container">
                  {imageUrls.slice(currentGroupIndex * imagesPerPage, (currentGroupIndex + 1) * imagesPerPage).map((imageUrl, index) => (
                    <div className="product__card-wrapper" key={index}>
                      <div className={`product__card ${selectedImageUrl === imageUrl ? 'selected' : ''}`}
                        onClick={() => handleImageClick(imageUrl)}>
                        <img
                          src={`${urlImage}product/${imageUrl.image}`}
                          className="product__card-img"
                          alt={`Product ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>




              <div className="product__actions hide-on-mobile-tablet">
                <div className="product__liking">
                  {isFavorited ? (
                    <MdFavorite
                      onClick={toggleUnFavorite}
                      className="product__action-icon product__action-icon--liking"
                      style={{ fontSize: 24, color: "rgb(255, 66, 79)" }}
                    />
                  ) : (
                    <MdFavoriteBorder
                      onClick={toggleFavorite}
                      style={{ fontSize: 24 }}
                      className="product__action-icon product__action-icon--liking"
                    />
                  )}
                  <Link style={{ width: 140 }}>Đã thích ({count})</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col l-7 c-12">
            <div className="product-content">
              <div className="product__title">
                <span>{product.name}</span>
              </div>
              <div className="product__status">
                <div className="product__status-rating">
                  <div className="product__status-rating-point underscore">
                    {calculateAverageRating().toFixed(1)}
                  </div>
                  <div className="product__status-rating-star">
                    {renderStars1()}
                  </div>
                </div>
                <div className="product__status-reviewing hide-on-mobile">
                  <span className="product__status-reviewing-qnt underscore">
                    {reviews.length}
                  </span>
                  <span className="product__status-text pr-text">Đánh Giá</span>
                </div>
                <div className="product__liking">
                  <i className="product__action-icon product__action-icon--liking far fa-heart" />
                  <Link className="text hide-on-mobile">Đã thích (2,1k)</Link>
                </div>
              </div>
              <div className="product__price">
                <div className="product__price-main">
                  <div className="product__price-current">
                    {/* Hiển thị giá mới và nhãn giảm giá nếu có */}
                    {sale.pricesale > 0 ? (
                      <>
                        <span className="product__price-old">
                          {formatPrice(parseInt(product.price))}
                        </span>
                        <span className="product__price-new">
                          {formatPrice(parseInt(sale.pricesale))}
                        </span>
                        <span className="product__price-label bgr-orange">
                          {sale.discount}% GIẢM
                        </span>
                      </>
                    ) : (
                      // Nếu không có giảm giá, chỉ hiển thị giá mới
                      <span className="product__price-new">
                        {formatPrice(parseInt(product.price))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="product__info">
                {attribute_name1 !== "" && (
                  <div className="product__options">
                    <label className="product__options-label width-label">
                      {attribute_name1}
                    </label>
                    <div className="product__options-items-wrapper">
                      <div className="product__options-items">
                        {attribute_value1 &&
                          attribute_value1.map((attribute, index) => (
                            <button
                              key={index}
                              className={`product__options-item ${selectedOptions.attribute1 === attribute
                                ? "product__options-item-selected"
                                : ""
                                }`}
                              onClick={() =>
                                handleButtonClick(attribute, "attribute1")
                              }
                            >
                              {attribute}
                            </button>
                          ))}
                      </div>
                      <div className="product__options-items-error-message">
                        Vui lòng chọn {attribute_name1}
                      </div>
                    </div>
                  </div>
                )}

                {attribute_name2 !== "" && (
                  <div className="product__options">
                    <label className="product__options-label width-label">
                      {attribute_name2}
                    </label>
                    <div className="product__options-items-wrapper">
                      <div className="product__options-items">
                        {attribute_value2 &&
                          attribute_value2.map((attribute, index) => (
                            <button
                              key={index}
                              className={`product__options-item ${selectedOptions.attribute2 === attribute
                                ? "product__options-item-selected"
                                : ""
                                }`}
                              onClick={() =>
                                handleButtonClick(attribute, "attribute2")
                              }
                            >
                              {attribute}
                            </button>
                          ))}
                      </div>
                      <div className="product__options-items-error-message">
                        Vui lòng chọn {attribute_name2}
                      </div>
                    </div>
                  </div>
                )}

                <div className="product__qnt hide-on-mobile">
                  <label className="product__qnt-label width-label">
                    Số Lượng
                  </label>
                  <div className="shop__qnt-btns">
                    <button
                      className="shop__qnt-btn shop__qnt-btn--dec"
                      onClick={handleDecrease}
                    >
                      <i className="shop__qnt-btn-icon fas fa-minus" />
                    </button>
                    <input
                      className="shop__qnt-input"
                      id="123"
                      value={quantity}
                      type="text"
                    />
                    <button
                      className="shop__qnt-btn shop__qnt-btn--inc"
                      onClick={handleIncrease}
                    >
                      <i className="shop__qnt-btn-icon fas fa-plus" />
                    </button>
                  </div>
                  <div className="product__qnt-note">
                    <span className="product__qnt-note-num">
                      {product.stockquantity}&nbsp;
                    </span>
                    sản phẩm có sẵn
                  </div>
                </div>

                <div style={{ color: "red", marginBottom: 20, marginTop: -10 }}>
                  <span
                    id="errorMessagesImage"
                    style={{ marginLeft: 118 }}
                  ></span>
                </div>
                <div className="product-btns-main">
                  <button className="product-btn-main product-btn-main__msg clear-btn hide-on-tablet">
                    <i className="product-btn-main__msg-icon far fa-comment-dots" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="product-btn-main product-btn-main__adding"
                  >
                    <i className="product-btn-main__adding-icon fas fa-cart-plus" />
                    <span className="product-btn-main__text product-btn-main__adding-text hide-on-mobile">
                      Thêm Vào Giỏ Hàng
                    </span>
                  </button>
                  <button
                    onclick="document.location.to=this.getAttribute('to');"
                    to="product-cart.html"
                    className="product-btn-main product-btn-main__buying"
                  >
                    <span className="product-btn-main__text product-btn-main__buying-text">
                      Mua Ngay
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid wide">
        {/* Product shop */}
        <div className="row sm-gutter product-shop">
          <div className="product-shop__contact">
            <Link to="#" className="product-shop__contact-img-link">
              <div className="product-shop__contact-avatar-wrapper">
                <Link to={shopprofile ? `/shop/${shopprofile.id}` : "/"}>
                  <img
                    alt=""
                    className="product-shop__contact-avatar"
                    src={urlImage + "shopprofile/" + product.storeImage}
                  />
                </Link>
              </div>
            </Link>
            <div className="product-shop__contact-container">
              <div className="product-shop__contact-info">
                <Link to={`/shop/${shopprofile.id}`}>
                  <div className="product-shop__contact-name">
                    {product.storeName}
                  </div>
                </Link>
                <div className="product-shop__contact-online-time">
                  Online 28 Phút Trước
                </div>
              </div>
              <div className="product-shop__contact-main">
                <button className="product-shop__contact-btn product-shop__contact-message-btn hide-on-mobile">
                  <i className="product-shop__contact-icon far fa-comment-alt" />
                  <span className="product-shop__contact-message-text">
                    Chat Ngay
                  </span>
                </button>
                <Link
                  to="#"
                  className="product-shop__contact-btn product-shop__contact-viewing"
                >
                  <i className="product-shop__contact-icon fas fa-store" />
                  <div className="product-shop__contact-viewing-text">
                    Xem Shop
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="product-shop__side hide-on-mobile-tablet">
            <div className="product-shop__side-container">
              <div className="product-shop__side-wrapper">
                <label className="product-shop__side-label">Đánh giá</label>
                <div className="product-shop__side-qnt">220</div>
              </div>
              <Link to="#" className="product-shop__side-wrapper">
                <label className="product-shop__side-label">Sản phẩm</label>
                <div
                  to="#"
                  className="product-shop__side-qnt product-shop__side-qnt--link"
                >
                  12
                </div>
              </Link>
            </div>
            <div className="product-shop__side-container">
              <div className="product-shop__side-wrapper">
                <label className="product-shop__side-label">
                  Tỉ Lệ Phản Hồi
                </label>
                <div className="product-shop__side-qnt">95%</div>
              </div>
              <div className="product-shop__side-wrapper">
                <label className="product-shop__side-label">
                  Thời Gian Phản Hồi
                </label>
                <div className="product-shop__side-qnt">trong vài phút</div>
              </div>
            </div>
            <div className="product-shop__side-container">
              <div className="product-shop__side-wrapper">
                <label className="product-shop__side-label">Tham gia</label>
                <div className="product-shop__side-qnt">6 tháng trước</div>
              </div>
              <div className="product-shop__side-wrapper">
                <label className="product-shop__side-label">
                  Người theo dõi
                </label>
                <div className="product-shop__side-qnt">1.5k</div>
              </div>
            </div>
          </div>
          {/* Product shop slide on mobile */}
          <div className="product-shop__side-mobile">
            <div className="product-shop__side-wrapper">
              <label className="product-shop__side-label">Đánh giá</label>
              <div className="product-shop__side-qnt">220</div>
            </div>
            <Link to="#" className="product-shop__side-wrapper">
              <label className="product-shop__side-label">Sản phẩm</label>
              <div
                to="#"
                className="product-shop__side-qnt product-shop__side-qnt--link"
              >
                12
              </div>
            </Link>
            <div className="product-shop__side-wrapper">
              <label className="product-shop__side-label">Tỉ Lệ Phản Hồi</label>
              <div className="product-shop__side-qnt">95%</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid wide">
        <div
          className="row sm-gutter product-content__side"
          style={{ paddingBottom: 25 }}
        >
          {/* Product left content */}
          <div className="product-content--left">
            {/* Product details */}
            <div className="product-details">
              <div className="product-detail">
                <div className="product-detail__title">Chi tiết sản phẩm</div>
                <div className="product-details__wrapper">{product.detail}</div>
              </div>
              <div className="product-description">
                <div className="product-description__title">Mô tả sản phẩm</div>
                <span className="product-description__content">
                  {product.description}
                </span>
              </div>
            </div>
            {/* Product reviews */}
            <div className="product-reviews">
              <div className="product-reviews__header">ĐÁNH GIÁ SẢN PHẨM</div>
              {/* Stars on mobile */}

              <div className="product-ratings__list" style={{ opacity: 1 }}>
                <div className="shopee-product-comment-list">
                  {reviews &&
                    reviews.map((review, index) => (
                      <div className="shopee-product-rating">
                        <Link
                          className="shopee-product-rating__avatar"
                          to="/shop/85621919"
                        >
                          <div className="shopee-avatar">
                            <div className="shopee-avatar__placeholder">
                              <svg
                                enableBackground="new 0 0 15 15"
                                viewBox="0 0 15 15"
                                x={0}
                                y={0}
                                className="shopee-svg-icon icon-headshot"
                              >
                                <g>
                                  <circle
                                    cx="7.5"
                                    cy="4.5"
                                    fill="none"
                                    r="3.8"
                                    strokeMiterlimit={10}
                                  ></circle>
                                  <path
                                    d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeMiterlimit={10}
                                  ></path>
                                </g>
                              </svg>
                            </div>
                            <img
                              className="shopee-avatar__imgg"
                              alt=""
                              src={
                                urlImage +
                                "/user/" +
                                users.find((user) => user.id === review.user_id)
                                  ?.image
                              }
                            />
                          </div>
                        </Link>

                        <div className="shopee-product-rating__main">
                          <Link className="shopee-product-rating__author-name">
                            {
                              users.find((user) => user.id === review.user_id)
                                ?.username
                            }
                          </Link>
                          <div className="repeat-purchase-con">
                            <div className="shopee-product-rating__rating">
                              {[...Array(5)].map((_, index) => (
                                <svg
                                  key={index}
                                  enableBackground="new 0 0 15 15"
                                  viewBox="0 0 15 15"
                                  x={0}
                                  y={0}
                                  className={
                                    index < review.rating
                                      ? "shopee-svg-icon icon-rating-solid"
                                      : "shopee-svg-icon icon-rating"
                                  }
                                >
                                  <polygon
                                    points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                  />
                                </svg>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div style={{ marginTop: "0.75rem" }}>
                              {review.comment}
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                background:
                                  "linear-gradient(to left, rgb(255, 255, 255) 75%, rgba(255, 255, 255, 0))",
                                paddingLeft: 24,
                              }}
                            ></div>
                          </div>
                          <div className="shopee-product-rating__image-list-wrapper">
                            <div className="rating-media-list">
                              <div className="rating-media-list__container">
                                <div className="rating-media-list__image-wrapper rating-media-list__image-wrapper--inactive">
                                  <div className="shopee-rating-media-list-image__wrapper">
                                    <div className="shopee-rating-media-list-image__content">
                                      <div className="shopee-rating-media-list-image__content--blur">
                                        <img
                                          alt=""
                                          className="shopee-rating-media-list-image__content"
                                          src={
                                            urlImage + "review/" + review.image
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="product-content--right hide-on-mobile-tablet">
            {/* Product vouchers */}

            {/* Product hot sales */}
            <div className="product-hot-sales hide-on-mobile-tablet">
              <div className="product-hot-sales__header">
                Top Sản Phẩm Bán Chạy
              </div>
              <Link to="#" className="product-hot-sales__link">
                <div>
                  <img
                    alt=""
                    className="product-hot-sales__item-img"
                    src={require("../../Images/ao2mattruoc.png")}
                  />
                </div>
                <div className="product-hot-sales__item-wrapper">
                  <div className="product-hot-sales__item-name">
                    Sách hướng dẫn chơi Minecraft Dungeons bìa cứng
                  </div>
                  <div className="product-hot-sales__item-price">₫219.000</div>
                </div>
              </Link>
              <Link to="#" className="product-hot-sales__link">
                <div>
                  <img
                    alt=""
                    className="product-hot-sales__item-img"
                    src={require("../../Images/ao3mattruoc.png")}
                  />
                </div>
                <div className="product-hot-sales__item-wrapper">
                  <div className="product-hot-sales__item-name">
                    Áo thun ngắn Steve và Alex sinh tồn
                  </div>
                  <div className="product-hot-sales__item-price">₫125.900</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
