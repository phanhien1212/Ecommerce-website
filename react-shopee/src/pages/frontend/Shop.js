import { useEffect, useState } from "react";
import "../../CSS/shop.css";
import ShopProfileService from "../../service/ShopProfileService";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../config";
import ProductService from "../../service/ProductService";
import axios from "axios";
import UserService from "../../service/UserService";
const Shop = () => {
  const [activeItem, setActiveItem] = useState(0); // Trạng thái ban đầu
  const [load, setLoad] = useState(Date.now());
  // Hàm xử lý sự kiện click
  const handleItemClick = (index, e) => {
    e.preventDefault();
    // Cập nhật trạng thái activeItem với index của mục được nhấp vào
    setActiveItem(index);
  };

  const { id } = useParams();
  const [shopprofile, setShopProfile] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ShopProfileService.getByIdShopProfile(id);
        setShopProfile(result.data);
        const resultSellerId = await ProductService.productsellerid(
          result.data.idSeller
        );
        console.log("Ád", resultSellerId.data);
        setProducts(resultSellerId.data);
        setTempProducts(resultSellerId.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        console.log("storedUserId: " + storedUserId);
        setUserId(storedUserId);
        const result = await UserService.getById(storedUserId);
        setUser(result.data);

        console.log(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    // Đối tượng follow chứa thông tin cần gửi lên server

    const result = await ShopProfileService.getByIdShopProfile(id);
    setShopProfile(result.data);
    const shopId = result.data.id;

    const followData = {
      // Thay thế giá trị này bằng id của  người dùng cần theo dõi
      user_id: user.id,
      // Thay thế giá trị này bằng id của cửa hàng hiện tại
      shop_id: shopId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/follow",
        followData
      );
      setIsFollowing(true);
      console.log("Đã theo dõi cửa hàng thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi theo dõi cửa hàng:", error);
    }
  };

  const handleUnfollow = async () => {
    const result = await ShopProfileService.getByIdShopProfile(id);
    setShopProfile(result.data);
    const shopId = result.data.id;

    const followData = {
      // Thay thế giá trị này bằng id của  người dùng cần theo dõi
      user_id: user.id,
      // Thay thế giá trị này bằng id của cửa hàng hiện tại
      shop_id: shopId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/unfollow",
        followData
      );
      setIsFollowing(false);
      console.log("Đã bỏ theo dõi cửa hàng:", response.data);
    } catch (error) {
      console.error("Lỗi khi bỏ theo dõi cửa hàng:", error);
    }
  };

  const [userId, setUserId] = useState(null);
  const [followedShops, setFollowedShops] = useState([]);

  useEffect(() => {
    const fetchFollowedShops = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/followedShops?userId=${userId}`
        );
        setFollowedShops(response.data);
      } catch (error) {
        console.error("Error fetching followed shops:", error);
      }
    };

    fetchFollowedShops();
  }, [userId]);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const result = await ShopProfileService.getByIdShopProfile(id);
        setShopProfile(result.data);
        const shopId = result.data.id;
        console.log("ưuqi", result.data);
        const response = await axios.get(
          `http://localhost:8080/api/isFollowing?user_id=${userId}&shop_id=${shopId}`
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [id, userId]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const [categories, setCategories] = useState([]);
  const [tempProducts, setTempProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ShopProfileService.getByIdShopProfile(id);
        setShopProfile(result.data);
        const resultSellerId = await ProductService.categorysellerid(
          result.data.idSeller
        );
        setCategories(resultSellerId.data);
        console.log("afsafsa", resultSellerId.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [load, id]);
  const handleAllProductsClick = async () => {
    try {
      const result = await ShopProfileService.getByIdShopProfile(id);
      setShopProfile(result.data);
      const resultSellerId = await ProductService.productsellerid(
        result.data.idSeller
      );
      setProducts(resultSellerId.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const FilterCategory = async (category_id) => {
    const childCategories = categories.filter(
      (category) => category.parent_id === category_id
    );

    const selectedCategories = [
      category_id,
      ...childCategories.map((cat) => cat.id),
    ];

    const filteredProducts = tempProducts.filter((product) =>
      selectedCategories.includes(product.category_id)
    );

    console.log("gghh", filteredProducts);

    setProducts(filteredProducts);
  };
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await ShopProfileService.getByIdShopProfile(id);
        setShopProfile(result.data);
        const shopId = result.data.id;
        const response = await axios.get(
          `http://localhost:8080/api/${shopId}/followers/count`
        );

        setCount(response.data);
        console.log("dadsadsvcvxcvxc", response.data);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetch();
  }, []);
  return (
    <div>
      <div className="shop-page__info">
        <div className="grid wide">
          <div className="section-seller-overview-horizontal container">
            <div className="section-seller-overview-horizontal__leading">
              <div
                className="section-seller-overview-horizontal__leading-background"
                style={{
                  backgroundImage:
                    'url("https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/shopmicrofe/dc2a8ae5803b2531c9a537ae6432ce08.jpg")',
                }}
              ></div>
              <div className="section-seller-overview-horizontal__leading-background-mask"></div>
              {shopprofile && (
                <div className="section-seller-overview-horizontal__leading-content">
                  <div className="section-seller-overview-horizontal__seller-portrait UgJq78">
                    <Link
                      className="section-seller-overview-horizontal__seller-portrait-link"
                      to="/nowhere.localbrand"
                    >
                      <div className="shopee-avatar-shop wEpezN">
                        <div className="shopee-avatar-shop__placeholder">
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
                          alt=""
                          className="shopee-avatar-shop__img"
                          src={urlImage + "shopprofile/" + shopprofile.image}
                        />
                      </div>
                    </Link>
                    <div className="section-seller-overview-horizontal__portrait-info">
                      <h1 className="section-seller-overview-horizontal__portrait-name">
                        {shopprofile.name}
                      </h1>

                      <div className="section-seller-overview-horizontal__portrait-status">
                        <div className="section-seller-overview-horizontal__active-time">
                          Online 2 giờ trước
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="section-seller-overview-horizontal__buttons">
                    {isFollowing ? (
                      <Link className="section-seller-overview-horizontal__button section-seller-overview-horizontal__button--following">
                        <button
                          onClick={handleUnfollow}
                          className="shopee-button-outline shopee-button-outline--complement shopee-button-outline--fill"
                        >
                          <span className="section-seller-overview-horizontal__icon">
                            <svg
                              enableBackground="new 0 0 10 10"
                              viewBox="0 0 10 10"
                              x={0}
                              y={0}
                              className="shopee-svg-icon icon-plus-sign"
                            >
                              <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                            </svg>
                          </span>
                          ĐANG THEO
                        </button>
                      </Link>
                    ) : (
                      <Link className="section-seller-overview-horizontal__button ">
                        <button
                          onClick={handleFollow}
                          className="shopee-button-outline shopee-button-outline--complement shopee-button-outline--fill"
                        >
                          <span className="section-seller-overview-horizontal__icon">
                            <svg
                              enableBackground="new 0 0 10 10"
                              viewBox="0 0 10 10"
                              x={0}
                              y={0}
                              className="shopee-svg-icon icon-plus-sign"
                            >
                              <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                            </svg>
                          </span>
                          THEO DÕI
                        </button>
                      </Link>
                    )}

                    <Link
                      argettype="chatButton"
                      className="section-seller-overview-horizontal__button"
                    >
                      <button className="shopee-button-outline shopee-button-outline--complement shopee-button-outline--fill">
                        <span className="section-seller-overview-horizontal__icon">
                          <svg viewBox="0 0 16 16" className="shopee-svg-icon">
                            <g fillRule="evenodd">
                              <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path>
                            </g>
                          </svg>
                        </span>
                        chat
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="section-seller-overview-horizontal__seller-info-list">
              <div className="section-seller-overview__item section-seller-overview__item--clickable">
                <div className="section-seller-overview__item-icon-wrapper">
                  <svg
                    enableBackground="new 0 0 15 15"
                    viewBox="0 0 15 15"
                    x={0}
                    y={0}
                    strokeWidth={0}
                    className="shopee-svg-icon"
                  >
                    <path d="m13 1.9c-.2-.5-.8-1-1.4-1h-8.4c-.6.1-1.2.5-1.4 1l-1.4 4.3c0 .8.3 1.6.9 2.1v4.8c0 .6.5 1 1.1 1h10.2c.6 0 1.1-.5 1.1-1v-4.6c.6-.4.9-1.2.9-2.3zm-11.4 3.4 1-3c .1-.2.4-.4.6-.4h8.3c.3 0 .5.2.6.4l1 3zm .6 3.5h.4c.7 0 1.4-.3 1.8-.8.4.5.9.8 1.5.8.7 0 1.3-.5 1.5-.8.2.3.8.8 1.5.8.6 0 1.1-.3 1.5-.8.4.5 1.1.8 1.7.8h.4v3.9c0 .1 0 .2-.1.3s-.2.1-.3.1h-9.5c-.1 0-.2 0-.3-.1s-.1-.2-.1-.3zm8.8-1.7h-1v .1s0 .3-.2.6c-.2.1-.5.2-.9.2-.3 0-.6-.1-.8-.3-.2-.3-.2-.6-.2-.6v-.1h-1v .1s0 .3-.2.5c-.2.3-.5.4-.8.4-1 0-1-.8-1-.8h-1c0 .8-.7.8-1.3.8s-1.1-1-1.2-1.7h12.1c0 .2-.1.9-.5 1.4-.2.2-.5.3-.8.3-1.2 0-1.2-.8-1.2-.9z"></path>
                  </svg>
                </div>
                <div className="section-seller-overview__item-text">
                  <div className="section-seller-overview__item-text-name">
                    Sản phẩm:&nbsp;
                  </div>
                  <div className="section-seller-overview__item-text-value">
                    {products.length}
                  </div>
                </div>
              </div>
              <div className="section-seller-overview__item">
                <div className="section-seller-overview__item-icon-wrapper">
                  <svg
                    enableBackground="new 0 0 15 15"
                    viewBox="0 0 15 15"
                    x={0}
                    y={0}
                    className="shopee-svg-icon"
                  >
                    <g>
                      <circle
                        cx="5.5"
                        cy={5}
                        fill="none"
                        r={4}
                        strokeMiterlimit={10}
                      ></circle>
                      <path
                        d="m8.4 7.5c.7 0 1.1.7 1.1 1.6v4.9h-8v-4.9c0-.9.4-1.6 1.1-1.6"
                        fill="none"
                        strokeLinejoin="round"
                        strokeMiterlimit={10}
                      ></path>
                      <path
                        d="m12.6 6.9c.7 0 .9.6.9 1.2v5.7h-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit={10}
                      ></path>
                      <path
                        d="m9.5 1.2c1.9 0 3.5 1.6 3.5 3.5 0 1.4-.9 2.7-2.1 3.2"
                        fill="none"
                        strokeLinecap="round"
                        strokeMiterlimit={10}
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="section-seller-overview__item-text">
                  <div className="section-seller-overview__item-text-name">
                    Người theo dõi:&nbsp;
                  </div>
                  <div className="section-seller-overview__item-text-value">
                    {count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-page-menu">
        <div className="grid wide">
          <div className="navbar-with-more-menu navbar-with-more-menu--narrow">
            <div
              className="container navbar-with-more-menu__wrapper navbar-with-more-menu__wrapper--no-shadow"
              style={{ backgroundColor: "rgb(255, 255, 255)" }}
            >
              <div className="navbar-with-more-menu__items">
                <Link
                  className={`navbar-with-more-menu__item ${
                    activeItem === 0
                      ? "navbar-with-more-menu__item--active"
                      : ""
                  }`}
                  to=""
                  onClick={(e) => handleItemClick(0, e)} // Gọi hàm xử lý khi được nhấp vào
                >
                  <span>Dạo</span>
                </Link>
                <Link
                  className={`navbar-with-more-menu__item ${
                    activeItem === 1
                      ? "navbar-with-more-menu__item--active"
                      : ""
                  }`}
                  to=""
                  onClick={handleAllProductsClick} // Gọi hàm xử lý khi được nhấp vào
                >
                  <span>TẤT CẢ SẢN PHẨM</span>
                </Link>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    className={`navbar-with-more-menu__item ${
                      activeItem === index + 2
                        ? "navbar-with-more-menu__item--active"
                        : ""
                    }`}
                    to=""
                    onClick={(e) => handleItemClick(index + 2, e)} // Gọi hàm xử lý khi được nhấp vào
                  >
                    <span onClick={() => FilterCategory(category.id)}>
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app__container">
        <div className="grid wide">
          <div className="row sm-gutter app__content">
            <div className="col l-2 m-0 c-0">
              <div className="category-pc">
                <nav className="category">
                  <div className="category__heading-wrapper">
                    <i className="category__heading-icon fas fa-th-large" />
                    <div className="category__heading">Danh Mục</div>
                  </div>
                  {/* Content category items */}
                  <ul className="category-list">
                                        {categories.map((category, index) => (
                                        <li className={`category-item ${activeItem === index + 2 ? 'category-item--active' : ''}`}   onClick={(e) => handleItemClick(index + 2, e)}>
                                            <div className="category-item__icon">
                                                <i className="fas fa-caret-right" />
                                            </div>
                                            <a href="#" className="category-item__link" onClick={() => FilterCategory(category.id)}>{category.name}</a>
                                        </li>
                                        ))}
                                    </ul>
                </nav>
              </div>
            </div>
            <div className="col l-10 m-12 c-12">
              <div className="home-filter hide-on-mobile-tablet">
                <span className="home-filter__label">Sắp xếp theo</span>
                <button className="home-filter__btn btnn">Phổ biến</button>
                <button className="home-filter__btn btnn btnn--primary">
                  Mới nhất
                </button>
                <button className="home-filter__btn btnn">Bán chạy</button>
                <div className="select-input">
                  <span className="select-input__label">Giá</span>
                  <i className="select-input__icon fas fa-angle-down" />
                  {/* List option */}
                  <ul className="select-input__list">
                    <li className="select-input__item">Giá: Thấp đến cao</li>
                    <li className="select-input__item">Giá: Cao đến thấp</li>
                  </ul>
                </div>
              </div>

              <div className="home-product">
                <div className="row sm-gutter">
                  {/* Product item */}
                  {products.map((product) => (
                    <div className="col l-2-4  c-6">
                      <Link
                        to={"/product-detail/" + product.slug}
                        id={0}
                        className="home-product-item"
                      >
                        <img
                          alt=""
                          src={urlImage + "product/" + product.image}
                          className="home-product-item__img"
                        />
                        <div className="home-product-item__name">
                          {" "}
                          {product.name}
                        </div>
                        <div className="home-product-item__price">
                          <span className="home-product-item__price-old">
                            {" "}
                            đ1.500.000{" "}
                          </span>
                          <span className="home-product-item__price-current">
                            {" "}
                            {formatPrice(parseInt(product.price, 10))}{" "}
                          </span>
                        </div>
                        <div className="home-product-item__action">
                          <div className="home-product-item__rating">
                            <i className="home-product-item__star--gold fas fa-star" />
                            <i className="home-product-item__star--gold fas fa-star" />
                            <i className="home-product-item__star--gold fas fa-star" />
                            <i className="home-product-item__star--gold fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                          <span className="home-product-item__sold">
                            {" "}
                            12 đã bán{" "}
                          </span>
                        </div>
                        <div className="product-favourite">
                          <i className="fas fa-check" />
                          <span> Yêu thích </span>
                        </div>
                        <div className="product-sale-off">
                          <span className="product-sale-off__percent">
                            {" "}
                            23%{" "}
                          </span>
                          <span className="product-sale-off__label">
                            {" "}
                            GIẢM{" "}
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
