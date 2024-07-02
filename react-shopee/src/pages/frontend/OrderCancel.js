import React, { useEffect, useState } from "react";
import { CgPassword } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { PiAddressBook } from "react-icons/pi";
import OrderService from "../../service/OrderService";
import UserService from "../../service/UserService";
import ShopProfileService from "../../service/ShopProfileService";
import { urlImage } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import ReviewService from "../../service/ReviewService";
const OrderCancel = () => {
  const buyerId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [orderFeedBack, setOrderFeedBack] = useState({});
  const [shopProfiles, setShopProfiles] = useState([]);
  const [product_id, setProductId] = useState("");
  const [comment, setComment] = useState("");
  const [starRating, setStarRating] = useState("");
  const [load, setLoad] = useState(Date.now());
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const result = await OrderService.getOrderWithOrderDetails();
      const resultShopProfile = await ShopProfileService.getShopProfile();
      setShopProfiles(resultShopProfile.data);
      const responseData = result.data; // Giả sử dữ liệu được lưu trong key "data"

      // Lọc ra các đơn hàng có seller_id giống với sellerId
      const filteredOrders = responseData.filter(
        (order) =>
          order.user_id === parseInt(buyerId) && order.order_detail_status === 4
      );

      setOrders(filteredOrders);
      console.log("fil", filteredOrders);
    })();
  }, [load, orders]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const stars = document.querySelectorAll(".rating-stars__star--clickable");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      // Lấy ra giá trị khi click vào sao thứ index + 1
      const ratingValue = index + 1;
      setStarRating(ratingValue);
      // Loại bỏ thuộc tính "style" khỏi tất cả các sao
      stars.forEach((s) => {
        s.querySelector("svg:last-child").style.width = "0%";
      });

      // Thiết lập chiều rộng của các sao từ sao 1 đến sao được click
      for (let i = 0; i <= index; i++) {
        stars[i].querySelector("svg:last-child").style.width = "100%";
      }
    });
  });

  const handleSaveFeedBack = async (order_id, product_id) => {
    const image = document.getElementById("imageFeedback");
    const addFeedBack = new FormData();
    addFeedBack.append("user_id", buyerId);
    addFeedBack.append("product_id", product_id);
    addFeedBack.append("rating", starRating);
    addFeedBack.append("comment", comment);
    addFeedBack.append("created_by", buyerId);

    addFeedBack.append("image", image.files.length === 0 ? "" : image.files[0]);

    try {
      const resultProduct = await ReviewService.addFeedBack(addFeedBack);
      console.log(resultProduct);

      if (resultProduct.status === 201) {
        const updateStatus = new FormData();
        updateStatus.append("status", 6);
        const resultFeedBack = await OrderService.updatestatusorderdetail(
          order_id,
          updateStatus
        );
        setLoad(Date.now());
        console.log(resultFeedBack);
        setComment("");
        setSelectedImage("");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    }
  };
  const handleComplete = async (order_id) => {
    const updateStatus = new FormData();
    updateStatus.append("status", 3);
    const resultFeedBack = await OrderService.updatestatusorderdetail(
      order_id,
      updateStatus
    );
  };
  const handleCancel = async (order_id) => {
    const updateStatus = new FormData();
    updateStatus.append("status", 4);
    const resultFeedBack = await OrderService.updatestatusorderdetail(
      order_id,
      updateStatus
    );
  };
  const handleDetail = (order_id) => {
    navigate("/orderdetail/" + order_id);
  };
  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <div className="category-pc">
              <nav className="category">
                <div className="AmWkJQ">
                  <Link className="_1O4r+C" to="/user/account/profile">
                    <div className="shopee-avatar">
                      <img
                        className="shopee-avatar__img"
                        src="https://down-vn.img.susercontent.com/file/a2f5c23b58a9c5fcd53233ee88aaf225_tn"
                      />
                    </div>
                  </Link>
                  <div className="miwGmI" style={{ marginLeft: 20 }}>
                    <div className="mC1Llc">bzzlnmtm6_</div>
                    <div>
                      <Link className="_78QHr1" to="/user/account/profile">
                        <svg
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ marginRight: 4 }}
                        >
                          <path
                            d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48"
                            fill="#9B9B9B"
                            fillRule="evenodd"
                          />
                        </svg>
                        Sửa hồ sơ
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content category items */}
                <ul
                  className="category-list"
                  style={{ marginTop: 10, marginLeft: -5 }}
                >
                  <li className="category-item ">
                    <div className="category-ac-item__icon">
                      <img
                        style={{ width: 20 }}
                        src="https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4"
                      ></img>
                    </div>
                    <Link
                      to="/account"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <PiAddressBook
                        style={{ color: "#0066CC", fontSize: 20 }}
                      />
                    </div>
                    <Link
                      to="/address"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Địa chỉ
                    </Link>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <img
                        style={{ width: 20 }}
                        src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078"
                      ></img>
                    </div>
                    <Link
                      to="/order"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Đơn mua
                    </Link>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <MdFavoriteBorder
                        style={{ fontSize: 20, color: "red" }}
                      />
                    </div>
                    <Link
                      to="/favorite-product"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Sản phẩm yêu thích
                    </Link>
                  </li>
                  <li className="category-item">
                    <div className="category-ac-item__icon ">
                      <CgPassword style={{ fontSize: 20, color: "black" }} />
                    </div>
                    <Link
                      to="/change-password"
                      style={{ marginLeft: 6 }}
                      className="category-item__link"
                    >
                      Đổi mật khẩu
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="col l-10 m-12 c-12">
            <section className="QmO3Bu" aria-role="tablist">
              <h2 className="a11y-hidden"></h2>
              <Link
                className="KI5har "
                title="Tất cả"
                aria-role="tab"
                aria-selected="true"
                aria-controls="olp_panel_id-0.2500798487074487"
                id="olp_tab_id-0.2500798487074487"
                to="/order"
              >
                <span className="NoH9rC">Tất cả</span>
              </Link>

              <Link
                className="KI5har "
                title="Chờ xác nhận"
                aria-role="tab"
                aria-selected="false"
                aria-controls="olp_panel_id-0.1907308322270871"
                id="olp_tab_id-0.1907308322270871"
                to="/orderwaitting"
              >
                <span className="NoH9rC">Chờ xác nhận</span>
              </Link>
              <Link
                className="KI5har "
                title="Vận chuyển"
                aria-role="tab"
                aria-selected="false"
                aria-controls="olp_panel_id-0.1907308322270871"
                id="olp_tab_id-0.1907308322270871"
                to="/orderprepare"
              >
                <span className="NoH9rC">Chuẩn bị hàng</span>
              </Link>
              <Link
                className="KI5har "
                title="Chờ giao hàng"
                aria-role="tab"
                aria-selected="false"
                aria-controls="olp_panel_id-0.35560181198015095"
                id="olp_tab_id-0.35560181198015095"
                to="/ordershipping"
              >
                <span className="NoH9rC">Chờ giao hàng</span>
              </Link>
              <Link
                className="KI5har "
                title="Hoàn thành"
                aria-role="tab"
                aria-selected="false"
                aria-controls="olp_panel_id-0.4927510125560266"
                id="olp_tab_id-0.4927510125560266"
                to="/ordercompleted"
              >
                <span className="NoH9rC">Hoàn thành</span>
              </Link>
              <Link
                className="KI5har mRVNLm"
                title="Đã hủy"
                aria-role="tab"
                aria-selected="true"
                aria-controls="olp_panel_id-0.016262427448072936"
                id="olp_tab_id-0.016262427448072936"
                to="/ordercancel"
              >
                <span className="NoH9rC">Đã hủy</span>
              </Link>
              <Link
                className="KI5har"
                title="Trả hàng"
                aria-role="tab"
                aria-selected="false"
                aria-controls="olp_panel_id-0.016262427448072936"
                id="olp_tab_id-0.016262427448072936"
                to="/orderreturn"
              >
                <span className="NoH9rC">Trả hàng</span>
              </Link>
            </section>

            <div className="home-product">
              {orders.map((order, index) => (
                <main
                  aria-role="tabpanel"
                  aria-labelledby="olp_tab_id-0.44408754544375273"
                  id="olp_panel_id-0.44408754544375273"
                >
                  <h2 className="a11y-hidden"></h2>
                  <div>
                    <div className="YL_VlX">
                      <div>
                        <div className="J632se">
                          <section>
                            <h3 className="a11y-hidden"></h3>
                            <div className="P2JMvg">
                              <div className="RBPP9y">
                                <div className="UDaMW3" tabIndex={0}>
                                  {shopProfiles
                                    .filter(
                                      (s) => s.idSeller === order.seller_id
                                    )
                                    .map((s) => s.name)
                                    .join("") || ""}
                                </div>
                                <div className="B2SOGC">
                                  <button className="stardust-button stardust-button--primary">
                                    <svg
                                      viewBox="0 0 17 17"
                                      className="shopee-svg-icon icon-btn-chat"
                                      style={{ fill: "white" }}
                                    >
                                      <g fillRule="evenodd">
                                        <path
                                          d="M13.89 0C14.504 0 15 .512 15 1.144l-.003.088-.159 2.117.162.001c.79 0 1.46.558 1.618 1.346l.024.15.008.154v9.932a1.15 1.15 0 01-1.779.963l-.107-.08-1.882-1.567-7.962.002a1.653 1.653 0 01-1.587-1.21l-.036-.148-.021-.155-.071-.836h-.01L.91 13.868a.547.547 0 01-.26.124L.556 14a.56.56 0 01-.546-.47L0 13.429V1.144C0 .512.497 0 1.11 0h12.78zM15 4.65l-.259-.001-.461 6.197c-.045.596-.527 1.057-1.106 1.057L4.509 11.9l.058.69.01.08a.35.35 0 00.273.272l.07.007 8.434-.001 1.995 1.662.002-9.574-.003-.079a.35.35 0 00-.274-.3L15 4.65zM13.688 1.3H1.3v10.516l1.413-1.214h10.281l.694-9.302zM4.234 5.234a.8.8 0 011.042-.077l.187.164c.141.111.327.208.552.286.382.131.795.193 1.185.193s.803-.062 1.185-.193c.225-.078.41-.175.552-.286l.187-.164a.8.8 0 011.042 1.209c-.33.33-.753.579-1.26.753A5.211 5.211 0 017.2 7.4a5.211 5.211 0 01-1.706-.28c-.507-.175-.93-.424-1.26-.754a.8.8 0 010-1.132z"
                                          fillRule="nonzero"
                                        ></path>
                                      </g>
                                    </svg>
                                    <span>chat</span>
                                  </button>
                                </div>
                                <Link
                                  className="Mr26O7"
                                  to="/phulieutoc_ngocbich?entryPoint=OrderDetail"
                                >
                                  <div className="stardust-button">
                                    <svg
                                      enableBackground="new 0 0 15 15"
                                      viewBox="0 0 15 15"
                                      x={0}
                                      y={0}
                                      className="shopee-svg-icon icon-btn-shop"
                                    >
                                      <path d="m15 4.8c-.1-1-.8-2-1.6-2.9-.4-.3-.7-.5-1-.8-.1-.1-.7-.5-.7-.5h-8.5s-1.4 1.4-1.6 1.6c-.4.4-.8 1-1.1 1.4-.1.4-.4.8-.4 1.1-.3 1.4 0 2.3.6 3.3l.3.3v3.5c0 1.5 1.1 2.6 2.6 2.6h8c1.5 0 2.5-1.1 2.5-2.6v-3.7c.1-.1.1-.3.3-.3.4-.8.7-1.7.6-3zm-3 7c0 .4-.1.5-.4.5h-8c-.3 0-.5-.1-.5-.5v-3.1c.3 0 .5-.1.8-.4.1 0 .3-.1.3-.1.4.4 1 .7 1.5.7.7 0 1.2-.1 1.6-.5.5.3 1.1.4 1.6.4.7 0 1.2-.3 1.8-.7.1.1.3.3.5.4.3.1.5.3.8.3zm.5-5.2c0 .1-.4.7-.3.5l-.1.1c-.1 0-.3 0-.4-.1s-.3-.3-.5-.5l-.5-1.1-.5 1.1c-.4.4-.8.7-1.4.7-.5 0-.7 0-1-.5l-.6-1.1-.5 1.1c-.3.5-.6.6-1.1.6-.3 0-.6-.2-.9-.8l-.5-1-.7 1c-.1.3-.3.4-.4.6-.1 0-.3.1-.3.1s-.4-.4-.4-.5c-.4-.5-.5-.9-.4-1.5 0-.1.1-.4.3-.5.3-.5.4-.8.8-1.2.7-.8.8-1 1-1h7s .3.1.8.7c.5.5 1.1 1.2 1.1 1.8-.1.7-.2 1.2-.5 1.5z"></path>
                                    </svg>
                                    <span>Xem Shop</span>
                                  </div>
                                </Link>
                              </div>
                              <div className="jgIyoX">
                                <div className="LY5oll">
                                  <Link
                                    className="lXbYsi"
                                    to="/user/purchase/order/162834213270520?type=6"
                                  >
                                    <span className="O2yAdQ">
                                      <svg
                                        enableBackground="new 0 0 15 15"
                                        viewBox="0 0 15 15"
                                        x={0}
                                        y={0}
                                        className="shopee-svg-icon icon-free-shipping-line"
                                      >
                                        <g>
                                          <line
                                            fill="none"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            x1="8.6"
                                            x2="4.2"
                                            y1="9.8"
                                            y2="9.8"
                                          ></line>
                                          <circle
                                            cx={3}
                                            cy="11.2"
                                            fill="none"
                                            r={2}
                                            strokeMiterlimit={10}
                                          ></circle>
                                          <circle
                                            cx={10}
                                            cy="11.2"
                                            fill="none"
                                            r={2}
                                            strokeMiterlimit={10}
                                          ></circle>
                                          <line
                                            fill="none"
                                            strokeMiterlimit={10}
                                            x1="10.5"
                                            x2="14.4"
                                            y1="7.3"
                                            y2="7.3"
                                          ></line>
                                          <polyline
                                            fill="none"
                                            points="1.5 9.8 .5 9.8 .5 1.8 10 1.8 10 9.1"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                          ></polyline>
                                          <polyline
                                            fill="none"
                                            points="9.9 3.8 14 3.8 14.5 10.2 11.9 10.2"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                          ></polyline>
                                        </g>
                                      </svg>
                                      {order.order_status}
                                    </span>
                                  </Link>
                                  <div
                                    className="shopee-drawer"
                                    id="pc-drawer-id-42"
                                    tabIndex={0}
                                  >
                                    <svg
                                      enableBackground="new 0 0 15 15"
                                      viewBox="0 0 15 15"
                                      x={0}
                                      y={0}
                                      className="shopee-svg-icon icon-help"
                                    >
                                      <g>
                                        <circle
                                          cx="7.5"
                                          cy="7.5"
                                          fill="none"
                                          r="6.5"
                                          strokeMiterlimit={10}
                                        ></circle>
                                        <path
                                          d="m5.3 5.3c.1-.3.3-.6.5-.8s.4-.4.7-.5.6-.2 1-.2c.3 0 .6 0 .9.1s.5.2.7.4.4.4.5.7.2.6.2.9c0 .2 0 .4-.1.6s-.1.3-.2.5c-.1.1-.2.2-.3.3-.1.2-.2.3-.4.4-.1.1-.2.2-.3.3s-.2.2-.3.4c-.1.1-.1.2-.2.4s-.1.3-.1.5v.4h-.9v-.5c0-.3.1-.6.2-.8s.2-.4.3-.5c.2-.2.3-.3.5-.5.1-.1.3-.3.4-.4.1-.2.2-.3.3-.5s.1-.4.1-.7c0-.4-.2-.7-.4-.9s-.5-.3-.9-.3c-.3 0-.5 0-.7.1-.1.1-.3.2-.4.4-.1.1-.2.3-.3.5 0 .2-.1.5-.1.7h-.9c0-.3.1-.7.2-1zm2.8 5.1v1.2h-1.2v-1.2z"
                                          stroke="none"
                                        ></path>
                                      </g>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                          <div className="kG_yF0"></div>
                          <section>
                            <Link to="/user/purchase/order/162834213270520?type=6">
                              <div>
                                <div className="bdAfgU">
                                  <div className="FNHV0p">
                                    <div>
                                      <section>
                                        <div className="mZ1OWk">
                                          <div className="dJaa92">
                                            <img
                                              src={
                                                urlImage +
                                                "product/" +
                                                order.product_image
                                              }
                                              className="gQuHsZ"
                                              alt={order.product_image}
                                              tabIndex={0}
                                            />
                                            <div className="nmdHRf">
                                              <div>
                                                <div className="zWrp4w">
                                                  <span
                                                    className="DWVWOJ"
                                                    tabIndex={0}
                                                  >
                                                    {order.product_name}
                                                  </span>
                                                </div>
                                              </div>
                                              <div>
                                                <div
                                                  className="rsautk"
                                                  tabIndex={0}
                                                >
                                                  Phân loại hàng:{" "}
                                                  <span>
                                                    {
                                                      order.order_detail_attribute
                                                    }
                                                  </span>
                                                </div>
                                                <div
                                                  className="j3I_Nh"
                                                  tabIndex={0}
                                                >
                                                  x
                                                  <span>
                                                    {order.order_detail_qty}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="ylYzwa" tabIndex={0}>
                                            <div className="YRp1mm">
                                              <span className="nW_6Oi">
                                                {formatPrice(
                                                  order.order_detail_price
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </section>
                                    </div>
                                    <div className="PB3XKx"></div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </section>
                          <div className="Ze0Icc"></div>
                        </div>
                      </div>
                      <div className="peteXU">
                        <div className="IVFywZ HmaSt0"></div>
                        <div className="IVFywZ fT_AQM"></div>
                      </div>
                      <div className="LwXnUQ">
                        <div className="NWUSQP">
                          <span className="R_ufN9">
                            <div className="afBScK" tabIndex={0}>
                              <svg
                                width={16}
                                height={17}
                                viewBox="0 0 253 263"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>Shopee Guarantee</title>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z"
                                  fill="#ee4d2d"
                                ></path>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z"
                                  fill="#fff"
                                ></path>
                              </svg>
                            </div>
                          </span>
                          <label className="juCcT0">Thành tiền:</label>
                          <div
                            className="t7TQaf"
                            tabIndex={0}
                            aria-label={formatPrice(order.order_detail_amount)}
                          >
                            {formatPrice(order.order_detail_amount)}
                          </div>
                        </div>
                      </div>
                      <div className="yyqgYp">
                        <section className="po9nwN">
                          <div className="aAXjeK">
                            {(() => {
                              switch (order.order_detail_status) {
                                case 1:
                                  return (
                                    <>
                                      {" "}
                                      <div className="hbQXWm">
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleDetail(
                                                order.order_detail_id
                                              )
                                            }
                                            className="stardust-button stardust-button--secondary QY7kZh"
                                            style={{ marginLeft: 780 }}
                                          >
                                            Chuẩn bị hàng
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  );
                                case 0:
                                  return (
                                    <>
                                      {" "}
                                      <div className="hbQXWm">
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleDetail(
                                                order.order_detail_id
                                              )
                                            }
                                            className="stardust-button stardust-button--secondary QY7kZh"
                                            style={{ marginLeft: 620 }}
                                          >
                                            Chờ xác nhận
                                          </button>
                                        </div>
                                      </div>
                                      <div className="hbQXWm">
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleCancel(
                                                order.order_detail_id
                                              )
                                            }
                                            className="stardust-button stardust-button--primary QY7kZh"
                                          >
                                            Hủy đơn hàng
                                          </button>
                                        </div>
                                      </div>
                                    </>
                                  );
                                case 2:
                                  return (
                                    <div className="hbQXWm">
                                      <div>
                                        <button
                                          style={{ marginLeft: 780 ,width:100}}
                                          className="stardust-button stardust-button--primary QY7kZh"
                                          onClick={() =>
                                            handleComplete(
                                              order.order_detail_id
                                            )
                                          }
                                        >
                                          Đã Nhận Được Hàng
                                        </button>
                                      </div>
                                    </div>
                                  );
                                case 3:
                                  return (
                                    <>
                                      {" "}
                                      <button
                                        style={{ marginLeft: 780 }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal4"
                                        className="stardust-button stardust-button--primary QY7kZh"
                                        onClick={() => {
                                          setOrderFeedBack(order);
                                        }}
                                      >
                                        Đánh giá
                                      </button>
                                      <div
                                        class="modal fade"
                                        id="exampleModal4"
                                        tabindex="-1"
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                      >
                                        <div class="modal-dialog">
                                          <div
                                            class="modal-content"
                                            style={{
                                              marginTop: 63,
                                              marginLeft: -130,
                                              width: 750,
                                            }}
                                          >
                                            <div className="shopee-popup__container">
                                              <div
                                                style={{ display: "contents" }}
                                              >
                                                <div>
                                                  <div className="shopee-popup-form oiFnma">
                                                    <div className="shopee-popup-form__header">
                                                      <div className="shopee-popup-form__title">
                                                        Đánh giá sản phẩm
                                                      </div>
                                                    </div>
                                                    <div className="shopee-popup-form__main">
                                                      <div className="shopee-popup-form__main-container">
                                                        <div className="rating-modal-handler__container rating-modal-handler__container--last">
                                                          <div className="I83LOI _wP3Oz">
                                                            <div className="shopee-image__wrapper W0XhTD">
                                                              <div className="shopee-image__place-holder">
                                                                <svg
                                                                  enableBackground="new 0 0 15 15"
                                                                  viewBox="0 0 15 15"
                                                                  x={0}
                                                                  y={0}
                                                                  className="shopee-svg-icon icon-loading-image"
                                                                >
                                                                  <g>
                                                                    <rect
                                                                      fill="none"
                                                                      height={8}
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      width={10}
                                                                      x={1}
                                                                      y="4.5"
                                                                    ></rect>
                                                                    <line
                                                                      fill="none"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      x1={1}
                                                                      x2={11}
                                                                      y1="6.5"
                                                                      y2="6.5"
                                                                    ></line>
                                                                    <rect
                                                                      fill="none"
                                                                      height={3}
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      width={3}
                                                                      x={11}
                                                                      y="6.5"
                                                                    ></rect>
                                                                    <line
                                                                      fill="none"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      x1={1}
                                                                      x2={11}
                                                                      y1="14.5"
                                                                      y2="14.5"
                                                                    ></line>
                                                                    <line
                                                                      fill="none"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      x1={6}
                                                                      x2={6}
                                                                      y1=".5"
                                                                      y2={3}
                                                                    ></line>
                                                                    <line
                                                                      fill="none"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      x1="3.5"
                                                                      x2="3.5"
                                                                      y1={1}
                                                                      y2={3}
                                                                    ></line>
                                                                    <line
                                                                      fill="none"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      strokeMiterlimit={
                                                                        10
                                                                      }
                                                                      x1="8.5"
                                                                      x2="8.5"
                                                                      y1={1}
                                                                      y2={3}
                                                                    ></line>
                                                                  </g>
                                                                </svg>
                                                              </div>
                                                              <div
                                                                className="shopee-image__content"
                                                                style={{
                                                                  backgroundImage: `url(${urlImage}/product/${orderFeedBack.product_image})`,
                                                                }}
                                                              >
                                                                <div className="shopee-image__content--blur"></div>
                                                              </div>
                                                            </div>
                                                            <div className="suoW0p">
                                                              <div className="ebS_Lb">
                                                                {
                                                                  orderFeedBack.product_name
                                                                }
                                                              </div>
                                                              <div className="gs2KUm">
                                                                {orderFeedBack.order_detail_attribute !==
                                                                ""
                                                                  ? `Phân loại hàng: ${orderFeedBack.order_detail_attribute}`
                                                                  : ""}
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div
                                                            style={{
                                                              margin:
                                                                "20px 0px",
                                                            }}
                                                          >
                                                            <div className="zFp3PR">
                                                              <div className="wMM2UN">
                                                                <span>
                                                                  Chất lượng sản
                                                                  phẩm
                                                                </span>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  paddingLeft: 5,
                                                                }}
                                                              >
                                                                <div
                                                                  className="rating-stars__star--clickable dMTuWJ"
                                                                  style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                  }}
                                                                >
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__hollow"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="99.0177926%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFD211"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="none"
                                                                      fillRule="evenodd"
                                                                      stroke="url(#star__hollow)"
                                                                      strokeWidth={
                                                                        2
                                                                      }
                                                                      d="M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z"
                                                                    />
                                                                  </svg>
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                    style={{
                                                                      width:
                                                                        "0%",
                                                                    }}
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__solid"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="100%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFCA11"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="url(#star__solid)"
                                                                      fillRule="evenodd"
                                                                      d="M14.9988798 25.032153l-8.522024 4.7551739c-.4785069.2670004-.7939037.0347448-.7072938-.5012115l1.6339124-10.1109185-6.8944622-7.1327607c-.3871203-.4005006-.2499178-.7947292.2865507-.8774654l9.5090982-1.46652789L14.5740199.51703028c.2346436-.50460972.6146928-.50543408.8497197 0l4.2693588 9.18141263 9.5090986 1.46652789c.545377.0841102.680337.4700675.28655.8774654l-6.894462 7.1327607 1.633912 10.1109185c.08788.5438118-.232337.7662309-.707293.5012115l-8.5220242-4.7551739z"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  paddingLeft: 5,
                                                                }}
                                                              >
                                                                <div
                                                                  className="rating-stars__star--clickable dMTuWJ"
                                                                  style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                  }}
                                                                >
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__hollow"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="99.0177926%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFD211"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="none"
                                                                      fillRule="evenodd"
                                                                      stroke="url(#star__hollow)"
                                                                      strokeWidth={
                                                                        2
                                                                      }
                                                                      d="M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z"
                                                                    />
                                                                  </svg>
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                    style={{
                                                                      width:
                                                                        "0%",
                                                                    }}
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__solid"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="100%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFCA11"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="url(#star__solid)"
                                                                      fillRule="evenodd"
                                                                      d="M14.9988798 25.032153l-8.522024 4.7551739c-.4785069.2670004-.7939037.0347448-.7072938-.5012115l1.6339124-10.1109185-6.8944622-7.1327607c-.3871203-.4005006-.2499178-.7947292.2865507-.8774654l9.5090982-1.46652789L14.5740199.51703028c.2346436-.50460972.6146928-.50543408.8497197 0l4.2693588 9.18141263 9.5090986 1.46652789c.545377.0841102.680337.4700675.28655.8774654l-6.894462 7.1327607 1.633912 10.1109185c.08788.5438118-.232337.7662309-.707293.5012115l-8.5220242-4.7551739z"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  paddingLeft: 5,
                                                                }}
                                                              >
                                                                <div
                                                                  className="rating-stars__star--clickable dMTuWJ"
                                                                  style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                  }}
                                                                >
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__hollow"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="99.0177926%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFD211"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="none"
                                                                      fillRule="evenodd"
                                                                      stroke="url(#star__hollow)"
                                                                      strokeWidth={
                                                                        2
                                                                      }
                                                                      d="M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z"
                                                                    />
                                                                  </svg>
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                    style={{
                                                                      width:
                                                                        "0%",
                                                                    }}
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__solid"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="100%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFCA11"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="url(#star__solid)"
                                                                      fillRule="evenodd"
                                                                      d="M14.9988798 25.032153l-8.522024 4.7551739c-.4785069.2670004-.7939037.0347448-.7072938-.5012115l1.6339124-10.1109185-6.8944622-7.1327607c-.3871203-.4005006-.2499178-.7947292.2865507-.8774654l9.5090982-1.46652789L14.5740199.51703028c.2346436-.50460972.6146928-.50543408.8497197 0l4.2693588 9.18141263 9.5090986 1.46652789c.545377.0841102.680337.4700675.28655.8774654l-6.894462 7.1327607 1.633912 10.1109185c.08788.5438118-.232337.7662309-.707293.5012115l-8.5220242-4.7551739z"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  paddingLeft: 5,
                                                                }}
                                                              >
                                                                <div
                                                                  className="rating-stars__star--clickable dMTuWJ"
                                                                  style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                  }}
                                                                >
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__hollow"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="99.0177926%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFD211"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="none"
                                                                      fillRule="evenodd"
                                                                      stroke="url(#star__hollow)"
                                                                      strokeWidth={
                                                                        2
                                                                      }
                                                                      d="M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z"
                                                                    />
                                                                  </svg>
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                    style={{
                                                                      width:
                                                                        "0%",
                                                                    }}
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__solid"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="100%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFCA11"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="url(#star__solid)"
                                                                      fillRule="evenodd"
                                                                      d="M14.9988798 25.032153l-8.522024 4.7551739c-.4785069.2670004-.7939037.0347448-.7072938-.5012115l1.6339124-10.1109185-6.8944622-7.1327607c-.3871203-.4005006-.2499178-.7947292.2865507-.8774654l9.5090982-1.46652789L14.5740199.51703028c.2346436-.50460972.6146928-.50543408.8497197 0l4.2693588 9.18141263 9.5090986 1.46652789c.545377.0841102.680337.4700675.28655.8774654l-6.894462 7.1327607 1.633912 10.1109185c.08788.5438118-.232337.7662309-.707293.5012115l-8.5220242-4.7551739z"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              </div>
                                                              <div
                                                                style={{
                                                                  paddingLeft: 5,
                                                                }}
                                                              >
                                                                <div
                                                                  className="rating-stars__star--clickable dMTuWJ"
                                                                  style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                  }}
                                                                >
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__hollow"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="99.0177926%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFD211"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="none"
                                                                      fillRule="evenodd"
                                                                      stroke="url(#star__hollow)"
                                                                      strokeWidth={
                                                                        2
                                                                      }
                                                                      d="M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z"
                                                                    />
                                                                  </svg>
                                                                  <svg
                                                                    viewBox="0 0 30 30"
                                                                    className="ZWdKv_"
                                                                    style={{
                                                                      width:
                                                                        "0%",
                                                                    }}
                                                                  >
                                                                    <defs>
                                                                      <linearGradient
                                                                        id="star__solid"
                                                                        x1="50%"
                                                                        x2="50%"
                                                                        y1="0%"
                                                                        y2="100%"
                                                                      >
                                                                        <stop
                                                                          offset="0%"
                                                                          stopColor="#FFCA11"
                                                                        />
                                                                        <stop
                                                                          offset="100%"
                                                                          stopColor="#FFAD27"
                                                                        />
                                                                      </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                      fill="url(#star__solid)"
                                                                      fillRule="evenodd"
                                                                      d="M14.9988798 25.032153l-8.522024 4.7551739c-.4785069.2670004-.7939037.0347448-.7072938-.5012115l1.6339124-10.1109185-6.8944622-7.1327607c-.3871203-.4005006-.2499178-.7947292.2865507-.8774654l9.5090982-1.46652789L14.5740199.51703028c.2346436-.50460972.6146928-.50543408.8497197 0l4.2693588 9.18141263 9.5090986 1.46652789c.545377.0841102.680337.4700675.28655.8774654l-6.894462 7.1327607 1.633912 10.1109185c.08788.5438118-.232337.7662309-.707293.5012115l-8.5220242-4.7551739z"
                                                                    />
                                                                  </svg>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="J5M4lP">
                                                            <div className="nNhuz7">
                                                              <div className="LQNDXX"></div>
                                                              <div
                                                                style={{
                                                                  position:
                                                                    "relative",
                                                                }}
                                                              >
                                                                <textarea
                                                                  className="pFkDf6"
                                                                  rows={3}
                                                                  value={
                                                                    comment
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    setComment(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                  placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                                                                  style={{
                                                                    minHeight: 100,
                                                                    color:
                                                                      "rgba(0, 0, 0, 0.87)",
                                                                  }}
                                                                />
                                                              </div>
                                                            </div>
                                                            <div className="Y5ceMw">
                                                              {selectedImage && (
                                                                <div>
                                                                  <img
                                                                    alt="not found"
                                                                    width={
                                                                      "100px"
                                                                    }
                                                                    className="me-3 z-2 "
                                                                    src={URL.createObjectURL(
                                                                      selectedImage
                                                                    )}
                                                                  />
                                                                  <br />
                                                                </div>
                                                              )}

                                                              <label className="Bpmgeo">
                                                                <svg
                                                                  width={20}
                                                                  height={18}
                                                                  viewBox="0 0 20 18"
                                                                  fill="none"
                                                                >
                                                                  <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M6.15377 9.76895C6.15377 11.8927 7.87492 13.6151 9.99992 13.6151C12.1236 13.6151 13.8461 11.8927 13.8461 9.76895C13.8461 7.6446 12.1236 5.9228 9.99992 5.9228C7.87492 5.9228 6.15377 7.6446 6.15377 9.76895ZM5 9.76896C5 7.00771 7.23813 4.76896 10 4.76896C12.7613 4.76896 15 7.00771 15 9.76896C15 12.5296 12.7613 14.769 10 14.769C7.23813 14.769 5 12.5296 5 9.76896ZM1.15385 17.2606C0.489784 17.2606 0 16.7249 0 16.0662V4.12218C0 3.46224 0.489784 2.8459 1.15385 2.8459H4.61538L5.21635 1.73267C5.21635 1.73267 5.75421 0.538208 6.41827 0.538208H13.5817C14.2452 0.538208 14.7837 1.73267 14.7837 1.73267L15.3846 2.8459H18.8462C19.5096 2.8459 20 3.46224 20 4.12218V16.0662C20 16.7249 19.5096 17.2606 18.8462 17.2606H1.15385Z"
                                                                    fill="#EE4D2D"
                                                                  ></path>
                                                                </svg>
                                                                <span className="BiwStw">
                                                                  Thêm Hình ảnh
                                                                </span>
                                                                <input
                                                                  className="mXvRBf"
                                                                  type="file"
                                                                  id="imageFeedback"
                                                                  name="myImage"
                                                                  onChange={(
                                                                    event
                                                                  ) => {
                                                                    console.log(
                                                                      event
                                                                        .target
                                                                        .files[0]
                                                                    );
                                                                    setSelectedImage(
                                                                      event
                                                                        .target
                                                                        .files[0]
                                                                    );
                                                                  }}
                                                                  accept="image/*"
                                                                />
                                                              </label>
                                                              <div
                                                                className="_Y1LWz"
                                                                style={{
                                                                  backgroundImage:
                                                                    'url("")',
                                                                  border:
                                                                    "none",
                                                                }}
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="shopee-popup-form__footer"
                                                      style={{ top: 500 }}
                                                    >
                                                      <button
                                                        data-bs-dismiss="modal"
                                                        className="cancel-btn"
                                                      >
                                                        Trở Lại
                                                      </button>
                                                      <button
                                                        data-bs-dismiss="modal"
                                                        type="button"
                                                        onClick={() =>
                                                          handleSaveFeedBack(
                                                            orderFeedBack.order_detail_id,
                                                            orderFeedBack.product_id
                                                          )
                                                        }
                                                        className="btn btn-solid-primary btn--s btn--inline Etp4G2"
                                                      >
                                                        Hoàn thành
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                case 4:
                                  return (
                                    <button
                                      style={{ marginLeft: 780 }}
                                      className="stardust-button stardust-button--primary QY7kZh"
                                    >
                                      đơn hàng đã bị hủy
                                    </button>
                                  );

                                default:
                                  return "";

                                // ) : (
                                //   <button className="stardust-button stardust-button--secondary QY7kZh">
                                //     Mua lại
                                //   </button>
                              }
                            })()}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </main>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancel;
