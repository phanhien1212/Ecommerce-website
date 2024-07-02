import currency from "currency.js";
import Paypal from "../../frontend/PayPal";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";
import PaypalAdvertising from "../../frontend/PayPalAdvertising";

const PayPalSeller = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const productid = searchParams.get("productid");
  const orderid = searchParams.get("orderid");
  const [product, setProduct] = useState({});
  useEffect(() => {
    (async () => {
      const result = await ProductService.getById(parseInt(productid));
      setProduct(result.data);
    })();
  }, [product, productid]);
  return (
    <div className="MLjMtm">
      <div className="PqkxPv">
        <PaypalAdvertising totalAmount={product.price} orderId={parseInt(orderid)} />
      </div>
      <div className="IF2Mgv">
        <span className="fjn3Do">Tổng số tiền :</span>
        <span className="tm4IS3">
          <span className="S2dTSp">
            {currency(product.price, {
              separator: ".",
              decimal: ",",
              symbol: "",
            }).format()}
            ₫
          </span>
        </span>
      </div>
    </div>
  );
};

export default PayPalSeller;
