import { Outlet, Link, useNavigate } from "react-router-dom";

import { FaRegCircle, FaStore } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { IoIosArrowDown, IoIosNotifications } from "react-icons/io";
import { FaProductHunt } from "react-icons/fa6";
import "../../CSS/channelseller.css";
import { useEffect, useState } from "react";
import CustomerService from "../../service/CustomerService";
import ContactService from "../../service/ContactService";
import { urlImage } from "../../config";
import { CiShoppingTag, CiWallet } from "react-icons/ci";
import NotificationService from "../../service/NotificationService";

const ChannelSeller = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  const [idmess, setIdMess] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState([]);
  const [nameBuyer, setNameBuyer] = useState("");
  const [idNew, setIdNew] = useState("");
  const [contactReceivers, setContactReceivers] = useState([]);
  const [message_text, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [contactSellers, setContactSellers] = useState([]);

  useEffect(() => {
    (async () => {
      if (sellerId !== null) {
        const resultUser = await CustomerService.getbyid(parseInt(sellerId));
        setUser(resultUser.data);
      }
    })();
  }, [sellerId]);

  useEffect(() => {
    (async () => {
      const resultUsers = await CustomerService.getall();
      setUsers(resultUsers.data);
    })();
  }, [load]);

  useEffect(() => {
    (async () => {
      if (sellerId !== null) {
        const resultNotifications = await NotificationService.getbyrepicientid(
          sellerId
        );
        const noti = resultNotifications.data.filter(
          (notification) => notification.role === "seller"
        );
        const sortedNotis = noti.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotification(sortedNotis);
      }
    })();
  }, [sellerId, notification]);

  useEffect(() => {
    (async () => {
      if (sellerId !== null) {
        const resultContactReceivers = await ContactService.getContactReceiver(
          sellerId
        );
        setContactReceivers(combinedSortFunction(resultContactReceivers.data));
      }
    })();
  }, [sellerId, combinedSortFunction]);

  useEffect(() => {
    (async () => {
      if (sellerId !== null) {
        const resultContactSellers =
          await ContactService.getContactsWithSellerId(sellerId);
        setContactSellers(resultContactSellers.data);
      }
    })();
  }, [sellerId]);

  function handleItemClick(item) {
    const hdlitem = document.getElementById(item);
  }

  function sortArrayByCreatedAt(contactReceiver) {
    contactReceiver.forEach((arr) => {
      arr.sort((a, b) => {
        // Chuyển đổi thời gian sang đối tượng Date
        let dateA = new Date(a.created_at);
        let dateB = new Date(b.created_at);
        // So sánh thời gian
        return dateB - dateA; // Sắp xếp giảm dần để phần tử mới nhất lên đầu
      });
    });

    return contactReceiver; // Trả về mảng đã sắp xếp
  }

  function sortByLatestCreatedAt(arrays) {
    arrays.sort((a, b) => {
      // Lấy thời gian của phần tử đầu tiên của mỗi mảng con
      let dateA = new Date(a[0].created_at);
      let dateB = new Date(b[0].created_at);
      // So sánh thời gian
      return dateB - dateA; // Sắp xếp giảm dần để phần tử mới nhất lên đầu
    });
  }

  function combinedSortFunction(contactReceiver) {
    // Sắp xếp mỗi mảng con trong contactReceiver dựa trên sender_created_at
    sortArrayByCreatedAt(contactReceiver);
    // Sắp xếp contactReceiver dựa trên sender_created_at của phần tử đầu tiên của mỗi mảng con
    sortByLatestCreatedAt(contactReceiver);
    // Trả về mảng đã được sắp xếp
    return contactReceiver;
  }

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    window.location.reload();
  };
  // Lấy ra tin nhắn mới nhất
  const NewMessage = (buyer_id) => {
    // Lọc danh sách tin nhắn từ contactSellers có sender_id trùng với tham số truyền vào
    const filteredMessages = contactSellers.filter(
      (message) => message.buyer_id === buyer_id
    );

    // Sắp xếp danh sách tin nhắn đã lọc theo created_at (thời gian tạo) giảm dần
    filteredMessages.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    // Trả về tin nhắn mới nhất
    return filteredMessages[0].message_text;
  };
  //  Click vào để xem tin nhắn giữa 2 người
  const HandleChat = async (buyerId, contact) => {
    try {
      const allUsersPromises = contact.map(async (cont) => {
        if (cont.status === 1) {
          const resultUsers = await ContactService.updatestatus(
            cont.contact_id
          );
          return resultUsers.data;
        } else {
          return cont; // Nếu không cập nhật, trả về cont ban đầu
        }
      });

      // Chờ cho tất cả các promise hoàn thành
      await Promise.all(allUsersPromises);

      setIdMess(buyerId);
      const getContacts = contactSellers.filter(
        (message) => message.buyer_id === buyerId
      );

      // Sắp xếp danh sách tin nhắn đã lọc theo created_at (thời gian tạo) giảm dần
      getContacts.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setNameBuyer(getContacts[0].sender_username);
      setMessages(getContacts);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const handleSentMess = async (event) => {
    event.preventDefault();
    var contentMessageText = new FormData();
    contentMessageText.append("messageText", message_text);
    contentMessageText.append("buyer_id", idmess);
    contentMessageText.append("seller_id", user.id);
    contentMessageText.append("sender_id", user.id);
    contentMessageText.append("receiver_id", idmess);
    contentMessageText.append("status", 1);

    try {
      // Gửi tin nhắn và chờ kết quả
      const resultShopProfile = await ContactService.sentmess(
        contentMessageText
      );

      if (resultShopProfile.status === 201) {
        // Tin nhắn đã được gửi thành công
        // Thêm tin nhắn mới vào danh sách tin nhắn hiện có
        setIdNew(resultShopProfile.data.id);
        const newMessage = {
          id: resultShopProfile.data.id,
          message_text: message_text,
          sender_id: user.id,
          receiver_id: resultShopProfile.data.receiverId,
          created_at: new Date().toISOString(),
        };
        setMessages([...messages, newMessage]);

        // Xóa nội dung của tin nhắn sau khi gửi thành công
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  function formatDateTime(dateTimeString) {
    // Tạo một đối tượng Date từ chuỗi đầu vào
    let date = new Date(dateTimeString);

    // Lấy thông tin về ngày, tháng, năm, giờ và phút
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    // Chuyển đổi giờ sang định dạng 12 giờ
    let amPm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    // Định dạng các giá trị về dạng chuỗi
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;

    // Trả về chuỗi đã định dạng
    return `${day}/${month}/${year}, ${hour}:${minute} ${amPm}`;
  }
  const changeStatus = async (id, status) => {
    try {
      // Kiểm tra nếu status bằng 1 thì mới thay đổi trạng thái
      if (status === 1) {
        const result = await NotificationService.changeStatus(id);
        // Nếu đang tìm kiếm, cập nhật lại dữ liệu tìm kiếm
        if (result.status === 200) {
          setLoad(Date.now());
        }
      } else {
        console.log("Status is not 1, no changes made.");
      }
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái:", error);

      if (error.response) {
        console.error("Thông báo lỗi từ máy chủ:", error.response.data.message);
      }
    }
  };

  return (
    <>
      <section className="hdl-headerr sticky-top">
        <div className="container-fluid">
          <ul className="menutopp">
            <li>
              <div
                className="header__logo hide-on-mobile-tablet"
                style={{ marginTop: -10, marginLeft: -20, width: 400 }}
              >
                <Link to="./" className="header__logo-link">
                  <Link to="./" className="header__logo-link">
                    <img
                      alt=""
                      style={{ height: 40, marginTop: 20 }}
                      className="ms-4 header__logo-imgg shopee-svg-icon header-with-search__shopee-logo icon-shopee-logo"
                      src={require("../../Images/z5322895712367_be8e0d096bb3535a08b2f0eb8b5433d6.jpg")}
                    />
                  </Link>
                </Link>
              </div>
              <Link
                to=""
                style={{
                  color: "#1d1d1d",
                  marginLeft: 241,
                  fontSize: 22,
                  fontWeight: 400,
                }}
              >
                Kênh Người Bán
              </Link>
            </li>
            <li className="text-phaii">
              <Link>
                <div className="col-md-3">
                  <div
                    className="accordion accordion-flush"
                    id="accordionExample"
                    style={{
                      marginRight: "-12px",
                      border: "none",
                      margin: "auto",
                      width: "240.66px",
                    }}
                  >
                    <div className="accordion-item">
                      <h5 className="accordion-header">
                        <button
                          className="accordion-button"
                          style={{
                            outline: "none",
                            boxShadow: "none",
                            border: "none",
                            backgroundColor: "#ffffff",
                            fontSize: 14,
                          }}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <img
                            style={{ width: 35, height: 35 }}
                            className="rounded-circle"
                            src={urlImage + "user/" + user.image}
                            alt="product.jpg"
                          />
                          <span className="ms-2">{user.username}</span>
                        </button>
                      </h5>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                        style={{ width: 200 }}
                      >
                        <div className="accordion-body">
                          <div className="d-flex justify-content-center flex-column">
                            <div class="p-2">
                              <img
                                style={{ width: 70, height: 70 }}
                                className="rounded-circle"
                                src={urlImage + "user/" + user.image}
                                alt="product.jpg"
                              />
                            </div>
                            <div class="p-2">
                              {" "}
                              <p className="mt-2">{user.username}</p>
                              <p className="mt-2">
                                <Link to="/seller/shop/shopprofile">
                                  <FaStore />
                                  <span className="ms-2">Hồ Sơ Shop</span>
                                </Link>
                              </p>
                            </div>
                          </div>
                          <hr style={{ width: 200 }} />
                          <div>
                            <button
                              type="button"
                              style={{
                                fontSize: 13,
                                borderRadius: 0,
                                width: "240.66px",
                                marginLeft: "-20px",
                              }}
                              className="btn btn-light small"
                              onClick={handleLogout}
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li className="text-phaii me-5">
              <div class="dropdown mt-3">
                <button
                  class="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <IoIosNotifications />{" "}
                  <span class="badge text-bg-danger">
                    {notification.filter((noti) => noti.status === 1).length ===
                    0
                      ? ""
                      : notification.filter((noti) => noti.status === 1).length}
                  </span>
                </button>
                <ul class="dropdown-menu">
                  {notification &&
                    notification.map((noti) => (
                      <li
                        key={noti.id} // Thêm khóa duy nhất cho mỗi phần tử danh sách
                        style={{ width: 300, height: 60 }}
                        className={`border-bottom ${
                          noti.status === 1 ? "bg-body-secondary" : ""
                        }`}
                      >
                        <Link
                          onClick={() => changeStatus(noti.id, noti.status)}
                          className=""
                          to={noti.link}
                        >
                          <b>{noti.title}</b>
                          <br />
                          <span title={noti.content}>
                            {noti.content.length > 35
                              ? noti.content.substring(0, 35) + "..."
                              : noti.content}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="hdl-contentt">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-md-2  p-0 hdl-leftt"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <div className="hdl-leftt">
                <nav
                  className="m-2 mainmenuu"
                  style={{ maxWidth: 500, height: 900 }}
                >
                  <ul className="main">
                    <li
                      className="hdlitemm item-subb active"
                      id="item1"
                      onClick={() => handleItemClick("item1")}
                    >
                      <FaProductHunt
                        className="icon-left"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />

                      <Link
                        class="management ms-2 disable-link"
                        to={"/seller/productseller/" + user.id}
                      >
                        {" "}
                        Sản Phẩm
                      </Link>

                      <IoIosArrowDown
                        className="icon-right"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <ul className="submenuu ms-2">
                        <li style={{ marginTop: -5 }}>
                          <Link to={"/seller/productseller/" + user.id}>
                            Tất Cả Sản Phẩm
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/product/create">Thêm Sản Phẩm</Link>
                        </li>

                        <li>
                          <Link to="/seller/productseller/productactive">
                            Sản Phẩm Đang Hoạt Động
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/productseller/productoutstock">
                            Sản Phẩm Hết Hàng
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/productseller/productwaitting">
                            Sản Phẩm Chờ Duyệt
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/productseller/productviolate">
                            Sản Phẩm Vi Phạm
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/productseller/producthidden">
                            Sản Phẩm Đã Ẩn
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="hdlitemm item-subb mt-3 active"
                      id="item2"
                      onClick={() => handleItemClick("item2")}
                    >
                      <CiWallet
                        className="icon-left"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <Link
                        class="management ms-2"
                        to={"/seller/orderseller/" + user.id}
                      >
                        Quản Lý Đơn Hàng
                      </Link>

                      <IoIosArrowDown
                        className="icon-right"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <ul className="submenuu ms-2">
                        <li style={{ marginTop: -5 }}>
                          <Link to={"/seller/orderseller/" + user.id}>
                            Tất Cả Đơn Hàng
                          </Link>
                        </li>
                        <li>
                          <Link to={"/seller/orderseller/cancel/" + user.id}>
                            Đơn Hủy
                          </Link>
                        </li>
                        <li>
                          <Link to={"/seller/orderseller/return/" + user.id}>
                            Trả Hàng
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="hdlitemm item-subb mt-3 active"
                      id="item3"
                      onClick={() => handleItemClick("item3")}
                    >
                      <CiShoppingTag
                        className="icon-left"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <Link
                        class="management ms-2"
                        to="/seller/marketing/advertisement"
                      >
                        Kênh Marketing
                      </Link>
                      <IoIosArrowDown
                        className="icon-right"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <ul className="submenuu ms-2">
                        <li style={{ marginTop: -5 }}>
                          <Link to="/seller/marketing/advertisement">
                            Quảng Cáo Stressmama
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/marketing/sale">
                            Khuyến Mãi Của Shop
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/marketing/flashsale">
                            Flash Sale Của Shop
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className="hdlitemm item-subb mt-3 active"
                      id="item5"
                      onClick={() => handleItemClick("item5")}
                    >
                      <FaStore className="icon-left" />
                      <Link
                        class="management ms-2"
                        to="/seller/shop/shopprofile"
                      >
                        Quản Lý Shop
                      </Link>
                      <IoIosArrowDown
                        className="icon-right"
                        style={{ color: "#bababa", fontSize: 18 }}
                      />
                      <ul className="submenuu ms-2">
                        <li style={{ marginTop: -5 }}>
                          <Link to="/seller/shop/shopprofile">Hồ Sơ Shop</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="col-md-10">
              <div
                className="content"
                style={{
                  marginLeft: 0,
                  padding: 20,
                  backgroundColor: "white",
                  minHeight: 1700,
                }}
              >
                <Outlet />
              </div>
            </div>
            {/* Phần nhắn tin */}
            <div>
              <p>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseWidthExample"
                  aria-expanded="false"
                  aria-controls="collapseWidthExample"
                  style={{
                    position: "fixed",
                    zIndex: 99999,
                    right: 16,
                    bottom: 16,
                  }}
                >
                  <div className="bGX0VV9OFp nAERRUqs_I m_VOzMbX6j WNMV40w0DY">
                    <div className="r2v9ozyahe">
                      <div className="v_6qeRY1jW">
                        {
                          contactReceivers.filter(
                            (contact) =>
                              contact[0].seller_id === contact[0].receiver_id
                          ).length
                        }
                      </div>
                      <i className="GHUxSkxNuJ m3Mb2Tqdlw">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          className="chat-icon"
                        >
                          <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
                        </svg>
                      </i>
                      <i className="GHUxSkxNuJ HiSJ3Vx2WM">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 44 22"
                          className="chat-icon"
                        >
                          <path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path>
                        </svg>
                      </i>
                    </div>
                    <div className="lCHLPQcY1b">
                      <i className="GHUxSkxNuJ P_7D65k6v8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          className="chat-icon"
                        >
                          <path d="M13 2a1 1 0 011 1v10a1 1 0 01-1 1H9v-1h4V3H3v4H2V3a1 1 0 011-1h10z"></path>
                          <path d="M2.28 13.652a.5.5 0 00.707 0l3.121-3.122v1.793a.5.5 0 001 0v-3a.5.5 0 00-.41-.492l-.09-.008h-3a.5.5 0 000 1h1.793l-3.12 3.122a.5.5 0 000 .707z"></path>
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
              </p>
              <div>
                <div
                  className="collapse collapse-horizontal"
                  id="collapseWidthExample"
                >
                  <div
                    id="shopee-mini-chat-embedded"
                    style={{
                      position: "fixed",
                      zIndex: 99999,
                      right: 16,
                      bottom: 16,
                    }}
                  >
                    <div className="UvGSSkd1qQ" style={{ borderRadius: 4 }}>
                      <div className="PBqe51NF33">
                        <div className="Ffl5D3J1YM">
                          <i className="GHUxSkxNuJ tH3c0fxDcu">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 44 22"
                              className="chat-icon"
                            >
                              <path d="M9.286 6.001c1.161 0 2.276.365 3.164 1.033.092.064.137.107.252.194.09.085.158.064.203 0 .046-.043.182-.194.251-.26.182-.17.433-.43.752-.752a.445.445 0 00.159-.323c0-.172-.092-.3-.227-.365A7.517 7.517 0 009.286 4C5.278 4 2 7.077 2 10.885s3.256 6.885 7.286 6.885a7.49 7.49 0 004.508-1.484l.022-.043a.411.411 0 00.046-.71v-.022a25.083 25.083 0 00-.957-.946.156.156 0 00-.227 0c-.933.796-2.117 1.205-3.392 1.205-2.846 0-5.169-2.196-5.169-4.885C4.117 8.195 6.417 6 9.286 6zm32.27 9.998h-.736c-.69 0-1.247-.54-1.247-1.209v-3.715h1.96a.44.44 0 00.445-.433V9.347h-2.45V7.035c-.021-.043-.066-.065-.111-.043l-1.603.583a.423.423 0 00-.29.41v1.362h-1.781v1.295c0 .238.2.433.445.433h1.337v4.19c0 1.382 1.158 2.505 2.583 2.505H42v-1.339a.44.44 0 00-.445-.432zm-21.901-6.62c-.739 0-1.41.172-2.013.496V4.43a.44.44 0 00-.446-.43h-1.788v13.77h2.234v-4.303c0-1.076.895-1.936 2.013-1.936 1.117 0 2.01.86 2.01 1.936v4.239h2.234v-4.561l-.021-.043c-.202-2.088-2.012-3.723-4.223-3.723zm10.054 6.785c-1.475 0-2.681-1.12-2.681-2.525 0-1.383 1.206-2.524 2.681-2.524 1.476 0 2.682 1.12 2.682 2.524 0 1.405-1.206 2.525-2.682 2.525zm2.884-6.224v.603a4.786 4.786 0 00-2.985-1.035c-2.533 0-4.591 1.897-4.591 4.246 0 2.35 2.058 4.246 4.59 4.246 1.131 0 2.194-.388 2.986-1.035v.604c0 .237.203.431.453.431h1.356V9.508h-1.356c-.25 0-.453.173-.453.432z"></path>
                            </svg>
                          </i>
                          <div className="t0DSoDjLOv">
                            <i className="GHUxSkxNuJ GQqiEMsjau">
                              <svg
                                viewBox="0 0 3 12"
                                xmlns="http://www.w3.org/2000/svg"
                                className="chat-icon"
                              >
                                <path d="M2.788 12L3 11.383c-.514-.443-.959-1.113-1.335-2.013-.376-.9-.564-2.01-.564-3.333v-.074c0-1.323.189-2.434.567-3.333.378-.9.822-1.553 1.332-1.961L2.788.006 2.754 0C2.102.354 1.48 1.063.888 2.127.296 3.19 0 4.473 0 5.974v.052c0 1.505.296 2.789.888 3.85.592 1.062 1.214 1.77 1.866 2.124h.034z"></path>
                              </svg>
                            </i>
                            {
                              contactReceivers.filter(
                                (contact) =>
                                  contact[0].seller_id ===
                                  contact[0].receiver_id
                              ).length
                            }
                            <i className="GHUxSkxNuJ sCTuxhWsM6">
                              <svg
                                viewBox="0 0 3 12"
                                xmlns="http://www.w3.org/2000/svg"
                                className="chat-icon"
                              >
                                <path d="M.246 12c.648-.354 1.269-1.062 1.863-2.124C2.703 8.815 3 7.531 3 6.026v-.052c0-1.501-.297-2.784-.891-3.847C1.515 1.063.894.354.246 0H.212L0 .617c.48.42.917 1.09 1.31 2.01.393.92.59 2.032.59 3.336v.074c0 1.33-.191 2.454-.573 3.37-.382.917-.824 1.575-1.327 1.976L.212 12h.034z"></path>
                              </svg>
                            </i>
                          </div>
                        </div>
                        <div className="zhhA1X0YeX">
                          <div className="b4WLaPHvaN">
                            <div>
                              <i className="GHUxSkxNuJ MSU7d8LTb3 X8XVK1EpGd">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  className="chat-icon"
                                >
                                  <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H9v-1h5V2H9V1h5zM2 13v1h1v1H2a1 1 0 01-.993-.883L1 14v-1h1zm6 1v1H4v-1h4zM2 3.999V12H1V3.999h1zm5.854 1.319l2.828 2.828a.5.5 0 010 .708l-2.828 2.828a.5.5 0 11-.708-.707L9.121 9H4.5a.5.5 0 010-1h4.621L7.146 6.025a.5.5 0 11.708-.707zM3 1v1H2v.999H1V2a1 1 0 01.883-.993L2 1h1zm5 0v1H4V1h4z"></path>
                                </svg>
                              </i>
                            </div>
                          </div>
                          <div
                            className="b4WLaPHvaN"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseWidthExample"
                            aria-expanded="false"
                            aria-controls="collapseWidthExample"
                          >
                            <div>
                              <i className="GHUxSkxNuJ uhPpW_bDvZ X8XVK1EpGd">
                                <svg
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="chat-icon"
                                >
                                  <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12zm0 1H2v12h12V2zm-2.904 5.268l-2.828 2.828a.5.5 0 01-.707 0L4.732 7.268a.5.5 0 11.707-.707l2.475 2.475L10.39 6.56a.5.5 0 11.707.707z"></path>
                                </svg>
                              </i>
                            </div>
                          </div>
                          <div className="b4WLaPHvaN">
                            <div>
                              <i className="GHUxSkxNuJ dktYUG_IaQ X8XVK1EpGd">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  className="chat-icon"
                                >
                                  <path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H8v-1h6V2H2v5H1V2a1 1 0 011-1h12zM5.5 9a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-2.744l-3.34 3.34a.5.5 0 01-.637.058l-.07-.058a.5.5 0 01-.057-.638l.058-.069L4.342 10H1.5a.5.5 0 010-1h4z"></path>
                                </svg>
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="Z8RjJZsXy1">
                        <div
                          className="lmRE8vX68Q PJHbR_Yd2l"
                          style={{
                            transition: "opacity 200ms ease-in-out 0s",
                            opacity: 0,
                          }}
                        >
                          <div className="uM6AUh43Zu"></div>
                        </div>
                        <div className="PHu35ijDVb">
                          <div className="RVRQV2fIDA">
                            <div className="shopee-react-input sxIHRpEQxY">
                              <div className="shopee-react-input__inner shopee-react-input__inner--normal">
                                <div className="shopee-react-input__prefix">
                                  <span>
                                    <i className="GHUxSkxNuJ qH3bHQsd39 PQFG3BVRno">
                                      <svg
                                        viewBox="0 0 16 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="chat-icon"
                                      >
                                        <path d="M14.456 14.456c-.301.3-.789.3-1.09 0L10.012 11.1a4.74 4.74 0 01-2.956 1.011c-1.412 0-2.608-.49-3.587-1.468C2.49 9.664 2 8.47 2 7.056c0-1.413.49-2.61 1.468-3.588C4.447 2.489 5.643 2 7.056 2c1.413 0 2.608.49 3.587 1.468.979.979 1.468 2.175 1.468 3.588A4.74 4.74 0 0111.1 10.01l3.356 3.356c.3.3.3.788 0 1.089zm-7.4-3.9c.972 0 1.798-.34 2.48-1.02.68-.682 1.02-1.508 1.02-2.48 0-.973-.34-1.8-1.02-2.48-.682-.68-1.508-1.02-2.48-1.02-.973 0-1.8.34-2.48 1.02-.68.68-1.02 1.507-1.02 2.48 0 .972.34 1.798 1.02 2.48.68.68 1.507 1.02 2.48 1.02z"></path>
                                      </svg>
                                    </i>
                                  </span>
                                </div>
                                <input
                                  className="shopee-react-input__input"
                                  type="input"
                                  placeholder="Tìm kiếm"
                                />
                                <div className="shopee-react-input__suffix">
                                  <i
                                    tabIndex={-1}
                                    className="shopee-react-input__clear-btn shopee-react-icon seller-icon-round-close-s shopee-seller-iconfont"
                                  ></i>
                                </div>
                              </div>
                            </div>
                            <div className="hlu4O5OHu9">
                              <div className="shopee-react-dropdown">
                                <div className="WowWDssHK9">
                                  Tất cả
                                  <i className="GHUxSkxNuJ ge3r1qOvgN">
                                    <svg
                                      viewBox="0 0 16 16"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="chat-icon"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.25 9.19L4.28 5.22a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L8.25 9.19z"
                                      ></path>
                                    </svg>
                                  </i>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="VUVLX8qOEv">
                            <div className="uSCzLeGnGd null">
                              <div className="MjLuVfkgAr null">
                                <div
                                  className="ZWrg9QvNPg"
                                  style={{ position: "relative" }}
                                >
                                  <div
                                    style={{
                                      overflow: "visible",
                                      height: 0,
                                      width: 0,
                                    }}
                                  >
                                    <div
                                      aria-label="grid"
                                      aria-readonly="true"
                                      className="ReactVirtualized__Grid ReactVirtualized__List FxDBWGjZm0 "
                                      role="grid"
                                      tabIndex={0}
                                      style={{
                                        boxSizing: "border-box",
                                        direction: "ltr",
                                        height: 412,
                                        position: "relative",
                                        width: 224,
                                        willChange: "transform",
                                        overflow: "auto",
                                      }}
                                    >
                                      {contactReceivers
                                        .filter(
                                          (contact) =>
                                            contact[0].seller_id ===
                                            contact[0].receiver_id
                                        )
                                        .map((contact, index) => (
                                          <div
                                            className="ReactVirtualized__Grid__innerScrollContainer"
                                            role="rowgroup"
                                            style={{
                                              width: "auto",
                                              height: 62,
                                              maxWidth: 224,
                                              maxHeight: 2288,
                                              overflow: "hidden",
                                              position: "relative",
                                            }}
                                          >
                                            <div
                                              className="ZSOu4_Ofaf"
                                              data-cy="minichat-conversation-cell-root"
                                              onClick={() =>
                                                HandleChat(
                                                  contact[0].buyer_id,
                                                  contact
                                                )
                                              }
                                              style={{
                                                height: 62,
                                                left: 0,
                                                position: "absolute",
                                                top: 0,
                                                width: "100%",
                                              }}
                                            >
                                              <img
                                                alt=""
                                                className="ATE4_cAWR1 yAw4HeXgj1"
                                                src={
                                                  urlImage +
                                                  "user/" +
                                                  contact[0].sender_image
                                                }
                                              />

                                              <div className="Dcv8CzncwR">
                                                <div className="wU7cFyNgJE">
                                                  <div className="oMCwya4MZe">
                                                    <Link>
                                                      <div
                                                        className="HzTC4LV8Q6"
                                                        title={
                                                          contact[0]
                                                            .sender_username
                                                        }
                                                      >
                                                        {
                                                          contact[0]
                                                            .sender_username
                                                        }
                                                      </div>
                                                    </Link>
                                                  </div>
                                                </div>
                                                <div className="CAwrN7ZlTp">
                                                  <div className="PMNySQqlyZ">
                                                    <span
                                                      title={NewMessage(
                                                        contact[0].buyer_id
                                                      )}
                                                    >
                                                      {NewMessage(
                                                        contact[0].buyer_id
                                                      )}
                                                    </span>
                                                  </div>
                                                  {contact.filter(
                                                    (cont) => cont.status === 1
                                                  ).length > 0 && (
                                                    <div className="zJkRJX4szQ">
                                                      <div
                                                        className="w6n1VWWNog inSZPI5424 vNARkH3sjp"
                                                        style={{ width: 16 }}
                                                      >
                                                        {
                                                          contact.filter(
                                                            (cont) =>
                                                              cont.status === 1
                                                          ).length
                                                        }
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                  <div className="resize-triggers">
                                    <div className="expand-trigger">
                                      <div
                                        style={{ width: 225, height: 413 }}
                                      ></div>
                                    </div>
                                    <div className="contract-trigger"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="C8Jzw7jkTU">
                          <div className="gLbzKNEAYF">
                            <div className="DOFDK5HL9H">
                              <div className="shopee-react-dropdown">
                                <div className="Bovr3kIM9j">
                                  <div id="" className="lyWL3rDmij">
                                    {nameBuyer}
                                  </div>
                                  <i className="GHUxSkxNuJ JfqKPx66aP">
                                    <svg
                                      viewBox="0 0 16 16"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="chat-icon"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.25 9.19L4.28 5.22a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L8.25 9.19z"
                                      ></path>
                                    </svg>
                                  </i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="Mj9lh6KccD">
                            <div id="messagesContainer" className="WHIaShCfot">
                              <div className="uSCzLeGnGd null">
                                <div className="MjLuVfkgAr null">
                                  <div
                                    className="N1x9FHSgsu"
                                    id="messageSection"
                                    style={{ position: "relative" }}
                                  >
                                    <div
                                      style={{
                                        overflow: "visible",
                                        height: 0,
                                        width: 0,
                                      }}
                                    >
                                      <div
                                        aria-label="grid"
                                        aria-readonly="true"
                                        className="ReactVirtualized__Grid ReactVirtualized__List cmgkmzn7la"
                                        id="#message-virtualized-list"
                                        role="grid"
                                        tabIndex={0}
                                        style={{
                                          boxSizing: "border-box",
                                          direction: "ltr",
                                          height: 330,
                                          position: "relative",
                                          width: 416,
                                          willChange: "transform",
                                          overflow: "auto",
                                        }}
                                      >
                                        <div
                                          className="ReactVirtualized__Grid__innerScrollContainer"
                                          role="rowgroup"
                                          style={{
                                            width: "auto",
                                            height: 585,
                                            maxWidth: 416,
                                            maxHeight: 585,
                                            overflow: "hidden",
                                            position: "relative",
                                          }}
                                        >
                                          {messages.map((message, index) =>
                                            message.sender_id === user.id ? (
                                              <div className="message sent">
                                                <div className="message-content">
                                                  {message.message_text}
                                                </div>
                                                <div className="message-time">
                                                  {formatDateTime(
                                                    message.created_at
                                                  )}
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="message received">
                                                <div className="message-sender">
                                                  {message.sender_username}
                                                </div>
                                                <div className="message-content">
                                                  {message.message_text}
                                                </div>
                                                <div className="message-time">
                                                  {formatDateTime(
                                                    message.created_at
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="QDLp_uN4bC"
                              style={{ minHeight: 88 }}
                            >
                              <div className="IYgxpOlpLN">
                                <div
                                  className="g00e_kvU_x"
                                  style={{ height: 88 }}
                                >
                                  <span className="XeTYlv06FQ"></span>
                                  <div className="oC6tENbTp5">
                                    <div className="X6NljyWyEg">
                                      <div className="RR2wewQMSf">
                                        <textarea
                                          value={message_text}
                                          onChange={(e) =>
                                            setMessageText(e.target.value)
                                          }
                                          className="MdXquzGuDv"
                                          placeholder="Nhập nội dung tin nhắn"
                                        />
                                        <div class="C4eQ_E6clG">
                                          <button
                                            onClick={handleSentMess}
                                            class="pqq6o4R57Y "
                                            style={{
                                              border: "none",
                                              backgroundColor: "#FFFFFF",
                                            }}
                                          >
                                            <i class="GHUxSkxNuJ efElYaAvMZ plW8rzAMob">
                                              <svg
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="chat-icon colorshopee"
                                              >
                                                <path d="M4 14.497v3.724L18.409 12 4 5.779v3.718l10 2.5-10 2.5zM2.698 3.038l18.63 8.044a1 1 0 010 1.836l-18.63 8.044a.5.5 0 01-.698-.46V3.498a.5.5 0 01.698-.459z"></path>
                                              </svg>
                                            </i>
                                          </button>
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
            {/* Kết thúc phần nhắn tin */}
          </div>
        </div>
        <script src="https://www.paypal.com/sdk/js?client-id=your-client-ID&currency=USD"></script>
      </section>
    </>
  );
};

export default ChannelSeller;
