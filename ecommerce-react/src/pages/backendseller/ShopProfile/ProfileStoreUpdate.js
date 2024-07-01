import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopProfileService from "../../../service/ShopProfileService";
import { urlImage } from "../../../config";

const ProfileShopUpdate = () => {
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shopProfile, setShopProfile] = useState({});

  useEffect(() => {
    (async () => {
      const result = await ShopProfileService.getShopProfileBySellerId(
        sellerId
      );
      const profile = result.data;
      setShopProfile(profile);
      setName(profile.name);
      setAddress(profile.address);
      setSelectedImage(profile.image); // Assuming `profile.image` is a URL, not a file.
      setPhone(profile.phone);
      setEmail(profile.email);
    })();
  }, [load, sellerId]);
  const SaveShopProfile = (event) => {
    event.preventDefault();

    try {
      const image = document.getElementById("imageFeedback");
      var addProduct = new FormData();

      addProduct.append("id_seller", sellerId);
      addProduct.append("name", name);
      addProduct.append("address", address);
      addProduct.append("email", email);
      addProduct.append("phone", phone);
      if (selectedImage !== null) {
        addProduct.append("image", image.files.length === 0 ? selectedImage : image.files[0]);
      }

      (async () => {
        const resultProduct = await ShopProfileService.updateshop(
          shopProfile.id,
          addProduct
        );
        console.log(resultProduct);
      })();
    } catch (error) {}
  };
  return (
    <div className="col-md-12 mt-3">
      <div className="d-flex flex-row mx-auto justify-content-center">
        <div className="p-2 me-3 my-auto">
          <h5>
            <Link to="" className="colorshopee">
              Thông tin cơ bản
            </Link>
          </h5>
          <div
            className="mt-4 colorshopee fw-bold"
            style={{ borderTop: "3px solid" }}
          />
        </div>
      </div>
      <div
        className="row border mt-4 rounded-4"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="col-md-8 mt-5 d-flex flex-row">
          <div className="p-2">Thông tin cơ bản</div>
        </div>
        <div className="col-md-4 d-flex flex-row-reverse mt-5">
          <div className="p-2">
            <button
              type="button"
              className="btn btn-outline-dark mb-4"
              style={{ fontSize: 14 }}
            >
              Chỉnh sửa
            </button>
          </div>
          <div className="p-2">
            <Link
              to={`/shop/${shopProfile.id}`}
              className="btn btn-outline-dark mb-4"
              style={{ fontSize: 14 }}
            >
              Xem Shop của tôi
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-7">
            <div className="d-flex flex-column mb-3">
              <div className="p-2 d-flex flex-row">
                <div className="p-2">Tên Shop</div>
                <div className="p-2 ms-3">
                  <input
                    type="text"
                    className="form-control border"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: 400,
                      fontSize: 14,
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-35px" }}>
                  Logo của Shop
                </div>
                <div className="p-2 ms-3 my-auto">
                  <div className="Y5ceMw ">
                    {selectedImage && (
                      <div>
                        <img
                          alt="not found"
                          style={{ width: 96, height: 96 }}
                          className="me-3 z-2 rounded-circle"
                          src={
                            typeof selectedImage === "string"
                              ? `${urlImage}shopprofile/${selectedImage}`
                              : URL.createObjectURL(selectedImage)
                          }
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
                      <span className="BiwStw">Sửa</span>
                      <input
                        className="mXvRBf"
                        type="file"
                        id="imageFeedback"
                        name="myImage"
                        onChange={(event) => {
                          console.log(event.target.files[0]);
                          setSelectedImage(event.target.files[0]);
                        }}
                        accept="image/*"
                      />
                    </label>
                    <div
                      className="_Y1LWz"
                      style={{
                        backgroundImage: 'url("")',
                        border: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-20px" }}>
                  Địa chỉ Shop
                </div>
                <div className="p-2 ms-3">
                  <input
                    type="text"
                    className="form-control border"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: 400,
                      fontSize: 14,
                    }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-23px" }}>
                  Địa chỉ Email
                </div>
                <div className="p-2 ms-3">
                  <input
                    type="text"
                    className="form-control border"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: 400,
                      fontSize: 14,
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-23px" }}>
                  Số điện thoại
                </div>
                <div className="p-2 ms-3">
                  <input
                    type="text"
                    className="form-control border"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: 400,
                      fontSize: 14,
                    }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div class="d-flex flex-row mt-2">
                <div class="p-2" style={{ marginLeft: 100 }}>
                  {" "}
                  <button
                    type="button"
                    style={{ fontSize: 14, width: 50 }}
                    className="btn btn-danger mb-4 mt-2"
                    onClick={SaveShopProfile}
                  >
                    Lưu
                  </button>
                </div>
                
              </div>
            </div>
          </div>
          <div className="col-md-3" />
        </div>
      </div>
    </div>
  );
};

export default ProfileShopUpdate;
