import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Paypal from "../../frontend/PayPal";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import UserService from "../../../service/UserService";
import OrderService from "../../../service/OrderService";

const CheckoutTopUp = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const productid = searchParams.get("productid");
  const storedUserId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  useEffect(() => {
    (async () => {
      const result = await ProductService.getById(parseInt(productid));
      setProduct(result.data);
      if (storedUserId !== null) {
        const result = await UserService.getById(parseInt(storedUserId));
        setUser(result.data);
      }
    })();
  }, [product, productid]);
  const handleCheckout = async () => {
    const newOrder = {
      deliveryName: user.firstname + " " + user.lastname, // Sửa lại thành userData.lastname
      deliveryEmail: user.email,
      deliveryPhone: user.phone,
      deliveryAddress: user.address,
      note: "Nạp tiền Quảng Cáo",
      user_id: user.id,
      total: product.price,
      status: 0, // Giả sử status của đơn hàng mới là 1
    };
    const responseOrder = await OrderService.storeorder(newOrder);

    // Lấy id của đơn hàng mới tạo
    const orderId = responseOrder.data.id;
    const newOrderDetail = {
      orderId: orderId,
      productId: product.id,
      qty: 1,
      amount: product.price,
      price: product.price,
      status: 0,
      attribute: "",
      note: "",
    };
    const resultOrderDetail = await OrderService.storeorderdetail(
      newOrderDetail
    );
    navigate(
      `/seller/marketing/paypalseller?productid=${product.id}&orderid=${orderId}`
    );
  };
  return (
    <div>
      <div className="row border rounded-2 mt-4 f6f6f6 ">
        <div class="d-flex flex-column mb-3">
          <div class="p-2">
            <p class="fs-3 fw-bolder">Thanh toán</p>
            <p class="fw-bolder">Sản phẩm đã đặt hàng</p>
          </div>
          <div class="p-2 d-flex mb-5 border rounded">
            <div class="p-2">
              <img
                src="https://cf.shopee.vn/file/0087609eda2c790feb13b0c83310e173_tn"
                alt="..."
              />
            </div>
            <div class="p-2 d-flex align-items-center">
              <p class="fs-5">
                Stressmama Ads - <span>{product.price}</span> Nạp tiền
              </p>
            </div>
            <div class="ms-auto p-2 d-flex align-items-center">
              <p>
                Giá sản phẩm: <span>{product.price}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleCheckout} className="btn btn-danger mt-2">
        Thanh toán
      </button>
    </div>
  );
};

export default CheckoutTopUp;
