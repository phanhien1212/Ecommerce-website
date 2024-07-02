import { useLocation, useNavigate } from "react-router-dom";
import "../../CSS/checkout.css";

import { useEffect, useState } from "react";
import { urlImage } from "../../config";
import currency from "currency.js";
import UserService from "../../service/UserService";
import OrderService from "../../service/OrderService";
import TransactionService from "../../service/TransactionService";
import NotificationService from "../../service/NotificationService";
import ProductService from "../../service/ProductService";
import ShippingService from "../../service/ShippingService";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../state/cartSlice";
import { ToastContainer, toast } from "react-toastify";
const Checkout = () => {
  const [note, setNote] = useState("");
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [productsByStore, setProductsByStore] = useState({});
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const dispatch = useDispatch();
  const [totalPriceAll, setTotalPriceAll] = useState(0);
  const [shippings, setShippings] = useState([]);
  const [totalPrice, setTotalPrice] = useState({});
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);
  const [load, setLoad] = useState(Date.now());
  const storedUserId = localStorage.getItem("userId");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (storedUserId !== null) {
          const result = await UserService.getById(storedUserId);
          setUser(result.data);
          setFirstName(result.data.firstname);
          setLastName(result.data.lastname);
          setPhone(result.data.phone);
          setAddress(result.data.address);
          setLatitude(result.data.latitude);
          setLongitude(result.data.longitude);
        }

        const resultUsers = await UserService.getUsers();
        setUsers(resultUsers.data);
        if (storedUserId !== null) {
          const resultNotifications =
            await NotificationService.getbyrepicientid(storedUserId);

          setNotification(resultNotifications.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [load, notification, latitude, longitude, storedUserId]);

  const calculateDistanceAndDeliveryTime = (
    lat1,
    lon1,
    lat2,
    lon2,
    speed = 30
  ) => {
    const distance = haversine(lat1, lon1, lat2, lon2);
    const deliveryTime = calculateDeliveryTime(distance, speed);
    return { distance, deliveryTime };
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const φ1 = toRadians(parseFloat(lat1));
    const φ2 = toRadians(parseFloat(lat2));
    const Δφ = toRadians(parseFloat(lat2 - lat1));
    const Δλ = toRadians(parseFloat(lon2 - lon1));

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const r = 6371;

    return r * c;
  };

  const calculateShippingFee = (distance) => {
    if (distance < 50) {
      return 10000 + distance * 200;
    } else if (distance < 200) {
      return 10000 + distance * 150;
    } else if (distance < 500) {
      return 10000 + distance * 100;
    } else if (distance < 1000) {
      return 10000 + distance * 80;
    } else {
      return 10000 + distance * 50;
    }
  };

  const calculateDistanceAndShippingFee = (lat1, lon1, lat2, lon2) => {
    const dist = haversine(lat1, lon1, lat2, lon2);
    const fee = calculateShippingFee(dist);
    return fee;
  };

  function calculateDeliveryTime(distance, speed) {
    const travelTime = distance / speed;
    const processingTime = 2;
    const totalDeliveryTime = processingTime + travelTime / 24;
    return Math.round(totalDeliveryTime);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const products = searchParams.getAll("itemId").map((itemId, index) => ({
      itemId,
      name: searchParams.getAll("name")[index],
      image: searchParams.getAll("image")[index],
      price: parseFloat(searchParams.getAll("price")[index]),
      count: parseInt(searchParams.getAll("count")[index]),
      latitude: parseFloat(searchParams.getAll("latitude")[index]),
      longitude: parseFloat(searchParams.getAll("longitude")[index]),
      storeName: searchParams.getAll("storeName")[index],
      ad_id: searchParams.getAll(`ad_id`)[index],
      selectedOptions: JSON.parse(
        searchParams.getAll("selectedOptions")[index]
      ),
    }));

    const productsByStoreObject = {};
    const totalPriceByStore = {};
    let totalShippingFee = 0;
    let shipping = [];
    let total = 0;
    const encounteredStores = new Set();

    products.forEach((product) => {
      if (!encounteredStores.has(product.storeName)) {
        encounteredStores.add(product.storeName);
        const shippingFee = calculateDistanceAndShippingFee(
          product.latitude,
          product.longitude,
          latitude,
          longitude
        );

        totalShippingFee += shippingFee;
        shipping.push(shippingFee);
      }

      if (!productsByStoreObject[product.storeName]) {
        productsByStoreObject[product.storeName] = [];
        totalPriceByStore[product.storeName] = 0;
      }
      productsByStoreObject[product.storeName].push(product);
      total += product.price * product.count;
      totalPriceByStore[product.storeName] += product.price * product.count;
    });

    setProductsByStore(productsByStoreObject);
    setTotalPriceAll(total);
    setTotalPrice(totalPriceByStore);
    setTotalShippingFee(totalShippingFee);
    setShippings(shipping);
  }, [location.search, latitude, longitude]);

  const [paymentMethod, setPaymentMethod] = useState("");

  const handleRadioChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const cartItems = useSelector((state) =>
    state.cart.items.filter((item) => item.userId === storedUserId)
  );

  const handleCheckout = async () => {
    try {
      if (!user) {
        alert("Bạn phải đăng nhập trước khi thực hiện thanh toán");
        navigate("/login");
        return;
      }

      if (!paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }

      const newOrder = {
        deliveryName: user.firstname + " " + user.lastname,
        deliveryEmail: user.email,
        deliveryPhone: phone,
        deliveryAddress: address,
        note,
        user_id: user.id,
        total: totalPriceAll + totalShippingFee,
        status: 0,
      };

      const responseOrder = await OrderService.storeorder(newOrder);
      const orderId = responseOrder.data.id;

      if (paymentMethod === "Cod") {
        const transactionData = {
          order_id: orderId,
          payment_method: "Cod",
          amount: totalPriceAll + totalShippingFee,
        };
        await TransactionService.storeTransaction(transactionData);
        navigate("/cart");
      } else if (paymentMethod === "Paypal") {
        navigate("/pay", {
          state: { totalAmount: totalPriceAll, orderId: orderId },
        });
      }

      const orderDetailsArray = [];
      for (const storeName in productsByStore) {
        productsByStore[storeName].forEach((product) => {
          const attributeValues = Object.values(product.selectedOptions);
          const attributeString = attributeValues.some(
            (value) => value === null
          )
            ? attributeValues.filter((value) => value !== null).join(",")
            : attributeValues.join(",");

          orderDetailsArray.push({
            orderId: orderId,
            productId: product.itemId,
            qty: product.count,
            amount: product.count * product.price,
            price: product.price,
            note: product.ad_id !== "undefined" ? "AD" : "",
            status: 0,
            attribute: attributeString,
          });
        });
      }

      const sellerIds = [];
      console.log("o", orderDetailsArray);
      for (let i = 0; i < orderDetailsArray.length; i++) {
        const orderDetail = orderDetailsArray[i];
        try {
          const resultOrderDetail = await OrderService.storeorderdetail(
            orderDetail
          );
          const searchParams = new URLSearchParams(location.search);
          const itemIdList = searchParams.getAll("itemId");
          const urlSelectedOptionsList = searchParams.getAll("selectedOptions");
          // Chuyển đổi các selectedOptions từ dạng chuỗi JSON sang đối tượng JavaScript
          const urlSelectedOptionsObjects = urlSelectedOptionsList.map(
            (option) => JSON.parse(option)
          );
          console.log("i", itemIdList, urlSelectedOptionsObjects);
          dispatch(
            removeFromCart({
              id: parseInt(itemIdList[i]),
              userId: parseInt(storedUserId),
              selectedOptions: urlSelectedOptionsObjects[i],
            })
          );
          const sl = resultOrderDetail.data.qty;
          for (let j = 0; j < sl; j++) {
            const addScore = new FormData();
            addScore.append("product_id", resultOrderDetail.data.productId);
            addScore.append("score", 10);
            await ProductService.addscore(addScore);
          }

          const shippingCost = shippings[i];
          const shippingObject = {
            order_id: resultOrderDetail.data.id,
            customer_id: user.id,
            shipping_address: address,
            shipping_method: "cod",
            shipping_cost: shippingCost,
            status: 0,
          };
          const resultShipping = await ShippingService.addShip(shippingObject);
          console.log(resultShipping);

          const productOrderDetail = await ProductService.getById(
            resultOrderDetail.data.productId
          );
          await ProductService.reduceStock(
            orderDetail.productId,
            orderDetail.qty
          );
          const sellerId = productOrderDetail.data.seller_id;

          if (!sellerIds.includes(sellerId)) {
            sellerIds.push(sellerId);
          }
          const addNotification = new FormData();
          addNotification.append(
            "content",
            `Bạn vừa thêm một đơn hàng mới, mã đơn hàng là ${resultOrderDetail.data.id}. Nhấn để xem chi tiết `
          );
          addNotification.append("title", `Thêm đơn hàng mới thành công`);
          addNotification.append("recipient_id", storedUserId);
          addNotification.append("status", 1);
          addNotification.append(
            "link",
            `/orderdetail/${resultOrderDetail.data.id}`
          );
          addNotification.append("role", `customer`);
          setLoad(Date.now());

          const resultNotification = await NotificationService.addNotification(
            addNotification
          );
          console.log(
            `Notification sent to user ${storedUserId}`,
            resultNotification
          );
        } catch (error) {
          console.error(`Lỗi khi xử lý chi tiết đơn hàng ${i}:`, error);
          alert(`Lỗi khi xử lý chi tiết đơn hàng ${i}: ${error.message}`);
          return;
        }
      }

      for (const sellerid of sellerIds) {
        const addNotification = new FormData();
        addNotification.append(
          "content",
          `${
            sellerid ? users.find((user) => user.id === sellerid)?.username : ""
          } ơi, chúc mừng bạn có thêm 1 đơn hàng mới, xác nhận NGAY `
        );
        addNotification.append("title", `Bạn có 1 đơn hàng mới`);
        addNotification.append("recipient_id", sellerid);
        addNotification.append("status", 1);
        addNotification.append(
          "link",
          `/seller/orderseller/orderdetail/${orderId}`
        );
        addNotification.append("role", `seller`);
        setLoad(Date.now());

        const resultNotification = await NotificationService.addNotification(
          addNotification
        );
      }

      toast.success("Thêm thành công");
      setNote("");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div role="main" className="HYmUPs">
        <div className="m6A2B1">
          <div className="hYgtuo">
            <div className="SvK9MH">
              <div className="IZawzb">
                <div className="qclVa9">
                  <svg
                    height={16}
                    viewBox="0 0 12 16"
                    width={12}
                    className="shopee-svg-icon icon-location-marker"
                  >
                    <path
                      d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2>Địa chỉ nhận hàng</h2>

                <div></div>
              </div>
            </div>

            <div className="i1xLmh">
              <div>
                <div className="y0jyrJ">
                  <div className="PzGLCh">
                    {firstName + " " + lastname} <br></br>
                    {phone}
                  </div>
                  <div className="a9c4OR">{address}</div>
                  <div className="dIzOca">Mặc định</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="UWJJw6">
          <div className="kvWjhK">
            <div className="iSSCtq">
              <div className="k7UefF l0wK0t">
                <h2 className="zgWBzz">Sản phẩm</h2>
              </div>
              <div className="k7UefF zQOVG9"></div>
              <div className="k7UefF">Đơn giá</div>
              <div className="k7UefF">Số lượng</div>
              <div className="k7UefF J2gurn">Thành tiền</div>
            </div>
          </div>
          <div>
            {Object.keys(productsByStore).map((storeName) => (
              <div className="QroV_K">
                <div>
                  <div className="A3VoHf">
                    <div className="v1pNKv">
                      <div>
                        <div className="Koi0Pw">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={70}
                            height={16}
                            fill="none"
                          >
                            <title>Preferred Seller Plus</title>
                            <path
                              fill="#EE4D2D"
                              fillRule="evenodd"
                              d="M0 2C0 .9.9 0 2 0h66a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2z"
                              clipRule="evenodd"
                            />
                            <g clipPath="url(#clip0)">
                              <path
                                fill="#fff"
                                d="M8.7 13H7V8.7L5.6 6.3A828.9 828.9 0 004 4h2l2 3.3a1197.3 1197.3 0 002-3.3h1.6L8.7 8.7V13zm7.9-1.7h1.7c0 .3-.2.6-.5 1-.2.3-.5.5-1 .7l-.6.2h-.8c-.5 0-1 0-1.5-.2l-1-.8a4 4 0 01-.9-2.4c0-1 .3-1.9 1-2.6a3 3 0 012.4-1l.8.1a2.8 2.8 0 011.3.7l.4.6.3.8V10h-4.6l.2 1 .4.7.6.5.7.1c.4 0 .7 0 .9-.2l.2-.6v-.1zm0-2.3l-.1-1-.3-.3c0-.2-.1-.2-.2-.3l-.8-.2c-.3 0-.6.2-.9.5l-.3.5a4 4 0 00-.3.8h3zm-1.4-4.2l-.7.7h-1.4l1.5-2h1.1l1.5 2h-1.4l-.6-.7zm8.1 1.6H25V13h-1.7v-.5.1H23l-.7.5-.9.1-1-.1-.7-.4c-.3-.2-.4-.5-.6-.8l-.2-1.3V6.4h1.7v3.7c0 1 0 1.6.3 1.7.2.2.5.3.7.3h.4l.4-.2.3-.3.3-.5.2-1.4V6.4zM34.7 13a11.2 11.2 0 01-1.5.2 3.4 3.4 0 01-1.3-.2 2 2 0 01-.5-.3l-.3-.5-.2-.6V7.4h-1.2v-1h1.1V5h1.7v1.5h1.9v1h-2v3l.2 1.2.1.3.2.2h.3l.2.1c.2 0 .6 0 1.3-.3v1zm2.4 0h-1.7V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.4.4.2.7V13h-1.6V9.3 8.1l-.4-.6-.6-.2a1 1 0 00-.4.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.1.5-.1.9V13zm5.4-6.6H44V13h-1.6V6.4zm-.8-.9l1.8-2h1.8l-2.1 2h-1.5zm7.7 5.8H51v.5l-.4.5a2 2 0 01-.4.4l-.6.3-1.4.2c-.5 0-1 0-1.4-.2l-1-.7c-.3-.3-.5-.7-.6-1.2-.2-.4-.3-.9-.3-1.4 0-.5.1-1 .3-1.4a2.6 2.6 0 011.6-1.8c.4-.2.9-.3 1.4-.3.6 0 1 .1 1.5.3.4.1.7.4 1 .6l.2.5.1.5h-1.6c0-.3-.1-.5-.3-.6-.2-.2-.4-.3-.8-.3s-.8.2-1.2.6c-.3.4-.4 1-.4 2 0 .9.1 1.5.4 1.8.4.4.8.6 1.2.6h.5l.3-.2.2-.3v-.4zm4 1.7h-1.6V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.3.4.3.7V13h-1.6V9.3L56 8.1c-.1-.3-.2-.5-.4-.6l-.6-.2a1 1 0 00-.3.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.2.5V13z"
                              />
                            </g>
                            <g clipPath="url(#clip1)">
                              <path
                                fill="#fff"
                                d="M63 8.2h2.2v1.6H63V12h-1.6V9.8h-2.2V8.2h2.2V6H63v2.3z"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0">
                                <path
                                  fill="#fff"
                                  d="M0 0h55v16H0z"
                                  transform="translate(4)"
                                />
                              </clipPath>
                              <clipPath id="clip1">
                                <path
                                  fill="#fff"
                                  d="M0 0h7v16H0z"
                                  transform="translate(59)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>

                      <h3 className="_eH_h0">{storeName}</h3>
                      <button className="HVdc45 div-style">
                        <svg
                          viewBox="0 0 16 16"
                          className="shopee-svg-icon FpgzUK"
                        >
                          <g fillRule="evenodd">
                            <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path>
                          </g>
                        </svg>
                        Chat ngay
                      </button>
                    </div>
                    <div className="_MbENL">
                      {productsByStore[storeName].map((product) => (
                        <div className="CZ00qG anolYl uSsvPo">
                          <div className="FisIRS ysaw0G">
                            <img
                              className="Yzo0tI"
                              alt=""
                              src={urlImage + "product/" + product.image}
                              width={40}
                              height={40}
                            />
                            <span className="dUcW_h">
                              <span className="TvB7XR">{product.name}</span>
                              <div className="uzZsfB">
                                <span className="GUZrD9 qqJlN8">
                                  Đổi ý miễn phí 15 ngày
                                </span>
                              </div>
                            </span>
                          </div>
                          <div className="FisIRS ri4hV6">
                            <span className="Ev9jhR">
                              Loại:{" "}
                              {product.selectedOptions.attribute2 &&
                              product.selectedOptions.attribute1
                                ? `${product.selectedOptions.attribute2},${product.selectedOptions.attribute1}`
                                : product.selectedOptions.attribute2 ||
                                  product.selectedOptions.attribute1}
                            </span>
                          </div>
                          <div className="FisIRS">
                            {currency(product.price, {
                              separator: ".",
                              decimal: ",",
                              symbol: "",
                            }).format()}
                            ₫
                          </div>
                          <div className="FisIRS">{product.count}</div>
                          <div className="FisIRS BeMjeR">
                            {currency(product.price * product.count, {
                              separator: ".",
                              decimal: ",",
                              symbol: "",
                            }).format()}
                            ₫
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pkby_W">
                  <div className="vhebLm">
                    <div className="ilUPM5 gYGNQa">
                      <div className="_rHKrD">
                        <span>Lời nhắn:</span>
                        <div className="kkopFm">
                          <div className="LRc198 hz4qtM">
                            <div className="MfTgoF OVU6kl">
                              <input
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="yzB0Sq"
                                type="text"
                                placeholder="Lưu ý cho Người bán..."
                                aria-label="Lời nhắn:"
                              />
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ilUPM5 a7GtMg">
                      <div className="M1mHTq">
                        <div className="i4v4xh jWOOGK">Được đồng kiểm.</div>
                        <svg
                          enableBackground="new 0 0 15 15"
                          viewBox="0 0 15 15"
                          x={0}
                          y={0}
                          className="shopee-svg-icon YS5UZJ icon-help"
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
                    <div className="qQ6AUX VGGCTl  mt-4 me-4">
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/41fe56ab756fc3082a08.svg"
                        alt="img"
                      />
                      {`Thời gian giao hàng dự kiến khoảng: ${
                        calculateDistanceAndDeliveryTime(
                          productsByStore[storeName][0].latitude,
                          productsByStore[storeName][0].longitude,
                          latitude,
                          longitude
                        ).deliveryTime
                      } - ${
                        calculateDistanceAndDeliveryTime(
                          productsByStore[storeName][0].latitude,
                          productsByStore[storeName][0].longitude,
                          latitude,
                          longitude
                        ).deliveryTime + 2
                      } ngày`}
                    </div>
                  </div>
                  <div className="vhebLm"></div>
                </div>
                <div className="IyTouc">
                  <div className="TSU9pp">
                    <h3 className="o13Lc4 hERTPn ZAZB4U">
                      <div>
                        Phí vận chuyển ({productsByStore[storeName].length} sản
                        phẩm):
                      </div>
                    </h3>
                    <div className="o13Lc4 X9R_0O ZAZB4U pAqjyR sJTpuC">
                      {" "}
                      {currency(
                        parseInt(
                          calculateDistanceAndShippingFee(
                            productsByStore[storeName][0].latitude,
                            productsByStore[storeName][0].longitude,
                            latitude,
                            longitude
                          )
                        ),
                        {
                          separator: ".",
                          decimal: ",",
                          symbol: "",
                        }
                      ).format()}
                      ₫
                    </div>
                  </div>
                  <div className="TSU9pp">
                    <h3 className="o13Lc4 hERTPn ZAZB4U">
                      <div>
                        Tổng số tiền ({productsByStore[storeName].length} sản
                        phẩm):
                      </div>
                    </h3>
                    <div className="o13Lc4 X9R_0O ZAZB4U pAqjyR sJTpuC">
                      {currency(totalPrice[storeName], {
                        separator: ".",
                        decimal: ",",
                        symbol: "",
                      }).format()}
                      ₫
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="N02iLl">
          <div className="aSiS8B">
            <h2 className="a11y-visually-hidden">Phương thức thanh toán</h2>
            <div style={{ display: "contents" }}>
              <div>
                <div className="checkout-payment-method-view__current checkout-payment-setting">
                  <div className="checkout-payment-method-view__current-title">
                    Phương thức thanh toán
                  </div>
                </div>
                <div className="checkout-payment-setting__payment-method-options">
                  <div className="bank-transfer-category">
                    <div className="bank-transfer-category__body">
                      <div className="checkout-bank-transfer-item">
                        <div
                          className="stardust-radio"
                          tabIndex={0}
                          role="radio"
                          aria-checked="false"
                        >
                          <div className="stardust-radio__content">
                            <div className="stardust-radio__label">
                              <div className="checkout-bank-transfer-item">
                                <div
                                  className="stardust-radio"
                                  tabIndex={0}
                                  role="radio"
                                  aria-checked="false"
                                >
                                  <div className="stardust-radio-button">
                                    <input
                                      value="Paypal"
                                      onChange={handleRadioChange}
                                      type="radio"
                                      id="radio1"
                                      name="color"
                                      className="color-radio"
                                    />
                                  </div>

                                  <div className="stardust-radio__content">
                                    <div className="stardust-radio__label">
                                      <div className="checkout-bank-transfer-item__card">
                                        <div className="checkout-bank-transfer-item__icon-container">
                                          <img
                                            src={require("../../Images/226456.webp")}
                                            className="checkout-bank-transfer-item__icon"
                                          />
                                        </div>
                                        <div className="checkout-bank-transfer-item__main">
                                          <div className="checkout-bank-transfer-item__title">
                                            PayPal
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="checkout-bank-transfer-item">
                        <div
                          className="stardust-radio"
                          tabIndex={0}
                          role="radio"
                          aria-checked="false"
                        >
                          <div className="stardust-radio__content">
                            <div className="stardust-radio__label">
                              <div className="checkout-bank-transfer-item">
                                <div
                                  className="stardust-radio"
                                  tabIndex={0}
                                  role="radio"
                                  aria-checked="false"
                                >
                                  <div className="stardust-radio-button">
                                    <input
                                      value="Cod"
                                      onChange={handleRadioChange}
                                      type="radio"
                                      id="radio2"
                                      name="color"
                                      className="color-radio"
                                    />
                                  </div>
                                  <div className="stardust-radio__content">
                                    <div className="stardust-radio__label">
                                      <div className="checkout-bank-transfer-item__main">
                                        <div className="checkout-bank-transfer-item__title">
                                          Thanh toán khi nhận hàng
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="yHG0SE" aria-live="polite">
            <h2 className="a11y-visually-hidden">Tổng thanh toán</h2>
            <h3 className="o13Lc4 hERTPn cFXdGN">Tổng tiền hàng</h3>
            <div className="o13Lc4 X9R_0O cFXdGN">
              {currency(totalPriceAll, {
                symbol: "",
                separator: ".",
                decimal: ",",
              }).format()}
              ₫
            </div>
            <h3 className="o13Lc4 hERTPn fwPZIN">Phí vận chuyển</h3>
            <div className="o13Lc4 X9R_0O fwPZIN">
              {" "}
              {currency(totalShippingFee, {
                symbol: "",
                separator: ".",
                decimal: ",",
              }).format()}
              ₫
            </div>
            <h3 className="o13Lc4 hERTPn cNgneA">Tổng thanh toán</h3>
            <div className="o13Lc4 fYeyE4 X9R_0O cNgneA">
              {currency(totalPriceAll + totalShippingFee, {
                symbol: "",
                separator: ".",
                decimal: ",",
              }).format()}
              ₫
            </div>
            <div className="s7CqeD">
              <div className="sQArKu">
                <div className="xINqui">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
                  <a
                    href="https://help.shopee.vn/portal/article/77242"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    &ensp;Điều khoản Stressmama
                  </a>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleCheckout}
                className="stardust-button stardust-button--primary stardust-button--large LtH6tW"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
