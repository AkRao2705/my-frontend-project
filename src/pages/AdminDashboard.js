import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const updatedData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        stockQuantity: parseInt(editFormData.stockQuantity),
      };

      await axiosInstance.put(`/products/${id}`, updatedData);
      setEditingProduct(null);
      fetchProducts(); // Refresh the product list
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/add-product")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          ➕ Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border-2 border-gray-200 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition"
          >
            {editingProduct === product._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Product Name"
                />
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Price"
                />
                <input
                  type="number"
                  name="stockQuantity"
                  value={editFormData.stockQuantity}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Stock Quantity"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSubmit(product._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-600 mb-2">{product.description}</p>
                )}
                <p className="text-blue-600 font-semibold text-lg mb-2">
                  ${product.price}
                </p>
                <p className="text-gray-600 mb-4">
                  Stock: {product.stockQuantity}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found.</p>
          <p className="text-blue-600">
            Add your first product to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
