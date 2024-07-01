import { useLocation } from "react-router-dom";
import "../../CSS/pay.css"
import Paypal from "./PayPal";
import currency from "currency.js";
const Pay = () => {
    const location = useLocation();
    const totalAmount = location.state && location.state.totalAmount;
    const orderId = location.state && location.state.orderId;
    return (
        <div className="MLjMtm">
            <div className="PqkxPv">
               <Paypal totalAmount={totalAmount} orderId={orderId}/>
            </div>
            <div className="IF2Mgv">
                <span className="fjn3Do">
                    Tổng số tiền :
                </span>
                <span className="tm4IS3">
                    
                    <span className="S2dTSp">
                        {currency(totalAmount, { separator: '.', decimal: ',', symbol: '' }).format()}₫
                    </span>
                </span>
            </div>
            
        </div>

    );
}

export default Pay;