import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../config";
import { useEffect, useState } from "react";
import ProductService from "../../service/ProductService";
import CategoryService from "../../service/CategoryService";
import { TbFilterSearch } from "react-icons/tb";
const ProductByCategory = () => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [tempProducts, setTempProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15; // Số lượng mục trên mỗi trang
  const [noProductsFound, setNoProductsFound] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin của danh mục
        const result = await CategoryService.getById(id);
        setCategory(result.data);

        // Lấy danh sách sản phẩm của danh mục cha
        const parentCategoryProducts = await ProductService.productcategoryid(
          id
        );
        let allProducts = parentCategoryProducts.data;

        // Lấy danh sách sản phẩm của danh mục con
        const childCategories = await CategoryService.getChildren(id);
        const childCategoryIds = childCategories.data.map((child) => child.id);
        const childProductPromises = childCategoryIds.map((categoryId) =>
          ProductService.productcategoryid(categoryId)
        );
        const childProductResponses = await Promise.all(childProductPromises);
        const childProducts = childProductResponses.flatMap(
          (response) => response.data
        );

        // Kết hợp danh sách sản phẩm của danh mục cha và danh mục con
        allProducts = allProducts.concat(childProducts);

        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setTempProducts(allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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

  const [subcategories, setSubcategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await CategoryService.getChildren(id);
        setSubcategories(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const FilterCategory = async (category_id, event) => {
    event.preventDefault();
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
    setFilteredProducts(filteredProducts);
  };

  const FilterCategoryandChildren = async (categoryId, event) => {
    event.preventDefault();
    try {
      // Lấy danh sách sản phẩm của danh mục cha
      const parentCategoryProducts = await ProductService.productcategoryid(
        categoryId
      );
      let allProducts = parentCategoryProducts.data;

      // Lấy danh sách sản phẩm của danh mục con
      const childCategories = await CategoryService.getChildren(categoryId);
      const childCategoryIds = childCategories.data.map((child) => child.id);
      const childProductPromises = childCategoryIds.map((categoryId) =>
        ProductService.productcategoryid(categoryId)
      );
      const childProductResponses = await Promise.all(childProductPromises);
      const childProducts = childProductResponses.flatMap(
        (response) => response.data
      );

      // Kết hợp danh sách sản phẩm của danh mục cha và danh mục con
      allProducts = allProducts.concat(childProducts);
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
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

  const handleClearFilter = () => {
    setFilteredProducts(products); // Đặt lại danh sách sản phẩm được lọc về danh sách ban đầu
    setMinPrice(""); // Đặt lại giá trị của input minPrice về rỗng
    setMaxPrice(""); // Đặt lại giá trị của input maxPrice về rỗng
    setCurrentPage(0); // Đặt trang hiện tại về trang đầu tiên
    setNoProductsFound(false);
  };

  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <div className="category-pc">
              <nav className="category" style={{ marginBottom: 30 }}>
                <div className="category__heading-wrapper">
                  <i className="category__heading-icon fas fa-th-large" />
                  <div className="category__heading">Danh Mục</div>
                </div>
                {/* Content category items */}
                <ul className="category-list borderbotttom">
                  <li className="category-itemm">
                    <div className="category-item__icon">
                      <i className="fas fa-caret-right" />
                    </div>
                    <a
                      href=""
                      className="category-item__link"
                      onClick={(event) =>
                        FilterCategoryandChildren(category.id, event)
                      }
                      style={{ fontWeight: 600 }}
                    >
                      {category.name}
                    </a>
                  </li>
                  {subcategories.map((subcategory) => (
                    <li className="category-itemm">
                      <div className="category-item__icon">
                        <i className="fas fa-caret-right" />
                      </div>
                      <a
                        href=""
                        onClick={(event) =>
                          FilterCategory(subcategory.id, event)
                        }
                        className="category-item__link"
                      >
                        {subcategory.name}
                      </a>
                    </li>
                  ))}
                </ul>
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
                  {currentItems.map((product) => (
                    <div className="col l-2-4 c-6" key={product.id}>
                      <Link
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
                        {product.price_display === product.price ? (
                          <div
                            className=" home-product-item__price"
                            style={{ marginLeft: 100 }}
                          >
                            <>
                              <span className="home-product-item__price-current">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          </div>
                        ) : (
                          <>
                            <div className="home-product-item__price">
                              <span className="home-product-item__price-old">
                                {formatPrice(product.price)}
                              </span>
                              <span className="home-product-item__price-current">
                                {formatPrice(product.price_display)}
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

export default ProductByCategory;
