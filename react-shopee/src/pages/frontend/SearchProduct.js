import { Link, useLocation } from "react-router-dom";
import { urlImage } from "../../config";
import { useEffect, useState } from "react";
import ProductService from "../../service/ProductService";
import { TbFilterSearch } from "react-icons/tb";
import "../../CSS/filterprice.css";
import "../../CSS/paginate.css";
import AdvertisingCampaignService from "../../service/AdvertisingCampaignsService";
import AdvertisingAccountService from "../../service/AdvertisingAccountService";
const SearchProduct = () => {
  const [products, setProducts] = useState([]);
  const [productAds, setProductAds] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25; // Số lượng mục trên mỗi trang

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get("search");

        const resultproductAds = await AdvertisingCampaignService.Ad_search(
          searchTerm
        );
        setProductAds(resultproductAds.data);
        console.log("re", resultproductAds.data);

        const resultproduct = await ProductService.search({ text: searchTerm });
        // Kiểm tra xem sản phẩm đã tồn tại trong productAds hay không trước khi thêm vào Products
        const filteredResultProduct = resultproduct.data.filter((product) => {
          return !resultproductAds.data.some(
            (adProduct) => adProduct.product_id === product.id
          );
        });
        const idsOfFilteredProducts = filteredResultProduct.map(
          (product) => product.id
        );
        setProductIds(idsOfFilteredProducts);
        console.log(idsOfFilteredProducts);

        // Kiểm tra nếu filteredResultProduct rỗng, sử dụng productAds
        if (filteredResultProduct.length !== 0) {
          setProducts(filteredResultProduct);
          setFilteredProducts(filteredResultProduct);
          const highestScoreProducts = await fetchHighestScoreProductsFromList(
            idsOfFilteredProducts
          );
          setFilteredProducts(highestScoreProducts);
        }

        setNoProductsFound(
          filteredResultProduct.length === 0 &&
            resultproductAds.data.length === 0
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchData();
  }, [location.search]);
  const fetchHighestScoreProductsFromList = async (productIds) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/highestScoreProductsFromList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds }),
        }
      );
      const highestScoreProducts = await response.json();
      return highestScoreProducts;
    } catch (error) {
      console.error("Lỗi khi lấy các sản phẩm có điểm số cao:", error);
      return [];
    }
  };
  const handleApplyFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const filtered = products.filter((product) => {
      const productPrice =
        product.price_display > 0 ? product.price_display : product.price;
      return productPrice >= min && productPrice <= max;
    });
    setFilteredProducts(filtered);
    setCurrentPage(0); // Đặt trang hiện tại về trang đầu tiên sau khi áp dụng bộ lọc
    setNoProductsFound(filtered.length === 0);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Sử dụng filteredProducts nếu có bộ lọc, nếu không, sử dụng products
  const displayedProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayedProducts.slice(startIndex, endIndex);

  // Tạo các phần tử cho phân trang
  const pageCount = Math.ceil(displayedProducts.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(
      <a
        key={i}
        href={`#${i}`}
        className={currentPage === i ? "active" : ""}
        onClick={() => handlePageClick(i)}
      >
        {i + 1}
      </a>
    );
  }
  const [noProductsFound, setNoProductsFound] = useState(false);
  const handleClearFilter = () => {
    setFilteredProducts(products); // Đặt lại danh sách sản phẩm được lọc về danh sách ban đầu
    setMinPrice(""); // Đặt lại giá trị của input minPrice về rỗng
    setMaxPrice(""); // Đặt lại giá trị của input maxPrice về rỗng
    setCurrentPage(0); // Đặt trang hiện tại về trang đầu tiên
    setNoProductsFound(false);
  };

  const giamProducts = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.price_display > 0 ? a.price_display : a.price;
      const priceB = b.price_display > 0 ? b.price_display : b.price;
      return priceB - priceA;
    });
    setFilteredProducts(sortedProducts);
    console.log("Sản phẩm theo giá giảm dần:", sortedProducts);
  };

  const tangProducts = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const priceA = a.price_display > 0 ? a.price_display : a.price;
      const priceB = b.price_display > 0 ? b.price_display : b.price;
      return priceA - priceB;
    });
    setFilteredProducts(sortedProducts);
    console.log("Sản phẩm theo giá tăng dần:", sortedProducts);
  };
  const HandleAdvertisement = async (sellerid, price, ad_id) => {
    try {
      const result = await AdvertisingAccountService.updateBalance(
        sellerid,
        price
      );
      const resultAdCampaign = await AdvertisingCampaignService.updateClicks(
        ad_id
      );

      // Xử lý kết quả nếu cần
    } catch (error) {
      console.error("Lỗi cập nhật số dư tài khoản quảng cáo:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };
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
  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <div className="category-pc" style={{ width: 180 }}>
              <nav className="category" style={{ marginBottom: 30 }}>
                <div
                  className=""
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TbFilterSearch />

                  <div
                    className="category__heading"
                    style={{ marginLeft: 10, fontSize: 18 }}
                  >
                    BỘ LỌC TÌM KIẾM
                  </div>
                </div>
                {/* Content category items */}

                <fieldset className="shopee-filter-group shopee-price-range-filter shopee-price-range-filter--vn">
                  <legend
                    className="shopee-filter-group__header shopee-price-range-filter__header"
                    style={{ marginBottom: 15 }}
                  >
                    Khoảng Giá
                  </legend>
                  <div className="shopee-filter-group__body shopee-price-range-filter__edit">
                    <div className="shopee-price-range-filter__inputs">
                      <input
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        type="text"
                        aria-label
                        maxLength={13}
                        className="shopee-price-range-filter__input"
                        placeholder="₫ TỪ"
                      />
                      <div className="shopee-price-range-filter__range-line"></div>
                      <input
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        type="text"
                        aria-label
                        maxLength={13}
                        className="shopee-price-range-filter__input"
                        placeholder="₫ ĐẾN"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyFilter}
                    className="shopee-button-solid shopee-button-solid--primary uVTeLC"
                    aria-label
                    style={{ backgroundColor: "rgb(238, 77, 45)" }}
                  >
                    Áp dụng
                  </button>
                </fieldset>
                <button
                  onClick={handleClearFilter}
                  className="shopee-button-solid shopee-button-solid--primary uVTeLC"
                  aria-label
                  style={{ backgroundColor: "rgb(238, 77, 45)" }}
                >
                  Xóa
                </button>
              </nav>
            </div>
          </div>
          {noProductsFound ? (
            <div className="col l-5 m-12 c-12" style={{ marginLeft: 360 }}>
              <img
                src=""
                // src={require("../../Images/a60759ad1dabe909c46a.png")}
                style={{ width: 140, marginTop: 50 }}
              ></img>
              <p
                style={{
                  marginTop: -10,
                  marginBottom: 160,
                  fontSize: 19,
                  marginLeft: -29,
                }}
              >
                Không có sản phẩm nào
              </p>
            </div>
          ) : (
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
                  {productAds.length === 0
                    ? ""
                    : productAds.map((product) => (
                        <div
                          className="col l-2-4 c-6"
                          key={product.id}
                          onClick={() =>
                            HandleAdvertisement(
                              product.seller_id,
                              product.bid_price,
                              product.ad_campaign_id
                            )
                          }
                        >
                          <Link
                            onClick={() => ScorePlus(product.product_id)}
                            to={`/product-detail/${product.slug}${
                              product.ad_campaign_id
                                ? `?productWithAdCampaignId=${product.ad_campaign_id}`
                                : ""
                            }`}
                            className="home-product-item"
                          >
                            <img
                              src={`${urlImage}product/${product.image}`}
                              className="home-product-item__img"
                              alt={product.name}
                            />
                            <div className="home-product-item__name">
                              <span className="text-danger"> [AD] </span>
                              {product.name}
                            </div>
                            {product.pricesale === null ? (
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
                                    {formatPrice(parseInt(product.pricesale))}
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

                            {product.discount > 0 ? (
                              <div className="product-sale-off">
                                <span className="product-sale-off__percent">
                                  {product.discount}%
                                </span>
                                <span className="product-sale-off__label">
                                  {" "}
                                  GIẢM{" "}
                                </span>
                              </div>
                            ) : null}
                          </Link>
                        </div>
                      ))}

                  {currentItems.map((product) => (
                    <div className="col l-2-4 c-6" key={product.id}>
                      <Link
                        onClick={() => ScorePlus(product.id)}
                        to={`/product-detail/${product.slug}`}
                        className="home-product-item"
                      >
                        <img
                          src={`${urlImage}product/${product.image}`}
                          className="home-product-item__img"
                          alt={product.name}
                        />
                        <div className="home-product-item__name">
                          {product.name}
                        </div>

                        <div
                          className=" home-product-item__price"
                          style={{ marginLeft: 100 }}
                        >
                          <>
                            <span className="home-product-item__price-current">
                              {formatPrice(parseInt(product.price))}
                            </span>
                          </>
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

                        {product.discount > 0 ? (
                          <div className="product-sale-off">
                            <span className="product-sale-off__percent">
                              {product.discount}%
                            </span>
                            <span className="product-sale-off__label">
                              {" "}
                              GIẢM{" "}
                            </span>
                          </div>
                        ) : null}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {displayedProducts.length > 0 && pageCount > 0 && (
                <div className="paginationsite">
                  {currentPage === 0 ? (
                    <a
                      href={`#${currentPage}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      &laquo;
                    </a>
                  ) : (
                    <a
                      href={`#${currentPage - 1}`}
                      onClick={() => handlePageClick(currentPage - 1)}
                    >
                      &laquo;
                    </a>
                  )}
                  {pageNumbers}
                  {currentPage === pageCount - 1 ? (
                    <a
                      href={`#${currentPage}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      &raquo;
                    </a>
                  ) : (
                    <a
                      href={`#${currentPage + 1}`}
                      onClick={() => handlePageClick(currentPage + 1)}
                    >
                      &raquo;
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
