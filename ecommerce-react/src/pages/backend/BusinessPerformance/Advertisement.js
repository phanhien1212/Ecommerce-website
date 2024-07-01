import { useEffect, useState } from "react";
import AdvertisingCampaignService from "../../../service/AdvertisingCampaignsService";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import UserService from "../../../service/UserService";
import ShopProfileService from "../../../service/ShopProfileService";

const AdvertisementAdmin = () => {
  const [load, setLoad] = useState(Date.now());
  const [ads, setAds] = useState([]);
  const [avenues, setAvenues] = useState([]);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API để lấy ads
      const resultAds = await AdvertisingCampaignService.getAllAd();
      setAds(resultAds.data);
      console.log(resultAds.data);
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect
  }, [load]);
  useEffect(() => {
    const fetchData = async () => {
      // Gọi API để lấy ads
      const result = await UserService.getUsers();
      setUsers(result.data);
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect
  }, [load]);
  useEffect(() => {
    const fetchData = async () => {
      // Gọi API để lấy ads
      const result = await ShopProfileService.getShopProfile();
      setShops(result.data);
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect
  }, [load]);
  useEffect(() => {
    const fetchData = async () => {
      // Gọi API để lấy ads
      const result = await AdvertisingCampaignService.getAvenue();
      setAvenues(result.data);
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect
  }, [load]);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <div>
      <section className="content-header my-2 mt-3 mb-4">
        <h1 className="d-inline">Thống kê số liệu quảng cáo sàn</h1>
      </section>
      <section className="content-body my-2">
        <table className="table mb-5  mt-3">
          <thead className>
            <tr className="table-secondary">
              <th scope="col">
                <input type="checkbox" id="checkboxAll" />
              </th>
              <th>ID</th>
              <th scope="col" width={300}>
                Sản phẩm/Từ khóa
              </th>
              <th scope="col" width={300}>
                Nhà bán hàng/Tên shop
              </th>
              <th scope="col" >
                Số dư tài khoản
                <br />
                <span className="small">(Quảng cáo)</span>
              </th>

              <th scope="col">
                Giá thầu <br />
                <span className="small">(Mỗi lượt click)</span>
              </th>
              <th scope="col">
                Doanh thu <br />
                <span className="small">(Nhà bán hàng)</span>{" "}
              </th>
              <th scope="col">
                Doanh thu <br />
                <span className="small">(Doanh thu sàn)</span>{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr>
                <td></td>
                <td>{ad.ad_campaign_id}</td>
                <td>
                  <div class="d-flex flex-column">
                    <div class="p-2 d-flex flex-row">
                      {" "}
                      <div class="p-2">
                        {" "}
                        <img
                          className="img-fluid"
                          style={{ width: 130 }}
                          src={urlImage + "product/" + ad.product_image}
                          alt="product.jpg"
                        />
                      </div>
                      <div class="p-2">
                        {" "}
                        <Link>{ad.name_product}</Link>
                      </div>
                    </div>
                    <div class="p-2  d-flex flex-row">
                      {" "}
                      <div class="p-2">
                        {" "}
                        <span>Keyword</span>
                      </div>
                      <div class="p-2">
                        {" "}
                        <Link className="bg-info-subtle">{ad.keyword}</Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <div class="p-2 d-flex flex-row">
                      {" "}
                      <div class="p-2">
                        <span>Nhà bán hàng</span>
                      </div>
                      <div class="p-2">
                        {" "}
                        <Link>
                          {" "}
                          {users
                            .filter((user) => user.id === ad.seller_id)
                            .map((user) => user.username)
                            .join("") || ""}
                        </Link>
                      </div>
                    </div>
                    <div class="p-2  d-flex flex-row">
                      {" "}
                      <div class="p-2">
                        {" "}
                        <span>Tên shop</span>
                      </div>
                      <div class="p-2">
                        {" "}
                        <Link className="bg-info-subtle">
                          {shops
                            .filter((user) => user.idSeller === ad.seller_id)
                            .map((user) => user.name)
                            .join("") || ""}
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td>{formatPrice(ad.budget, 10)}</td>
                <td>{formatPrice(ad.bid_price, 10)}</td>
                <td>
                  {" "}
                  {formatPrice(
                    parseInt(
                      avenues
                        .filter((av) => av.ad_campaign_id === ad.ad_campaign_id)
                        .map((av) => av.total_amount)
                        .join("") || "0"
                    ) || 0
                  )}
                </td>
                <td>{formatPrice(ad.clicks * ad.bid_price)}</td>
                {/* <td>{formatPrice(ad.clicks * ad.bid_price)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdvertisementAdmin;
