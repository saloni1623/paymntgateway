import React, { useState, useEffect } from 'react';
import PaytmPayment from 'react-paytm-checkout';

const App = () => {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Fetch the unique order ID from your server
    fetch('/generateOrderId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any necessary request payload here
    })
      .then((response) => response.json())
      .then((data) => {
        setOrderId(data.orderId);
      })
      .catch((error) => {
        console.error('Error fetching order ID:', error);
      });
  }, []);

  // Rest of your payment handling code

  return (
    <div>
      {/* Your content */}
      {orderId && (
        <PaytmPayment
          amount={100} // Amount in INR
          order_id={orderId}
          // Other Paytm parameters and callbacks
        />
      )}
    </div>
  );
};

export default App;
