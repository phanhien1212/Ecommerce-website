import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdvertisingAccountService from "./../../service/AdvertisingAccountService";

const style = { layout: "horizontal" };

const ButtonWrapper = ({ showSpinner, totalAmount, orderId }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const navigate = useNavigate();
  const sellerId = localStorage.getItem("userId");

  const handleApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      alert("Transaction completed by " + details.payer.name.given_name);

      // Send transaction data to the server to save in transactions table
      const transactionData = {
        order_id: orderId,
        amount: details.purchase_units[0].amount.value,
        payment_method: "PayPal",
      };
      const response = await fetch("http://localhost:8080/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction data");
      }

      // Add advertisement account after successful transaction data save
      const addAdvertisementAccount = new FormData();
      addAdvertisementAccount.append("user_id", parseInt(sellerId)); // Assuming sellerId is defined somewhere
      addAdvertisementAccount.append("balance", totalAmount);
      const result = await AdvertisingAccountService.addAdAccount(
        addAdvertisementAccount
      );

      // Redirect to another page
      alert("/success"); // Redirect to success page after successful transaction
      navigate("/seller/marketing/advertisement");
    } catch (error) {
      console.error("Error processing transaction:", error);
      // Handle error here
    }
  };
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
        onApprove={handleApprove}
        onError={(err) => console.error("PayPal error:", err)} // Handle PayPal errors
      />
    </>
  );
};

export default function PaypalAdvertising({ totalAmount, orderId }) {
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
