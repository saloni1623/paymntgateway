import React, { useState } from 'react'
import axios from 'axios';
import sha512 from 'js-sha512'
function PayUMoney() {

const merchantKey = "gtKFFx"
const paymentData = {
 
   
  salt :  '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW',
  key: merchantKey,
    txnid: 'TXNID' + new Date().getTime(),
    amount: '100',
    productinfo: 'Product Information',
    firstname: 'John',
    email: 'john@example.com',
    phone: '9694993797', // Customer's phone number
    surl: 'http://localhost:3000/payment-success', // URL for successful payment response
    furl: 'http://localhost:3000/payment-failure',
    hash: '',
  };
  const {key, txnid, amount, productinfo, firstname, email,salt,surl,furl} = paymentData
  paymentData.hash = sha512(key +"|"+txnid +"|"+amount +"|"+productinfo +"|"+firstname +"|"+email +"|||||" + "||||||" + salt);
  console.log(paymentData.hash)
const handlePayment = async (e) => {
  e.preventDefault()
  
    // Create and submit a form to CCAvenue
    const form = document.createElement('form');
    form.action = 'https://test.payu.in/_payment';
    form.method = 'POST';

    const fields = paymentData;

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    return form.submit();

};

return (
  <div>
  
     
        <button onClick={handlePayment}>Proceed to PayUmoney</button>
     
  </div>
);

}
export default PayUMoney






