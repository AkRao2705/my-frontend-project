import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "../api/axiosInstance";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
      } catch (err) {
        alert("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMin = minPrice === "" || product.price >= parseFloat(minPrice);
    const matchesMax = maxPrice === "" || product.price <= parseFloat(maxPrice);
    return matchesSearch && matchesMin && matchesMax;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/6 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/6 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-gray-500">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-lg text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
