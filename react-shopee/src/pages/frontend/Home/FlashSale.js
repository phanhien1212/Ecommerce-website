import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../../service/ProductService";
import { urlImage } from "../../../config";

const FlashSale = () => {
  const [productFlashSale, setProductFlashSale] = useState([]);
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    (async () => {
      const resultFlashSale = await ProductService.getallflashsale();
      const filteredProducts = resultFlashSale.data.filter((product) => {
        const comparisonResult = compareCurrentTime(
          product.start_time,
          product.end_time
        );
        return comparisonResult === 1; // chỉ giữ lại các sản phẩm có thời gian hiện tại nằm trong khoảng thời gian bắt đầu và kết thúc
      });
      setProductFlashSale(filteredProducts);
    })();
  }, [load, productFlashSale]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  function compareCurrentTime(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    const currentTime = new Date();

    if (currentTime >= startTime && currentTime <= endTime) {
      return 1; // Thời gian hiện tại nằm trong khoảng thời gian bắt đầu và kết thúc
    } else if (currentTime > endTime) {
      return 2; // Thời gian hiện tại sau thời gian kết thúc
    } else if (currentTime < startTime) {
      return 3; // Thời gian hiện tại trước thời gian bắt đầu
    }
  }
  return (
    <div className="Fre7Cq">
      <div className="jZnDGb">
        <div className="KN54ZH">
          <div
            className="T1a1K4"
            aria-label="title Flash Sales"
            tabIndex={0}
          ></div>
        </div>
        <Link
          className="bBrhmJ"
          aria-label="click, enter flash sale button Xem tất cả"
          to="/flash_sale?promotionId=213941439627265"
        >
          Xem tất cả&nbsp;
          <svg
            enableBackground="new 0 0 11 11"
            viewBox="0 0 11 11"
            x={0}
            y={0}
            className="shopee-svg-icon icon-arrow-right"
          >
            <path d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"></path>
          </svg>
        </Link>
      </div>
      <div className="image-carousel">
        <div className="image-carousel__item-list-wrapper">
          <ul
            className="image-carousel__item-list"
            style={{ width: "266.667%", transform: "translate(0px, 0px)" }}
          >
            {productFlashSale.map((product) => (
              <li
                className="image-carousel__item"
                style={{ padding: 0, width: "200px" }}
              >
                <div className="b9LBeQ">
                  <div className="bDb3QO _2jVIc-">
                    <Link
                      aria-label={product.product_name}
                      to={"/product-detail/" + product.product_slug}
                    >
                      <div className="EkjBMP _2jVIc-">
                        <div className="dEw30H">
                          <div className="L1k9wv T7s+N- hGTLQm">
                            <div className="HmlBrO ElZOUi">
                              <svg
                                width={10}
                                height={16}
                                viewBox="0 0 10 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.23077 0H4.23077L0 7.82222L3.5 9.14286V16L10 5.68889L6.53846 4.62222L9.23077 0Z"
                                  fill="url(#paint0_linear_2216_10611)"
                                ></path>
                                <defs>
                                  <linearGradient
                                    id="paint0_linear_2216_10611"
                                    x1={0}
                                    y1={0}
                                    x2={0}
                                    y2={16}
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="#EE4D2D"></stop>
                                    <stop offset={1} stopColor="#FF7337"></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            {product.discount}%
                          </div>
                        </div>
                        <div className="Ww4ck0">
                          <div className="HT+eFy uOQMgX _43c7xw"></div>

                          <div className="OSJb20 wP9-V9">
                            <div
                              className="wP9-V9 WPIj4t"
                              style={{
                                backgroundImage: `url(${urlImage}/product/${product.product_image})`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="ML8D8p">
                        <div className="yCebL1 QpXvtd WNgAbL">
                          <div className="LYc+Cb QpXvtd WNgAbL">
                            <div className="S82jCy jNH2Rc BnrHAR">
                              <div className="hSM8kk">
                                <span>{formatPrice(product.price_sale)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
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
          <div
            role="button"
            aria-label="click, scroll left to see more"
            tabIndex={0}
          ></div>
          <svg
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
          <div
            role="button"
            aria-label="click, scroll right to see more"
            tabIndex={0}
          ></div>
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
  );
};

export default FlashSale;
