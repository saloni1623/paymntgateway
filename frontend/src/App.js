
import React, { useState } from 'react';
import PayPal from './PayPal';
import "./App.css";
import Cashfree from './Cashfree';
import Payment from './Stripe/Payment';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from './Stripe';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Confirmation from './Stripe/Confirmation';
import PayUMoney from './PayUMoney';
import RazorPay from './RazorPay';
import CCAvenue from './CCAvenue';
import PhonePay from './PhonePay';
import Success from './PhonePay/Success';
const App = () => {
 
  return (
    <>
    <RazorPay/>
    <PayUMoney/> 
  <Cashfree/>
  <PayPal/>
  <CCAvenue/>
  <PhonePay/>
  <BrowserRouter>
        <Routes>
           <Route path="/" element={<Payment />} />
          <Route exact path="/completion" element={<Confirmation/>} />
          <Route exact path="/success" element={<Success/>}/>
        </Routes>
      </BrowserRouter>
    </>


  );
};

export default App;

