import React, { useEffect, useState } from "react";
import axios from "axios";
import './Sales.css'

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = "";

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
                const response = await axios.get("http://localhost:5001/api/sales/list-sales", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSales(response.data.sales);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching sales data");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Sales Records</h2>

            {loading ? (
                <p>Loading sales data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : sales.length === 0 ? (
                <p>No sales records found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">#</th>
                            <th className="border border-gray-300 p-2">Worker Name</th>
                            <th className="border border-gray-300 p-2">Items</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                            <th className="border border-gray-300 p-2">Customer</th>
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale, index) => (
                            <tr key={sale._id} className="text-center">
                                <td className="border border-gray-300 p-2">{index + 1}</td>
                                <td className="border border-gray-300 p-2">{sale.WorkerId?.name || "N/A"}</td>
                                <td className="border border-gray-300 p-2">
                                    {sale.items.map((item, i) => (
                                        <div key={i}>
                                            {item.product?.name || "Unknown"} - {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className="border border-gray-300 p-2">{sale.amount} rs</td>
                                <td className="border border-gray-300 p-2">
                                    {sale.customerDetails?.name || "Unknown"} <br />
                                    {sale.customerDetails?.phone || "No phone"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {new Date(sale.date).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {sale.payment ? "Paid" : "Pending"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Sales;
