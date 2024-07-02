import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopProfileService from "../../../service/ShopProfileService";
import { urlImage } from "../../../config";

const ProfileShop = () => {
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  const [shopProfile, setShopProfile] = useState({});
  useEffect(() => {
    (async () => {
      const result = await ShopProfileService.getShopProfileBySellerId(
        sellerId
      );
      setShopProfile(result.data);
    })();
  }, [load, shopProfile]);
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
            <Link
            to="/seller/shop/updateshopprofile"
              type="button"
              className="btn btn-outline-dark mb-4"
              style={{ fontSize: 14 }}
            >
              Chỉnh sửa
            </Link>
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
                <div className="p-2 ms-3">{shopProfile.name}</div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-35px" }}>
                  Logo của Shop
                </div>
                <div className="p-2 ms-3">
                  <img
                    style={{ width: 96, height: 96 }}
                    className="rounded-circle"
                    src={urlImage + "shopprofile/" + shopProfile.image}
                    alt="image"
                  />
                </div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-20px" }}>
                  Địa chỉ Shop
                </div>
                <div className="p-2 ms-3">{shopProfile.address}</div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-23px" }}>
                  Địa chỉ Email
                </div>
                <div className="p-2 ms-3">{shopProfile.email}</div>
              </div>
              <div className="p-2 d-flex flex-row">
                <div className="p-2 my-auto" style={{ marginLeft: "-23px" }}>
                  Số điện thoại
                </div>
                <div className="p-2 ms-3">{shopProfile.phone}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3" />
        </div>
      </div>
    </div>
  );
};

export default ProfileShop;
