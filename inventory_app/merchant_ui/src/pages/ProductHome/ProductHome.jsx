import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./producthome.css";

const api = axios.create({
  baseURL: "https://inventory-backend-buxd.onrender.com",
  withCredentials: true,
});

const ProductHome = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const { data } = await api.get("/api/products/merchant", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      if (err.response?.status === 403) {
        alert("Session expired, please login again.");
        navigate("/");
      }
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.patch(
        `/api/products/${editingProduct._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.map((product) => (product._id === editingProduct._id ? data : product)));
      setEditingProduct(null);
      setFormData({ name: "", category: "", quantity: "", price: "", description: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="product-home">
      <div className="header">
        <button className="create-product-btn" onClick={() => navigate("/create-product")}>
          Create Product
        </button>
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>
      {error && <p className="error">{error}</p>}
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>{`$${product.price.toFixed(2)}`}</td>
                  <td>{product.description}</td>
                  <td>
                    <button onClick={() => startEditing(product)}>Edit</button>
                    <button onClick={() => deleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingProduct && (
        <div className="edit-modal">
          <h2>Edit Product</h2>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" />
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" />
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description"></textarea>
          <button onClick={updateProduct}>Update Product</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ProductHome;
