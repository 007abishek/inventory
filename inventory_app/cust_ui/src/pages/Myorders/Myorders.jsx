import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const apiUrl = "http://localhost:5001";
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/orders/user-orders`, { customerId });
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders.");
      }
    };

    fetchOrders();
  }, [customerId]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.itemId} (Qty: {item.quantity})
                    </div>
                  ))}
                </td>
                <td>₹{order.amount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
