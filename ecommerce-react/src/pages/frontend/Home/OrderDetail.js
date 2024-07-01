import { useEffect, useState } from "react";
import { CgPassword } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { PiAddressBook } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import OrderService from "../../../service/OrderService";
import { urlImage } from "../../../config";
import UserService from "../../../service/UserService";

const OrderDetail = () => {
  const { id } = useParams();
  const [load, setLoad] = useState(Date.now());
  const [user, setUser] = useState(null);
  const storedUserId = localStorage.getItem("userId");
  const [orderdetail, setOrderDetails] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (storedUserId !== null) {
          const resultUser = await UserService.getById(storedUserId);
          setUser(resultUser.data);
        }
  
        const resultOrderDetail = await OrderService.getOrderDetailById(id);
        setOrderDetails(resultOrderDetail.data);
        console.log("jas", resultOrderDetail.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [load, orderdetail, id, storedUserId]);
  
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content d-flex justify-content-center">
          <div className="col l-10 m-12 c-12">
            <div className="home-product">
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
                          <div className="P2JMvg">
                            <div className="">
                              <div className="LY5oll">
                                <Link
                                  className="lXbYsi"
                                  to="/user/purchase/order/162834213270520?type=6"
                                >
                                  <span className="O2yAdQ">
                                    {(() => {
                                      switch (
                                        orderdetail.order_detail_status
                                      ) {
                                        case 1:
                                          return "Chờ lấy hàng";
                                        case 0:
                                          return "Chờ xác nhận";
                                        case 2:
                                          return "Đang giao";
                                        case 3:
                                          return "Đã giao";
                                        case 4:
                                          return "Đã hủy";
                                        case 5:
                                          return "Trả hàng";
                                        default:
                                          return "Hết hàng";
                                      }
                                    })()}
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </section>
                        <div className="kG_yF0"></div>
                        <section>
                          <h3 className="a11y-hidden"></h3>
                          <Link
                            aria-label
                            to="/user/purchase/order/162834213270520?type=6"
                          >
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
                                              orderdetail.product_image
                                            }
                                            className="gQuHsZ"
                                            alt
                                            tabIndex={0}
                                          />
                                          <div className="nmdHRf">
                                            <div>
                                              <div className="zWrp4w">
                                                <span
                                                  className="DWVWOJ"
                                                  tabIndex={0}
                                                >
                                                  {orderdetail.product_name}
                                                </span>
                                              </div>
                                            </div>
                                            <div>
                                              <div
                                                className="rsautk"
                                                tabIndex={0}
                                              >
                                                {
                                                  orderdetail
                                                    .order_detail_attribute
                                                }
                                              </div>
                                              <div
                                                className="j3I_Nh"
                                                tabIndex={0}
                                              >
                                                x
                                                {
                                                  orderdetail
                                                    .order_detail_qty
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="ylYzwa" tabIndex={0}>
                                          <div className="YRp1mm">
                                            <span className="nW_6Oi">
                                              {formatPrice(
                                                parseInt(
                                                  orderdetail
                                                    .order_detail_price
                                                )
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
                          aria-label={
                            "Thành tiền: " + orderdetail.order_detail_amount
                          }
                        >
                          {formatPrice(
                            parseInt(orderdetail.order_detail_amount)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
