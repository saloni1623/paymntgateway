import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import Stripe from "./index";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");


  useEffect(() => {
    fetch("http://localhost:8080/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa")
    fetch("http://localhost:8080/create-payment-intent", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({
        amount:44,
        currency:"inr"
      }),

    }).then(async (result) => {
      console.log(result,"result")
      var { clientSecret } = await result.json();
      console.log(clientSecret)
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
    <div>
    <h5>React Stripe and the Payment Element</h5>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <Stripe/>
        </Elements>
      )}
    </div>
    
    </>
  );
}

export default Payment;