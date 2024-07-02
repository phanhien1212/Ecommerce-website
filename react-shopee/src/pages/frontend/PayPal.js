import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { layout: "horizontal" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ showSpinner, totalAmount, orderId }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const navigate = useNavigate();

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalAmount,
                  currency_code: "USD",
                },
                order_id: orderId,
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          // Capture the funds from the transaction
          return actions.order.capture().then(function (details) {
            // Show a success message to the buyer
            alert("Transaction completed by " + details.payer.name.given_name);
            // Extract total amount and payment method from the transaction details
            const totalAmount = details.purchase_units[0].amount.value;
            const paymentMethod = "PayPal"; // Assuming payment method is PayPal

            // Send total amount and payment method to the server to save in transactions table
            const transactionData = {
              order_id: orderId,
              amount: totalAmount,
              payment_method: paymentMethod,
            };

            // Send transaction data to the server
            fetch("http://localhost:8080/api/transaction", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transactionData),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Failed to save transaction data");
                }
                return response.json();
              })
              .then((data) => {
                // Transaction data saved successfully
                console.log("Transaction data saved:", data);
              })
              .catch((error) => {
                console.error("Error saving transaction data:", error);
              });
            navigate("/");
          });
        }}
      />
    </>
  );
};

export default function Paypal({ totalAmount, orderId }) {
  return (
    <div style={{ maxWidth: "760px", minHeight: "80px", width: 400 }}>
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          showSpinner={false}
          totalAmount={totalAmount}
          orderId={orderId}
        />
      </PayPalScriptProvider>
    </div>
  );
}
