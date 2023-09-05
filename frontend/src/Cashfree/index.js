import React, { useState } from 'react';
import axios from 'axios';

const Cashfree = () => {
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
    const handlePayment = async (e) => {
      e.preventDefault()
      try {
        const response = await axios.post('http://localhost:8080/api/payment', {
        
            "order_id": "order_1626945143520",
            "order_amount": 100,
            "order_currency": "INR",
            "order_note": "Additional order info",
            "customer_details": {
             "customer_id": "12345",
              "customer_name": "name",
              "customer_email": "care@cashfree.com",
              "customer_phone": "9816512345"
          
          }
        });
  
        const { data } = response;
     console.log(response)
        // Redirect the user to the Cashfree payment page
      window.location.href= response.data.paymentLink
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <>
      <div>
      <h5>Pay your payment with cashfree</h5>
      <button onClick={(e)=>handlePayment(e)} style={{marginBottom:'8px'}}>
      Pay with Cashfree</button>
      </div>
      
      </>
     
    );
  };

  // Replace with your server-side API endpoint
  // const serverApiEndpoint = 'http://localhost:5000';

  //   const [orderId, setOrderId] = useState('');
  //   const [orderAmount, setOrderAmount] = useState('');
  
  //   const handlePayment = async () => {
  //     try {
  //       const response = await axios.post(`${serverApiEndpoint}/createOrder`, {
  //         orderId,
  //         orderAmount,
  //         // Other order data if required
  //       });
  
  //       const { data } = response.data;
  
  //       // Redirect the user to the Cashfree payment page
  //       window.location.href = data.paymentUrl;
  //     } catch (error) {
  //       console.error(error.response.data);
  //       // Handle error scenario
  //     }
  //   };
  
  //   return (
  //     <div>
  //       <h1>Cashfree Integration</h1>
  //       <label>Order ID:</label>
  //       <input
  //         type="text"
  //         value={orderId}
  //         onChange={(e) => setOrderId(e.target.value)}
  //       />
  //       <label>Order Amount:</label>
  //       <input
  //         type="text"
  //         value={orderAmount}
  //         onChange={(e) => setOrderAmount(e.target.value)}
  //       />
  //       <button onClick={handlePayment}>Proceed to Payment</button>
  //     </div>
  //   );
  // };
  

  

export default Cashfree;





