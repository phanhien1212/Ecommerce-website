import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import currency from "currency.js";
import "react-toastify/dist/ReactToastify.css";
import { removeFromCart } from "../../state/cartSlice";
import { urlImage } from "../../config";
import UserService from "../../service/UserService";
import { useEffect, useState } from "react";
import NotificationService from "../../service/NotificationService";
import AdvertisingCampaignService from "../../service/AdvertisingCampaignsService";
import { ToastContainer, toast } from "react-toastify";
const Header = () => {
  const [huyen, setHuyen] = useState([]);
  const [xa, setXa] = useState([]);
  const [addressTool, setAddressTool] = useState("");
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedXa, setSelectedXa] = useState("");
  const [selectedHuyen, setSelectedHuyen] = useState("");
  const [tinhThanh, setTinhThanh] = useState([]);
  const dispatch = useDispatch();
  const userId = parseInt(localStorage.getItem("userId")); // Lấy userId từ localStorage
  const cartItems = useSelector((state) =>
    state.cart.items.filter((item) => item.userId === userId)
  );
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.count;
  }, 0);

  const [stored, setStored] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [load, setLoad] = useState(Date.now());
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://esgoo.net/api-tinhthanh/4/0.htm");
      const jsonData = await response.json();
      setTinhThanh(jsonData.data);
    };

    fetchData();
  }, [load]);
  const handleTinhThanhChange = async (event) => {
    const selectedTinhId = event.target.value;
    setSelectedTinh(selectedTinhId);

    // Tìm tỉnh thành được chọn từ danh sách tỉnh thành
    const selectedTinhThanh = tinhThanh.find(
      (tinh) => tinh.id === selectedTinhId
    );
    console.log("ưqj", selectedTinhThanh);
    // Lấy danh sách huyện từ tỉnh thành được chọn
    const danhSachHuyen = selectedTinhThanh.data2.map((huyen) => ({
      id: huyen.id,
      name: huyen.name,
      latitude: huyen.latitude,
      longitude: huyen.longitude,
      data3: huyen.data3,
    }));
    setHuyen(danhSachHuyen);
  };
  const handleHuyenChange = async (event) => {
    const selectedHuyenId = event.target.value;
    setSelectedHuyen(selectedHuyenId);
    console.log(selectedHuyenId);
    // Tìm tỉnh thành được chọn từ danh sách tỉnh thành
    const selectedHuyen = huyen.find((huyen) => huyen.id === selectedHuyenId);
    // Lấy danh sách huyện từ tỉnh thành được chọn
    console.log("tonh", selectedHuyen);
    const danhSachXa = selectedHuyen.data3.map((huyen) => ({
      id: huyen.id,
      name: huyen.name,
    }));
    console.log(danhSachXa);

    setXa(danhSachXa);
  };
  useEffect(() => {
    const fetchData = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setStored(storedUserId);
        try {
          const result = await UserService.getById(parseInt(storedUserId, 10));
          setUser(result.data);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
      }
      if (storedUserId !== null) {
        const resultNotifications = await NotificationService.getbyrepicientid(
          storedUserId
        );
        const noti = resultNotifications.data.filter(
          (notification) => notification.role === "customer"
        );
        const sortedNotis = noti.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotification(sortedNotis);
      }
    };

    fetchData();
  }, [load, user, notification]);

  const handleLogout = () => {
    // Xóa userId khỏi localStorage
    localStorage.removeItem("userId");
    navigate("/");
    // Tăng giá trị load để kích thích useEffect chạy lại
    window.location.reload();
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu POST đến đối tượng Spring Boot
      const response = await UserService.login({
        username: username,
        password: password,
      });
      console.log("1234" + response);

      if (response.status === 200) {
        // Lưu thông tin người dùng vào Local Storage
        const user = response.data;

        // Lưu ID người dùng và vai trò vào Local Storage
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", user.role);

        // Chuyển hướng tùy thuộc vào vai trò
        if (user.role === "admin") {
          navigate("/admin");
          toast.success("Đăng nhập thành công!");
        } else if (user.role === "seller") {
          navigate("/seller");
          toast.success("Đăng nhập thành công!");
        } else if (user.role === "customer") {
          navigate("/");
          toast.success("Đăng nhập thành công!");
        } else {
          console.error("Unknown role:", user.role);
        }

        window.location.reload();
      } else {
        // Xử lý lỗi đăng nhập thất bại
        console.error("Login failed");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      document.getElementById("errorlogin").innerText =
        "Tài khoản hoặc mật khẩu không đúng";
    }
  };

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("customer");

  const handleRegister = async (e) => {
    e.preventDefault();
    const selectedTinhObj = tinhThanh.find((tinh) => tinh.id === selectedTinh);
    const selectedXaObj = xa.find((x) => x.id === selectedXa);
    const selectedHuyenObj = huyen.find((h) => h.id === selectedHuyen);
    const address = `${addressTool}, ${selectedXaObj.name}, ${selectedHuyenObj.name}, ${selectedTinhObj.name}`;
    const latitude = parseFloat(selectedHuyenObj.latitude);
    const longitude = parseFloat(selectedHuyenObj.longitude);
    try {
      setRole("customer");
      // Tạo một đối tượng người dùng với dữ liệu từ biểu mẫu
      const newUser = {
        firstname,
        lastname,
        username,
        password,
        email,
        gender,
        latitude,
        longitude,
        role,
        address,
        phone,
      };

      // Gửi yêu cầu POST đến đối tượng Spring Boot
      const response = await UserService.register(newUser);

      console.log(response);

      if (response.status === 200 || response.status === 201) {
        try {
          // Kiểm tra nếu phản hồi có định dạng JSON
          const user = response.data;

          // Lưu ID người dùng vào Local Storage
          localStorage.setItem("userId", user.id);
          const storedUserId = localStorage.getItem("userId");
          console.log("storedUserId: " + storedUserId);

          navigate("/");
          window.location.reload();
        } catch (jsonError) {
          console.error("Response is not in JSON format:", jsonError);
        }
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      document.getElementById("errorregister").innerText =
        "Tên đăng nhập hoặc email đã tồn tại!";
    }
  };
  const KenhNguoiBan = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("userId") === null) {
      navigate("/acc/login");
    } else if (user.role === "seller") {
      navigate("/seller");
    } else {
      navigate("acc/welcome-register");
    }
  };
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
  //Search
  const [search, setSearch] = useState("");

  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (!search.trim()) {
        // Nếu không có giá trị nhập vào, không thực hiện tìm kiếm
        return;
      }

      const searchTerm = encodeURIComponent(search.trim()); // Encode từ khóa tìm kiếm để tránh các ký tự đặc biệt
      const newSearchHistory = [
        search,
        ...searchHistory.filter((item) => item !== search).slice(0, 4),
      ]; // Lọc ra các từ khóa trùng lặp và giới hạn lịch sử tìm kiếm đến 5 mục
      setSearchHistory(newSearchHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newSearchHistory));

      navigate(`/search-product?search=${searchTerm}`); // Chuyển hướng với từ khóa tìm kiếm đã được encode
      const formViews = new FormData();
      formViews.append("keyword", search);
      await AdvertisingCampaignService.updateViews(formViews);
      setLoad(Date.now());
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <>
      <ToastContainer />
      <header className="header">
        <div className="grid wide">
          <nav className="header__navbar hide-on-mobile-tablet">
            <ul className="header__navbar-list">
              <div
                className="header__navbar-item header__navbar-item-separate"
                onClick={KenhNguoiBan}
              >
                Kênh người bán
              </div>
            </ul>
            <ul className="header__navbar-list">
              <li className="header__navbar-item header__navbar-item--has-notify ">
                <Link className="header__navbar-item-link">
                  <i className="header__navbar-icon far fa-bell" />
                  {notification.filter((noti) => noti.status === 1).length ===
                  0 ? (
                    ""
                  ) : (
                    <span
                      className="bg-light-subtle rounded-circle text-danger"
                      style={{
                        fontSize: 10,
                        marginTop: -10,
                        marginLeft: -12,
                        width: 13,
                        height: 13,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {notification.filter((noti) => noti.status === 1).length}
                    </span>
                  )}

                  <span className="ms-2">Thông Báo</span>
                </Link>

                <div className="header__notify">
                  <header className="header__notify-header">
                    Thông báo mới nhận
                  </header>
                  <ul className="header__notify-list">
                    {notification &&
                      notification.map((noti) => (
                        <li
                          className={`header__notify-item header__notify-item--viewed ${
                            noti.status === 1 ? "bg-dark-subtle" : "bg-light"
                          }`}
                          onClick={() => changeStatus(noti.id, noti.status)}
                        >
                          <Link to={noti.link} className="header__notify-link">
                            <div className="header__notify-info">
                              <span className="header__notify-name">
                                {noti.title}
                              </span>
                              <span className="header__notify-description">
                                {noti.content}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    <footer className="header__notify-footer">
                      <Link to="" className="header__notify-footer-btn">
                        Xem tất cả
                      </Link>
                    </footer>
                  </ul>
                </div>
              </li>

              {stored ? (
                // User is logged in
                <>
                  <Link to="/account">
                    <li
                      id="login-item"
                      className="header__navbar-item header__navbar-item-separate"
                    >
                      {user.firstname} {user.lastname}
                    </li>
                  </Link>
                  <li
                    onClick={handleLogout}
                    id="register-item"
                    className="header__navbar-item"
                  >
                    Đăng xuất
                  </li>
                </>
              ) : (
                <>
                  <li
                    id="register-item"
                    className="header__navbar-item header__navbar-item-separate"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                  >
                    Đăng Ký
                  </li>
                  <li
                    id="login-item"
                    className="header__navbar-item"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  >
                    Đăng Nhập
                  </li>
                </>
              )}

              <div
                class="modal fade"
                id="exampleModal1"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div
                    class="modal-content"
                    style={{ width: 400, marginTop: 75, marginLeft: 20 }}
                  >
                    <form
                      id="register-form"
                      class="auth-form"
                      onSubmit={handleRegister}
                    >
                      <div class="auth-form__container">
                        <div class="auth-form__header">
                          <div class="auth-form__heading">Đăng ký</div>
                        </div>

                        <div class="auth-form__groups" >
                          <div class="auth-form__group" style={{ width: 184 }}>
                            <input
                              value={firstname}
                              onChange={(e) => setFirstName(e.target.value)}
                              id="firstname"
                              rule="firstname"
                              type="text"
                              class="auth-form__input"
                              placeholder="First name "
                            />
                          </div>
                          <div class="auth-form__group" style={{ width: 186, marginTop: -67, marginLeft: 200 }}>
                            <input
                              value={lastname}
                              onChange={(e) => setLastName(e.target.value)}
                              id="lastname"
                              rule="lastname"
                              type="text"
                              class="auth-form__input"
                              placeholder="Last name "
                            />
                          </div>
                          <div class="auth-form__group">
                            <input
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              id="username"
                              rule="username"
                              type="text"
                              class="auth-form__input"
                              placeholder="User name "
                            />
                          </div>
                          <div class="auth-form__group">
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              id="email"
                              rule="email"
                              type="text"
                              class="auth-form__input"
                              placeholder="Email "
                            />
                          </div>
                          <div class="auth-form__group">
                            <input
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="password"
                              rule="password"
                              type="password"
                              class="auth-form__input"
                              placeholder="Mật khẩu của bạn"
                            />
                          </div>
                          <div class="auth-form__group">
                            <input
                              id="password_confirmation"
                              rule="password_confirmation"
                              type="password"
                              class="auth-form__input"
                              placeholder="Nhập lại mật khẩu của bạn"
                            />
                            <span class="auth-form__message"></span>
                          </div>
                          <div class="auth-form__group">
                            <input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              id="password_confirmation"
                              rule="password_confirmation"
                              type="text"
                              class="auth-form__input"
                              placeholder="Số điện thoại "
                            />
                            <span class="auth-form__message"></span>
                          </div>
                          <div class="auth-form__group row">
                            <div className="col-md-4 ">
                              <select
                                style={{ fontSize: 14, color: "gray" }}
                                value={selectedTinh}
                                onChange={handleTinhThanhChange}
                                id="password_confirmation"
                                rule="password_confirmation"
                                className="auth-form__input "
                                placeholder="Tỉnh/Thành Phố"
                              >
                                <option
                                  style={{ fontSize: 14 }}
                                  key=""
                                  value=""
                                >
                                  Tỉnh
                                </option>
                                {tinhThanh.map((tinh) => (
                                  <option
                                    style={{ fontSize: 14, color: "gray" }}
                                    className="auth-form__input"
                                    key={tinh.id}
                                    value={tinh.id}
                                  >
                                    {tinh.name}
                                  </option>
                                ))}
                                <span class="auth-form__message">Quận</span>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                style={{ fontSize: 14, color: "gray" }}
                                value={selectedHuyen}
                                onChange={handleHuyenChange}
                                id="password_confirmation"
                                rule="password_confirmation"
                                className="auth-form__input"
                                placeholder="Tỉnh/Thành Phố"
                              >
                                <option
                                  style={{ fontSize: 14 }}
                                  key=""
                                  value=""
                                >
                                  Huyện
                                </option>
                                {huyen.map((h) => (
                                  <option
                                    style={{ fontSize: 14 }}
                                    key={h.id}
                                    value={h.id}
                                  >
                                    {h.name}
                                  </option>
                                ))}
                                <span class="auth-form__message"></span>
                              </select>
                            </div>
                            <div className="col-md-4 ">
                              <select
                                style={{ fontSize: 14, color: "gray" }}
                                value={selectedXa}
                                onChange={(e) => setSelectedXa(e.target.value)}
                                id="password_confirmation"
                                rule="password_confirmation"
                                className="auth-form__input "
                                placeholder="Tỉnh/Thành Phố"
                              >
                                <option
                                  style={{ fontSize: 14 }}
                                  key=""
                                  value=""
                                >
                                  Xã
                                </option>
                                {xa.map((x) => (
                                  <option key={x.id} value={x.id}>
                                    {x.name}
                                  </option>
                                ))}
                                <span class="auth-form__message">Quận</span>
                              </select>
                            </div>
                          </div>
                          <div class="auth-form__group">
                            <input
                              value={addressTool}
                              onChange={(e) => setAddressTool(e.target.value)}
                              id="username"
                              rule="username"
                              type="text"
                              class="auth-form__input"
                              placeholder="Địa chỉ cụ thể"
                            />
                          </div>
                        </div>

                        <div class="auth-form__aside">
                          <div class="auth-form__switch-wrapper">
                            <span class="auth-form__switch-text">
                              Bạn đã có tài khoản?&nbsp;
                            </span>
                            <span
                              class="auth-form__switch-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal2"
                            >
                              Đăng nhập
                            </span>
                          </div>
                        </div>

                        <div class="auth-form__controls">
                          <button
                            type="button"
                            class="btnn auth-form__controls-back"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal1"
                          >
                            TRỞ LẠI
                          </button>
                          <button type="submit" class="btnn btnn--primary">
                            ĐĂNG KÝ
                          </button>
                        </div>
                      </div>

                      <div id="response-register">
                        <p className="text-danger" id="errorregister"></p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div
                class="modal fade"
                id="exampleModal2"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div
                    class="modal-content"
                    style={{ width: 400, marginTop: 145, marginLeft: 20 }}
                  >
                    <form class="auth-form" onSubmit={handleLogin}>
                      <div class="auth-form__container">
                        <div class="auth-form__header">
                          <div class="auth-form__heading">Đăng nhập</div>
                        </div>

                        <div class="auth-form__groups">
                          <div class="auth-form__group">
                            <input
                              name="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              id="username"
                              rule="username"
                              type="text"
                              class="auth-form__input"
                              placeholder="Email của bạn"
                            />
                          </div>
                          <div class="auth-form__group">
                            <input
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="password"
                              rule="password"
                              type="password"
                              class="auth-form__input"
                              placeholder="Mật khẩu của bạn"
                            />
                          </div>
                        </div>

                        <div class="auth-form__aside">
                          <div class="auth-form__help">
                            <Link
                              to=""
                              class="auth-form__help-link auth-form__help-forgot"
                            >
                              Quên mật khẩu
                            </Link>
                          </div>
                        </div>

                        <div class="auth-form__controls">
                          <button
                            type="button"
                            class="btnn auth-form__controls-back"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal2"
                          >
                            TRỞ LẠI
                          </button>
                          <button type="submit" class="btnn btnn--primary">
                            ĐĂNG NHẬP
                          </button>
                        </div>

                        <div class="auth-form__switch-wrapper mt-3">
                          <span class="auth-form__switch-text">
                            Bạn chưa có tài khoản?&nbsp;
                          </span>
                          <span
                            class="auth-form__switch-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal1"
                          >
                            Đăng ký
                          </span>
                        </div>
                      </div>

                      <div id="response-login">
                        <p className="text-danger" id="errorlogin"></p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </ul>
          </nav>
          <input
            type="checkbox"
            hidden
            className="nav__input"
            id="nav-mobile-input"
          />
          {/* Nav on mobile */}

          <label htmlFor="nav-mobile-input" className="nav__overlay" />
          {/* Header-with-search */}
          <div className="header-with-search">
            <label htmlFor="nav-mobile-input" className="mobile__menu-btn">
              <i className="mobile__menu-icon fas fa-ellipsis-v" />
            </label>
            <input
              type="checkbox"
              hidden
              className="header__search-checkbox"
              id="mobile-search-checkbox"
            />
            <div className="header__logo hide-on-mobile-tablet">
              <Link to="/" className="header__logo-link">
                <img
                  alt=""
                  className="header__logo-img shopee-svg-icon header-with-search__shopee-logo icon-shopee-logo"
                  src={require("../../Images/20230719_FsK4fEIz.png")}
                ></img>
              </Link>
            </div>
            <div className="header__search">
              <form onSubmit={handleSearch} className="header__search">
                <div className="header__search-input-wrap">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="header__search-input"
                    placeholder="Nhập để tìm kiếm"
                  />
                  <i className="header__search-camera fas fa-camera " />
                  {/* Search history */}
                  <div className="header__search-history">
                    <div className="header__search-history-heading">
                      Lịch sử tìm kiếm
                    </div>
                    <ul className="header__search-history-list">
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="header__search-history-item"
                          onMouseDown={() => setSearch(item)}
                        >
                          <Link to={`/search-product?search=${item}`}>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  type="submit"
                  className="header__search-btn hide-on-mobile-tablet"
                >
                  <i className="header__search-btn-icon fas fa-search" />
                </button>
              </form>
            </div>
            <button className="header__search-fillter-wrapper clear-btn">
              <i className="header__search-fillter-icon fas fa-filter" />
              <span className="header__search-fillter-text">Lọc</span>
            </button>
            {/* Cart layout */}
            <div className="header__cart hide-on-mobile-tablet">
              <div className="header__cart-wrap">
                <i className="header__cart-icon fas fa-shopping-cart" />
                <span className="header__cart-wrap-notice">{totalItems}</span>
                {/* No cart: Header__cart-list--no-cart */}
                <div className="header__cart-list">
                  <img
                    alt=""
                    src="Images/sellout.png"
                    className="header__cart-no-card-img"
                  />
                  <span className="header__cart-list-no-card-msg">
                    Chưa có sản phẩm
                  </span>
                  <div className="header__cart-heading">Sản phẩm đã thêm</div>
                  <ul className="header__cart-list-item">
                    {/* Cart item */}
                    {cartItems.map((item) => (
                      <li
                        title="Mũ chụp ngược Minecraft Dungeons"
                        className="header__cart-item"
                      >
                        <div className="header__cart-img-wrapper">
                          <img
                            alt=""
                            src={urlImage + "product/" + item.image}
                            className="header__cart-img"
                          />
                        </div>
                        <div className="header__cart-item-info">
                          <div className="header__cart-item-head">
                            <div className="header__cart-item-name">
                              {item.name}
                            </div>
                            <div className="header__cart-item-price-wrap">
                              <span className="header__cart-item-price">
                                {currency(item.price, {
                                  separator: ".",
                                  decimal: ",",
                                  symbol: "",
                                }).format()}
                                ₫
                              </span>
                              <span className="header__cart-item-multiply">
                                x
                              </span>
                              <span className="header__cart-item-qnt">
                                {item.count}{" "}
                              </span>
                            </div>
                          </div>
                          <div className="header__cart-item-body">
                            <span className="header__cart-item-description">
                              Phân loại: Hàng Quốc tế
                            </span>
                            <span
                              className="header__cart-item-remove"
                              onClick={() =>
                                dispatch(
                                  removeFromCart({
                                    id: item.id,
                                    selectedOptions: item.selectedOptions,
                                    userId: userId,
                                  })
                                )
                              }
                            >
                              Xóa
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link to="/cart">
                    <button className="header__cart-view-cart btnn btnn--primary">
                      Xem giỏ hàng
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sort bar on mobile */}
      </header>
    </>
  );
};

export default Header;
