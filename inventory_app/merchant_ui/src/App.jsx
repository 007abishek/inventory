import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Route, Routes } from 'react-router-dom';


import DummyPage from './pages/DummyPage/DummyPage'; 
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductHome from './pages/ProductHome/ProductHome';
import CreateProduct from './pages/CreateProduct/CreateProduct';
import Sales from './pages/Sales/Sales';
import Reports from './pages/Reports/Reports';

import SalesReport from './components/SalesReport/SalesReport';
import TrendingProducts from './components/TrendingProducts/TrendingProducts';
import StockAnalysis from './components/StockAnalysis/StockAnalysis';
import RevenueDashboard from './components/RevenueDashboard/RevenueDashboard';

import AI_Chatbox from './pages/AI_Chatbox/AI_Chatbox';

const App = () => {
  return (
    <>
      <ToastContainer />

      <div className="app">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/product-home" element={<ProductHome />} />
            <Route path="/create-product" element={<CreateProduct />} />

            <Route path="/sales" element={<Sales />} />

            <Route path="/reports" element={<Reports />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route path="/trending-products" element={<TrendingProducts />} />
            <Route path="/stock-analysis" element={<StockAnalysis />} />
            <Route path="/revenue-dashboard" element={<RevenueDashboard />} />

            <Route path="/chatbot" element={<AI_Chatbox />} />

            <Route path="/dummy" element={<DummyPage />} />
          </Routes>
      </div>

    </>
  );
}

export default App;