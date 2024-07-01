import { MdFavoriteBorder } from "react-icons/md";
import { PiAddressBook } from "react-icons/pi";
import { CgPassword } from "react-icons/cg";
import UserService from "../../service/UserService";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { urlImage } from "../../config";
const ChangePassword = () => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        console.log("storedUserId: " + storedUserId);
        const result = await UserService.getById(storedUserId);
        setUser(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [load,user]);

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu mới và mật khẩu xác nhận không khớp");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/changepassword",
        { id: user.id, password: password }
      );
      alert("Password changed successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
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
                        alt=""
                        className="shopee-avatar__img"
                        src={urlImage + "user/" + user.image}
                      />
                    </div>
                  </Link>
                  <div className="miwGmI" style={{ marginLeft: 20 }}>
                    <div className="mC1Llc">{user.username}</div>
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
                      alt=""
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
                      <img
                      alt=""
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
          <div
            className="col l-10 m-12 c-12 my-account"
            style={{ backgroundColor: "white" }}
          >
            <div className="fkIi86">
              <div className="CAysXD" role="main">
                <div className="eKNr3O">
                  <form onSubmit={handleChangePassword}>
                    <div className="lUJ6Ss">
                      <div className="KC5T1i">
                        <h1 className="hDnM0h">Đổi mật khẩu</h1>
                        <div className="tvFH75">
                          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu
                          cho người khác
                        </div>
                      </div>
                      <div className="bqHUZD">
                        <div className="sXoB1J d8lbmP">
                          <div className="fft2OC lBNFRA">
                            <div className="H56s_d">
                              <label className="DIzkRh">Mật khẩu mới</label>
                            </div>
                          </div>
                          <div className="EpETgI">
                            <div className="QBBl6m">
                              <div className="q18aRr">
                                <input
                                  id="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="Btdmxp"
                                  type="password"
                                  placeholder
                                  autoComplete="off"
                                  name="newPassword"
                                  maxLength={16}
                                  aria-invalid="false"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d8lbmP">
                          <div className="fft2OC lBNFRA">
                            <div className="H56s_d">
                              <label className="DIzkRh">
                                Xác nhận mật khẩu
                              </label>
                            </div>
                          </div>
                          <div className="EpETgI">
                            <div className="QBBl6m">
                              <div className="q18aRr">
                                <input
                                  id="confirmPassword"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  className="Btdmxp"
                                  type="password"
                                  placeholder
                                  autoComplete="off"
                                  name="newPasswordRepeat"
                                  maxLength={16}
                                  aria-invalid="false"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="SuYZLv d8lbmP">
                          <div className="lBNFRA"></div>
                          <div className="EpETgI">
                            <button
                              type="submit"
                              className="btn btn-solid-primary btn--m btn--inline "
                              aria-disabled="true"
                            >
                              Xác nhận
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
