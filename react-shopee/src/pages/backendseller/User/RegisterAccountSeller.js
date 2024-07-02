import { useEffect, useState } from "react";
import ShopProfileService from "../../../service/ShopProfileService";
import { urlImage } from "../../../config";
import { useNavigate } from "react-router-dom";
import UserService from "../../../service/UserService";

const RegisterAccountSeller = () => {
  const sellerid = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(Date.now());
  const [huyen, setHuyen] = useState([]);
  const [xa, setXa] = useState([]);
  const [addressTool, setAddressTool] = useState("");
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedXa, setSelectedXa] = useState("");
  const [selectedHuyen, setSelectedHuyen] = useState("");
  const [tinhThanh, setTinhThanh] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const resultUser = await UserService.getById(sellerid);
      setUser(resultUser.data);
      console.log(resultUser);
    })();
  }, [load]);

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    window.location.reload();
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://esgoo.net/api-tinhthanh/4/0.htm");
      const jsonData = await response.json();
      setTinhThanh(jsonData.data);
    };

    fetchData();
  }, [load]);
  const handleNext = async (event) => {
    event.preventDefault();
    const selectedTinhObj = tinhThanh.find((tinh) => tinh.id === selectedTinh);
    const selectedXaObj = xa.find((x) => x.id === selectedXa);
    const selectedHuyenObj = huyen.find((h) => h.id === selectedHuyen);
    console.log("sậks", selectedHuyenObj.latitude);
    try {
      const image = document.getElementById("image");
      const addShopProfile = new FormData();
      addShopProfile.append("name", name);
      addShopProfile.append("id_seller", sellerid);
      addShopProfile.append(
        "address",
        `${addressTool}, ${selectedXaObj.name}, ${selectedHuyenObj.name}, ${selectedTinhObj.name}`
      );
      addShopProfile.append("phone", phone);
      addShopProfile.append("email", email);
      addShopProfile.append("latitude", parseFloat(selectedHuyenObj.latitude));
      addShopProfile.append(
        "longitude",
        parseFloat(selectedHuyenObj.longitude)
      );
      addShopProfile.append(
        "image",
        image.files.length === 0 ? "" : image.files[0]
      );

      // Thêm cửa hàng
      const resultShopProfile = await ShopProfileService.addshop(
        addShopProfile
      );

      if (resultShopProfile.status === 201) {
        // Cập nhật vai trò của người dùng thành 'seller'
        const roleFormData = new FormData();
        roleFormData.append("role", "seller"); // Chắc chắn truyền giá trị 'seller' cho tham số 'role'
        const resultUpdateRole = await UserService.updateRole(
          user.id,
          roleFormData
        );

        // Chuyển hướng đến trang hoàn thành
        navigate("/acc/complete");
      }
    } catch (error) {
      console.error("Error:", error);
      // Xử lý lỗi nếu cần thiết
    }
  };
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
  return (
    <div>
      <section className="hdl-headerr sticky-top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-7">
              <h4 className="mt-3">Đăng ký trở thành người bán Stressmama</h4>
            </div>
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
          </div>
        </div>
      </section>
      <section className="hdl-contentt">
        <div className="container">
          <div
            className="container mt-4 d-flex justify-content-center align-items-center flex-column"
            style={{ backgroundColor: "#ffffff", height: 750 }}
          >
            <div className="p-2">
              <h3>Thông tin Shop</h3>
            </div>
            <div className="p-2">
              <hr style={{ width: 800 }} />
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2">
                <span className="colorshopee">*</span> Tên Shop
              </div>
              <div className="p-2" style={{ width: 402, height: 36 }}>
                <input
                  type="text"
                  className="form-control border d-inline-block"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                  }}
                  placeholder="Nhập vào"
                />
              </div>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2" style={{ marginLeft: -41 }}>
                <span className="colorshopee">*</span> Địa Chỉ Lấy Hàng
              </div>
              <div className="p-2 ">
                <select
                  type="text"
                  value={selectedTinh}
                  onChange={handleTinhThanhChange}
                  className="form-control border d-inline-block"
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                    width: 120,
                  }}
                >
                  <option key="" value="">
                    --- Chọn Tỉnh ---
                  </option>
                  {tinhThanh.map((tinh) => (
                    <option key={tinh.id} value={tinh.id}>
                      {tinh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-2 ">
                <select
                  type="text"
                  value={selectedHuyen}
                  onChange={handleHuyenChange}
                  className="form-control border d-inline-block"
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                    width: 120,
                  }}
                >
                  <option key="" value="">
                    --- Chọn Huyện ---
                  </option>
                  {huyen.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-2 ">
                <select
                  type="text"
                  value={selectedXa}
                  onChange={(e) => setSelectedXa(e.target.value)}
                  className="form-control border d-inline-block"
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                    width: 120,
                  }}
                >
                  <option key="" value="">
                    --- Chọn Xã ---
                  </option>
                  {xa.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2" style={{marginLeft:-30}}>
                <span className="colorshopee">*</span> Địa Chỉ Cụ Thể
              </div>
              <div className="p-2" style={{ width: 402, height: 36 }}>
                <input
                  type="text"
                  className="form-control border d-inline-block"
                  value={addressTool}
                  onChange={(e) => setAddressTool(e.target.value)}
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                  }}
                  placeholder="Nhập vào"
                />
              </div>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2" style={{ marginLeft: 28}}>
                <span className="colorshopee">*</span> Email
              </div>
              <div className="p-2" style={{ width: 402, height: 36 }}>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control border d-inline-block"
                  id="exampleFormControlInput1"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                  }}
                  placeholder="Nhập vào"
                />
              </div>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2" style={{ marginLeft: "-22px" }}>
                <span className="colorshopee">*</span> Số Điện Thoại
              </div>
              <div className="p-2" style={{ width: 402, height: 36 }}>
                <input
                  type="text"
                  name="phonenumber"
                  className="form-control border d-inline-block"
                  id="exampleFormControlInput1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                  }}
                  placeholder="Nhập vào"
                />
              </div>
            </div>
            <div className="p-2 d-flex flex-row">
              <div className="p-2 mt-2" style={{ marginLeft: -30 }}>
                <span className="colorshopee">*</span> Thêm Hình Ảnh
              </div>
              <div className="p-2" style={{ width: 402, height: 36 }}>
                <input
                  type="file"
                  name="phonenumber"
                  className="form-control border d-inline-block"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    fontSize: 14,
                    height: 36,
                  }}
                  placeholder="Nhập vào"
                />
              </div>
            </div>
            <div className="p-2">
              <hr style={{ width: 800, marginTop: 50 }} />
            </div>
            <div
              className="d-flex flex-row-reverse"
              style={{ marginLeft: 510 }}
            >
              <div className="p-2">
                <button
                  type="button"
                  style={{ fontSize: 14, width: 180, height: 36 }}
                  className="btn btn btn-danger mb-4 mx-auto"
                  onClick={handleNext}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterAccountSeller;
