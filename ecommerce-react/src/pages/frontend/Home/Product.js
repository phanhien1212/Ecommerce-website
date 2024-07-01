import "../../../CSS/flash-sale-main.css";
import "../../../CSS/category-main.css";
import ProductService from "../../../service/ProductService";
import { useState, useEffect } from "react";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import FlashSale from "./FlashSale";
import CategoryService from "./../../../service/CategoryService";
import { FaListUl } from "react-icons/fa";
const Product = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductService.getProductSaleQtyStatus();
        const sortedProducts = response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setProducts(sortedProducts);
        console.log("so", sortedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const ScorePlus = async (productid) => {
    try {
      const addScore = new FormData();
      addScore.append("product_id", productid);
      addScore.append("score", 1);
      await ProductService.addscore(addScore);
    } catch (error) {
      console.error("Error adding score:", error);
    }
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoryService.getCategoriesActive();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [categories]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleCategories = (direction) => {
    if (direction === "left") {
      // Xử lý khi nhấn mũi tên left
    } else if (direction === "right") {
      // Xử lý khi nhấn mũi tên right
    }
  };
  const giamProducts = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.price_display > 0 ? a.price_display : a.price;
      const priceB = b.price_display > 0 ? b.price_display : b.price;
      return priceB - priceA;
    });
    setProducts(sortedProducts);
    console.log("Sản phẩm theo giá giảm dần:", sortedProducts);
  };

  const tangProducts = () => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = a.price_display > 0 ? a.price_display : a.price;
      const priceB = b.price_display > 0 ? b.price_display : b.price;
      return priceA - priceB;
    });
    setProducts(sortedProducts);
    console.log("Sản phẩm theo giá tăng dần:", sortedProducts);
  };
  return (
    <div>
      <div className="grid wide">
        <div className="home-category-list">
          <div className="shopee-header-section home-category-list__header shopee-header-section--simple">
            <div className="shopee-header-section__header">
              <div className="shopee-header-section__header__title">
                Danh Mục
              </div>
            </div>
            <div className="shopee-header-section__content">
              <div className="image-carousel">
                <div className="image-carousel__item-list-wrapper">
                  <ul
                    className="image-carousel__item-list"
                    style={{ width: "135%", transform: "translate(0px, 0px)" }}
                  >
                    {categories &&
                      categories
                        .filter(
                          (category) =>
                            category.parent_id === 0 || showAllCategories
                        )
                        .map((category, index) => (
                          <li
                            className="image-carousel__item"
                            style={{ padding: 0, width: "5%" }}
                          >
                            <Link
                              to={"/productbycategory/" + category.id}
                              className="home-category-list__category-grid"
                            >
                              <div className="g3RFjs">
                                <div className="_2QRysE">
                                  <div className="_3Jjuff +K-jRT">
                                    <img
                                      className="+K-jRT OooQQJ"
                                      src={
                                        urlImage + "category/" + category.image
                                      }
                                      alt=""
                                      style={{
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        marginLeft: -10,
                                      }}
                                    ></img>
                                  </div>
                                </div>
                                <div className="GE2Jnm">
                                  <div className="_0qFceF">{category.name}</div>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                  </ul>
                </div>
                <div
                  className="carousel-arrow carousel-arrow--prev carousel-arrow--hint carousel-arrow--hidden"
                  role="button"
                  tabIndex={0}
                  style={{
                    opacity: 1,
                    visibility: "hidden",
                    transform: "translateX(calc(-50% + 0px))",
                  }}
                >
                  <svg
                    onClick={() => toggleCategories("left")}
                    enableBackground="new 0 0 13 20"
                    viewBox="0 0 13 20"
                    x={0}
                    y={0}
                    className="shopee-svg-icon icon-arrow-left-bold"
                  >
                    <polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon>
                  </svg>
                </div>
                <div
                  className="carousel-arrow carousel-arrow--next carousel-arrow--hint"
                  role="button"
                  tabIndex={0}
                  style={{
                    opacity: 1,
                    visibility: "visible",
                    transform: "translateX(calc(50% + 0px))",
                  }}
                >
                  <svg
                    onClick={() => toggleCategories("right")}
                    enableBackground="new 0 0 13 21"
                    viewBox="0 0 13 21"
                    x={0}
                    y={0}
                    className="shopee-svg-icon icon-arrow-right-bold"
                  >
                    <polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon>
                  </svg>
                </div>
                <div
                  className="carousel-arrow carousel-arrow--next carousel-arrow--hint"
                  role="button"
                  tabIndex={0}
                  style={{
                    opacity: 1,
                    visibility: "visible",
                    transform: "translateX(calc(50% + 0px))",
                  }}
                >
                  <svg
                    enableBackground="new 0 0 13 21"
                    viewBox="0 0 13 21"
                    x={0}
                    y={0}
                    className="shopee-svg-icon icon-arrow-right-bold"
                  >
                    <polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FlashSale />
      </div>

      <div className="app__container">
        <div className="grid wide">
          <div className="row sm-gutter app__content">
            <div className="col l-2 m-0 c-0">
              <div className="category-pc">
                <nav className="category">
                  <div className="category__heading-wrapper">
                    <FaListUl />
                    <div className=" ms-2 category__heading">Danh Mục</div>
                  </div>
                  {/* Content category items */}
                  <ul className="category-list">
                    {categories &&
                      categories
                        .filter(
                          (category) =>
                            category.parent_id === 0 || showAllCategories
                        )
                        .map((category, index) => (
                          <li className="category-item ">
                            <div className="category-item__icon">
                              <i className="fas fa-caret-right" />
                            </div>
                            <Link
                              to={"/productbycategory/" + category.id}
                              className="category-item__link"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col l-10 m-12 c-12">
              <div className="home-filter hide-on-mobile-tablet">
                <span className="home-filter__label">Sắp xếp theo</span>
                <button className="home-filter__btn btnn btnn--primary">
                  Mới nhất
                </button>
                <div className="select-input">
                  <span className="select-input__label">Giá</span>
                  <i className="select-input__icon fas fa-angle-down" />
                  {/* List option */}
                  <ul className="select-input__list">
                    <li className="select-input__item" onClick={tangProducts}>
                      Giá: Thấp đến cao
                    </li>
                    <li className="select-input__item" onClick={giamProducts}>
                      Giá: Cao đến thấp
                    </li>
                  </ul>
                </div>
              </div>

              <div className="home-product">
                <div className="row sm-gutter">
                  {/* Product item */}
                  {products &&
                    products.map((product) => (
                      <div className="col l-2-4 c-6">
                        <Link
                          onClick={() => ScorePlus(product.id)}
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
                            {product.name}
                          </div>

                          {product.price_display === product.price ? (
                            <>
                              <div
                                className=" home-product-item__price"
                                style={{ marginLeft: 100 }}
                              >
                                <span className="home-product-item__price-current">
                                  {formatPrice(parseInt(product.price))}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="home-product-item__price">
                                <span className="home-product-item__price-old">
                                  {formatPrice(parseInt(product.price))}
                                </span>
                                <span className="home-product-item__price-current">
                                  {formatPrice(parseInt(product.price_display))}
                                </span>
                              </div>
                            </>
                          )}

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
                          {product.price_display === product.price ? (
                            ""
                          ) : (
                            <div className="product-sale-off">
                              <span className="product-sale-off__percent">
                                {" "}
                                {product.discount}%{" "}
                              </span>
                              <span className="product-sale-off__label">
                                {" "}
                                GIẢM{" "}
                              </span>
                            </div>
                          )}
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

export default Product;
