import React, { useState } from 'react';

function PaymentForm() {
  const [checksum, setChecksum] = useState('');

  const handlePayment = async () => {
    const response = await fetch('http://localhost:8080/generateChecksum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: '100.00', // Change this to the actual amount
        currency: 'INR',
        merchant_id: '2734568',
        order_id: 'ORDER123',
        redirect_url: 'http://your-redirect-url.com',
        cancel_url: 'http://your-cancel-url.com',
        language: 'EN',
      }),
    });

    const data = await response.json();
    console.log(data)
    
    setChecksum(data.checksum);

    // Create and submit a form to CCAvenue
    const form = document.createElement('form');
    form.action = 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
    form.method = 'POST';

    const fields = {
      merchant_id: '2734568',
      order_id: 'ORDER123',
      amount: '100.00', // Change this to the actual amount
      currency: 'INR',
      redirect_url: 'http://your-redirect-url.com',
      cancel_url: 'http://your-cancel-url.com',
      language: 'EN',
      checksum: checksum,
    };

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
    form.submit();
  };

  return (
    <div>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
}

export default PaymentForm;
