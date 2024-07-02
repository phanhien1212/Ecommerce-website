import { useEffect, useState } from "react";
import { urlImage } from "../../../config";
import { Link } from "react-router-dom";
import AdvertisingCampaignService from "../../../service/AdvertisingCampaignsService";
import AdvertisingAccountService from "../../../service/AdvertisingAccountService";

const QuangCao = () => {
  const [ads, setAds] = useState([]);
  const [sur, setSur] = useState({});
  const [avenues, setAvenue] = useState([]);
  const [balance, setBalance] = useState(0);
  const sellerId = localStorage.getItem("userId");
  const [load, setLoad] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      if (sellerId !== null) {
        try {
          // Gọi API để lấy ads
          const resultAds = await AdvertisingCampaignService.getAd(sellerId);
          setAds(resultAds.data);
        } catch (error) {
          console.error("Error fetching ads:", error);
          // Xử lý lỗi nếu cần
        }

        try {
          // Gọi API để lấy avenue ad
          const resultAvenue = await AdvertisingCampaignService.getAvenueAd(
            parseInt(sellerId)
          );
          if (resultAvenue.status === 404) {
            setAvenue(null);
          } else {
            setAvenue(resultAvenue.data);
          }
        } catch (error) {
          console.error("Error fetching avenue ad:", error);
          // Xử lý lỗi nếu cần
        }

        try {
          // Gọi API để lấy sur
          const resultSur = await AdvertisingAccountService.getSurByUserId(
            sellerId
          );
          setSur(resultSur.data);
          setBalance(resultSur.data.balance);
          console.log(resultSur.data);
        } catch (error) {
          console.error("Error fetching sur:", error);
          // Xử lý lỗi nếu cần
        }
      }
    };

    fetchData();
  }, [sellerId, load, sur, avenues, balance]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <div
            className="row border rounded-2 mt-4 f6f6f6 align-items-center"
            style={{ height: 100 }}
          >
            <div className="col-md-8">
              <h4 className="d-flex align-items-center">
                Quảng cáo Stressmama
              </h4>
            </div>
            <div className="col-md-4 mt-4">
              <Link
                to="/seller/marketing/createadvertisement"
                type="button"
                style={{ fontSize: 14, width: 230, height: 35 }}
                className="btn btn btn-danger mb-4 mx-auto align-items-center"
              >
                + Tạo chiến dịch mới
              </Link>
            </div>
          </div>
        </div>
        <div
          className="col-md-4 border rounded-2 ms-2 mt-4 f6f6f6"
          style={{ width: 400, height: 100 }}
        >
          <div className="row">
            <div className="col-md-7">
              <p className="colorgray small mt-3 ms-4">
                Số dư tài khoản quảng cáo
              </p>
              <p className="fs-4 ms-4">
                <span>{formatPrice(parseInt(balance))}</span>
              </p>
            </div>
            <div className="col-md-5">
              <Link
                to="/seller/marketing/topup"
                style={{ fontSize: 14, width: 145 }}
                className="btn btn-outline-danger mt-2 me-2"
              >
                Nạp tiền
              </Link>
              <button
                type="button"
                style={{ fontSize: 14, width: 145 }}
                className="btn btn-outline-dark mt-2"
              >
                Lịch sử giao dịch
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row border rounded-2 mt-4 f6f6f6 ">
        <div className="col-md-12 mt-4">
          <h5 className="mt-3 ms-2">Danh sách tất cả quảng cáo</h5>
          <div className="row">
            <div className="col-md-10">
              <div className="row mt-3 ms-1">
                <div className="col-md-3 d-inline">
                  <input
                    type="email"
                    className="form-control border"
                    id="exampleFormControlInput1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      width: 250,
                      fontSize: 14,
                    }}
                    placeholder="Nhập vào"
                  />
                </div>
                <div className="col-md-1 search-marketing">
                  <img
                    style={{ width: 20, height: "20x" }}
                    className="mt-2 ms-4"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzSO3sly0IWCKEGnLpEB86uq_TeUyU6avx2f2qIkB6dQ&s"
                    alt="eded"
                  />
                </div>
                <div className="col-md-8" />
              </div>
            </div>
            <div className="col-md-2" />
          </div>
          <table className="table mb-5 mt-4">
            <thead className>
              <tr className="table-secondary">
                <th scope="col">
                  <input type="checkbox" id="checkboxAll" />
                </th>
                <th scope="col" width={300}>
                  Sản phẩm/Từ khóa
                </th>
                <th scope="col">Số đơn hàng</th>
                <th scope="col">Số lượt xem</th>
                <th scope="col">Số lượt click</th>
                <th scope="col">Chi phí quảng cáo</th>
                <th scope="col">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr>
                  <td></td>
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
                    {avenues
                      .filter((av) => av.ad_campaign_id === ad.ad_campaign_id)
                      .map((av) => av.count_amount)
                      .join("") || ""}
                  </td>
                  <td>{ad.views}</td>
                  <td>{ad.clicks}</td>
                  <td>{formatPrice(ad.clicks * ad.bid_price)}</td>
                  <td>
                    {formatPrice(
                      parseInt(
                        avenues
                          .filter(
                            (av) => av.ad_campaign_id === ad.ad_campaign_id
                          )
                          .map((av) => av.total_amount)
                          .join("") || "0"
                      ) || 0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuangCao;
