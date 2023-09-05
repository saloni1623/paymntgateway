import React, { useState } from 'react';
import axios from 'axios';

const PhonePay = () => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const initiatePayment = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/initiate-payment', {
        // Provide necessary payment details here
        "merchantId":"MERCHANTUAT",
        "merchantTransactionId": "MT7850590068188104",
        "merchantUserId": "MUID123",
        "amount": 10000,
        "redirectUrl": `${window.location.href}success`,
        "redirectMode": "POST",
         "callbackUrl": `${window.location.href}success`,
        "mobileNumber": "9999999999",
        "paymentInstrument": {
          "type": "PAY_PAGE"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

console.log(response.data,"res")

    setPaymentUrl(response.data.data)

    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  return (
    <div>
      <button onClick={initiatePayment}>Pay with PhonePe</button>
      {paymentUrl && <a href={paymentUrl}>Proceed to PhonePe Payment</a>}
    </div>
  );
};

export default PhonePay;
