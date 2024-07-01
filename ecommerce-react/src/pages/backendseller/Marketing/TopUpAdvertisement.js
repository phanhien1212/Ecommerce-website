import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../../../service/ProductService";

const TopUpAdvertisement = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await ProductService.productsellerid(6);
      setProducts(result.data);
    })();
  }, [products]);
  const [selectedTopUp, setSelectedTopUp] = useState(50000);
  const navigate = useNavigate();

  const handleTopUpChange = (event) => {
    setSelectedTopUp(event.target.value);
  };
  const handleCheckout = async () => {
    navigate(`/seller/marketing/checkouttopup?productid=${selectedTopUp}`);
  };
  return (
    <div>
      <Link
        to="/seller/marketing/advertisement"
        className="btn btn-light border"
      >
        {" "}
        Quay lại{" "}
      </Link>
      <div className="row border rounded-2 mt-4 f6f6f6 ">
        <div class="d-flex flex-column mb-3">
          <div class="p-2">
            <p className="fs-3 ">Nạp tiền</p>
          </div>
          <div class="p-2">
            <p>
              Số tiền này chỉ có thể được dùng cho dịch vụ Quảng cáo Stressmama.
              Lưu ý: Số tiền này không thể được hoàn lại với bất kỳ lý do nào.
            </p>
          </div>
          <div class="p-2 d-flex">
            {" "}
            <div class="p-2 flex-shrink-1 ">Chọn khoản tiền nạp</div>
            <div className="p-2 w-75 d-flex flex-wrap">
              {products.map((product, index) => (
                <div className="p-2" key={product.id}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="options-outlined"
                    value={product.id}
                    onChange={handleTopUpChange}
                    id={"danger-outlined-" + product.id}
                    defaultChecked={index === 0} // Chỉ đặt mặc định cho mục đầu tiên
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                    style={{ width: 220, height: 130 }}
                    htmlFor={"danger-outlined-" + product.id}
                  >
                    <h5>{product.name}</h5>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="btn btn-danger mt-2"
        style={{ marginLeft: 168 }}
      >
        Thanh toán
      </button>
    </div>
  );
};

export default TopUpAdvertisement;
