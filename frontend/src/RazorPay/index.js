import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function RazorPay() {
  const[orderid,setOrderid] = useState()
  useEffect(() => {
    fetch("http://localhost:8080/create-order",{
      method: "POST",
      body: JSON.stringify({
        amount:400,
        currency:"inr"
      }),

    }).then(async (r) => {
      const { id } = await r.json();
      setOrderid(id);
    });
  }, []);

    const handleSubmit = () =>{
        const options = {
            key: "rzp_test_NZo2nnA4c0RM3R",
            order_id:orderid,
            handler: function (response) {
           
              fetch("http://localhost:8080/verify-payment",{
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
              },
                body: JSON.stringify({
                  order_id : response.razorpay_order_id, 
                  payment_id :response.razorpay_payment_id,
                   signature :response.razorpay_signature
                   
                })
              }).then(response => response.json() ).then(data => {
                // Handle verification response from backend
                console.log(data);
                // You can redirect or show a success message here based on verification
            }).catch((error) =>{
                console.error('Error:', error);
              })
             
              toast.success("Payment Successfully", {
                position: toast.POSITION.TOP_RIGHT,
              });
            },
         
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
    }
  return (
    <>
    <div>
    <ToastContainer/>
    <h5>Pay your payment with RazorPay</h5>
<button onClick={()=>handleSubmit()}>Pay with Razorpay</button>
    </div>
      
    </>
  
  )
}

export default RazorPay