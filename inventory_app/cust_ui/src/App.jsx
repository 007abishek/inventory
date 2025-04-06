
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Route, Routes } from 'react-router-dom';


import DummyPage from './pages/DummyPage/DummyPage'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Worker_dashboard/Worker_dashboard';
import Cart from './pages/cart/cart';
import PlaceOrder from './pages/Placeorder/Placeorder';
import MyOrders from './pages/Myorders/Myorders';
import PaymentQR from './pages/PaymentQR/PaymentQR';
import CheckoutOptions from "./pages/CheckoutOptions/CheckoutOptions";
import StripePayment from "./pages/StripePayment/StripePayment";
//import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
const App = () => {
  return (
    <>
      <ToastContainer />

      <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/payment-qr" element={<PaymentQR />} /> 
            <Route path="/dummy" element={<DummyPage />} />
            <Route path="/checkout-options" element={<CheckoutOptions />} />
            <Route path="/stripe-payment" element={<StripePayment />} />
           

         
          </Routes>
      </div>

    </>
  );
}

export default App;