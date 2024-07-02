import { useEffect, useState } from "react";
import { CgPassword } from "react-icons/cg";
import { MdFavoriteBorder } from "react-icons/md";
import { PiAddressBook } from "react-icons/pi";
import UserService from "../../service/UserService";
import { urlImage } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
const Account = () => {
  const [user, setUser] = useState(null);
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [lastname, setLastName] = useState("");
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        console.log("storedUserId: " + storedUserId);
        const result = await UserService.getById(storedUserId);
        setUser(result.data);
        setUsername(result.data.username);
        setFirstName(result.data.firstname);
        setLastName(result.data.lastname);
        console.log(result.data);
        if (result.data.gender) {
          setGender(result.data.gender);
        } else {
          // Nếu không, đặt mặc định là "Nam" hoặc "Nữ"
          setGender(""); // hoặc setGender("Nữ")
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [load]);

  const handleSaveGender = async () => {
    try {
      const image = document.getElementById("file-upload");
      const addUser = new FormData();
      addUser.append("firstname", firstname);
      addUser.append("lastname", lastname);
      addUser.append("username", username);
      addUser.append("gender", gender);
      addUser.append("phone", user.phone);
      addUser.append("email", user.email);
      addUser.append("role", user.role);
      addUser.append("updated_by", user.id);
      addUser.append("address", user.address);
      addUser.append("latitude", user.latitude);
      addUser.append("longitude", user.longitude);
      addUser.append("status", user.status);
      addUser.append("image", image.files.length === 0 ? "" : image.files[0]);

      const resultUser = await UserService.update(user.id, addUser);
      if (resultUser.status === 200) {
        toast.success("Thay đổi thông tin thành công!");
      }

      setLoad(Date.now());
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="app__container">
        <div className="grid wide">
          <div className="row sm-gutter app__content">
            <div className="col l-2 m-0 c-0">
              <div className="category-pc">
                <nav className="category">
                  {user && (
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
                  )}
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
              <div className="">
                <h4>Hồ sơ của tôi</h4>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <div className="infor-account">
                {user && (
                  <div className="RCnc9v">
                    <div className="HrBg9Q">
                      <form>
                        <table className="bQkdAY">
                          <tbody>
                            <tr>
                              <td className="f1ZOv_ F4ruY9">
                                <label>Tên đăng nhập</label>
                              </td>
                              <td className="o6L4e0">
                                <div>
                                  <div className="NGoa5Z">
                                    <input
                                      type="text"
                                      placeholder
                                      className="kKnR04"
                                      value={username}
                                      onChange={(e) =>
                                        setUsername(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="JQaxZl">
                                    Tên Đăng nhập không được chứa khoảng trắng.
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="f1ZOv_">
                                <label>Tên</label>
                              </td>
                              <td className="o6L4e0">
                                <div>
                                  <div className="NGoa5Z">
                                    <input
                                      type="text"
                                      placeholder="Firstname"
                                      className="kKnR04"
                                      value={firstname}
                                      onChange={(e) =>
                                        setFirstName(e.target.value)
                                      }
                                    />
                                    |
                                    <input
                                      type="text"
                                      placeholder
                                      className="kKnR04"
                                      value={lastname}
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="f1ZOv_">
                                <label>Email</label>
                              </td>
                              <td className="o6L4e0">
                                <div className="e_Vt__">
                                  <div className="PBfYlq">{user.email}</div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="f1ZOv_">
                                <label>Số điện thoại</label>
                              </td>
                              <td className="o6L4e0">
                                <div className="e_Vt__">
                                  <div className="PBfYlq">{user.phone}</div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="f1ZOv_">
                                <label>Giới tính</label>
                              </td>
                              <td className="o6L4e0">
                                <div className="prDHtK">
                                  <div
                                    className="stardust-radio-group"
                                    role="radiogroup"
                                  >
                                    <div
                                      className="stardust-radio"
                                      tabIndex={0}
                                      role="radio"
                                      aria-checked="false"
                                    >
                                      <div className="stardust-radio-button">
                                        <input
                                          checked={gender === "Nam"}
                                          value="Nam"
                                          onChange={(e) =>
                                            setGender(e.target.value)
                                          }
                                          type="radio"
                                          id="radio1"
                                          name="color"
                                          className="color-radio"
                                        ></input>
                                      </div>
                                      <div className="stardust-radio__content">
                                        <div className="stardust-radio__label">
                                          Nam
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="stardust-radio"
                                      tabIndex={0}
                                      role="radio"
                                      aria-checked="false"
                                    >
                                      <div className="stardust-radio-button">
                                        <input
                                          checked={gender === "Nữ"}
                                          value="Nữ"
                                          onChange={(e) =>
                                            setGender(e.target.value)
                                          }
                                          type="radio"
                                          id="radio2"
                                          name="color"
                                          className="color-radio"
                                        ></input>
                                      </div>
                                      <div className="stardust-radio__content">
                                        <div className="stardust-radio__label">
                                          Nữ
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td className="f1ZOv_">
                                <label></label>
                              </td>
                              <td className="o6L4e0">
                                <button
                                  onClick={handleSaveGender}
                                  type="button"
                                  className="btn btn-solid-primary btn--m btn--inline"
                                  aria-disabled="false"
                                >
                                  Lưu
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </form>
                    </div>
                    <div className="nv7bOz">
                      <div className="TJWfNh">
                        {selectedImage ? (
                          <div className="nMPYiw" role="header">
                            <img
                              alt=""
                              className="cW0oBM"
                              src={URL.createObjectURL(selectedImage)}
                            />
                          </div>
                        ) : (
                          <div className="nMPYiw" role="header">
                            <img
                              alt=""
                              className="cW0oBM"
                              src={`${urlImage}user/${user.image}`}
                            />
                          </div>
                        )}
                        <label
                          for="file-upload"
                          className="btn btn-light btn--m btn--inline"
                        >
                          Chọn ảnh
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          name="myImage"
                          onChange={(event) => {
                            console.log(event.target.files[0]);
                            setSelectedImage(event.target.files[0]);
                          }}
                          accept=".jpg,.jpeg,.png,.webp"
                        />

                        <div className="T_8sqN">
                          <div className="JIExfq">
                            Dụng lượng file tối đa 1 MB
                          </div>
                          <div className="JIExfq">Định dạng:.JPEG, .PNG</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
