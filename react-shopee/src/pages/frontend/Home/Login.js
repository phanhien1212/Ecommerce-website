import { useState } from "react";
import "../../../CSS/login.css";
import CustomerService from "../../../service/CustomerService";
import { useNavigate } from "react-router-dom";
import UserService from "../../../service/UserService";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");

      if (usernameInput.value === "") {
        document.getElementById(
          "authentication-input-error_3f02b8d1-53a7-465a-8586-5c51e2bbb824"
        ).innerText = "Email hoặc tên đăng nhập không được bỏ trống.";
        return; // Dừng hàm handleLogin nếu username không được nhập
      }

      if (passwordInput.value === "") {
        document.getElementById(
          "authentication-input-error_04b5146d-a6f8-4da1-b3ab-631ce659cc49"
        ).innerText = "Mật khẩu không được bỏ trống.";
        return; // Dừng hàm handleLogin nếu password không được nhập
      }

      // Gửi yêu cầu POST đến đối tượng Spring Boot
      const response = await UserService.login({
        username: username,
        password: password,
      });

      console.log("1234" + response.data);

      if (response.status === 200) {
        // Lưu thông tin người dùng vào Local Storage
        const user = response.data;

        // Lưu ID người dùng và vai trò vào Local Storage
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", user.role);

        // Chuyển hướng tùy thuộc vào vai trò
        alert("Đăng nhập thành công");
        if (localStorage.getItem("userRole") === "seller") {
          navigate("/seller");
        }
        if (localStorage.getItem("userRole") === "customer") {
          navigate("/");
        }
      } else {
        // Xử lý lỗi đăng nhập thất bại
        console.error("Login failed");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.log("error", error);
    }
  };

  return (
    <div>
      <section className="hdl-contentt">
        <div className="container-fluid">
          <div style={{ backgroundColor: "rgb(238, 78, 46)" }}>
            <div
              className="I6FFfq inuiVd"
              style={{
                backgroundColor: "rgb(238, 78, 46)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                height: 700,
              }}
            >
              <div className="WwkuJx">
                <div className="Oh4AAv"></div>
                <div className="header__logo hide-on-mobile-tablet">
                  <a href="./" className="header__logo-link">
                    <img
                      style={{
                        width: 550,
                        height: 100,
                        marginLeft: -200,
                        marginTop: 100,
                        filter: "brightness(0)",
                        WebkitFilter: "brightness(0)",
                      }}
                      src={require("../../../Images/z5322895712367_be8e0d096bb3535a08b2f0eb8b5433d6.jpg")}
                    ></img>
                  </a>
                </div>
                <div>
                  <div className="bp7sPl YN9KVd Rlj6l5">
                    <div className="TYsRUL">
                      <div className="cq9dlj">
                        <div className="fHNfvs">Đăng nhập</div>
                      </div>
                    </div>
                    <div className="p7oxk2">
                      <div></div>
                      <form onSubmit={handleLogin}>
                        <div className="hww4XZ">
                          <div className="q18aRr">
                            <input
                              className="Btdmxp"
                              type="text"
                              placeholder="Email/Số điện thoại/Tên đăng nhập"
                              autoComplete="on"
                              name="loginKey"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              id="username"
                              maxLength={128}
                              aria-invalid="false"
                              defaultValue
                            />
                          </div>
                          <div
                            id="authentication-input-error_3f02b8d1-53a7-465a-8586-5c51e2bbb824"
                            className="Se7P7J ms-3"
                            aria-live="polite"
                          ></div>
                        </div>
                        <div className="biFZbP">
                          <div className="q18aRr">
                            <input
                              className="Btdmxp"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Mật khẩu"
                              autoComplete="current-password"
                              name="password"
                              maxLength={16}
                              id="password"
                              aria-invalid="false"
                              defaultValue
                            />
                          </div>
                          <div
                            id="authentication-input-error_04b5146d-a6f8-4da1-b3ab-631ce659cc49"
                            className="Se7P7J ms-3"
                            aria-live="polite"
                          ></div>
                        </div>
                        <button
                          type="submit"
                          className="DYKctS hqfBzL SYqMlu NBaRN4 CEiA6B ukVXpA"
                        >
                          Đăng nhập
                        </button>
                      </form>
                      <div className="vGSaeh">
                        <a className="hZ5QQO" href="/buyer/reset">
                          Quên mật khẩu
                        </a>
                      </div>
                      <div className="awPXwj">
                        <div className="NleHE1">
                          <div className="rEVZJ2"></div>
                          <span className="EMof35">hoặc</span>
                          <div className="rEVZJ2"></div>
                        </div>
                        <div className="SR5mQ0">
                          <button className="eADVqX b7kM6N KIySnv">
                            <div className="zwXUkg">
                              <div className="XqhqCI social-white-background social-white-fb-blue-png"></div>
                            </div>
                            <div className>Facebook</div>
                          </button>
                          <button className="eADVqX b7kM6N KIySnv">
                            <div className="zwXUkg">
                              <div className="XqhqCI social-white-background social-white-google-png"></div>
                            </div>
                            <div className>Google</div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="fEA_sn">
                      <div className="hrNwO1 PNGrtG">
                        Bạn mới biết đến Shopee?
                        <a
                          className="U3bTnx"
                          href="/buyer/signup?next=https%3A%2F%2Fshopee.vn%2F%25C3%2581o-Thun-Tr%25C6%25A1n-Godmother-Blank-T-shirt-100-Cotton-250gsm-Cao-C%25E1%25BA%25A5p-i.703090265.19787998337%3Fsp_a...a7301748"
                        >
                          Đăng ký
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
