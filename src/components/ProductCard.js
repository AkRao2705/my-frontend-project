import React from "react";
import axiosInstance from "../api/axiosInstance";

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await axiosInstance.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add to cart");
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 m-4 w-full max-w-xs min-h-[320px]">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-2xl font-semibold text-blue-600 mb-4">
          ${product.price}
        </p>
        {product.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {product.description}
          </p>
        )}
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-auto w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-md"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
