import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      setCart(response.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      const orderData = {
        products: cart.items.map((item) => ({
          product: item.productId._id,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryAddress.trim(),
      };

      await axiosInstance.post("/orders", orderData);

      // Clear the cart after successful order
      await axiosInstance.delete("/cart");
      setCart({ items: [] });
      setDeliveryAddress("");
      alert("Order placed successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to place order");
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  if (loading) {
    return <div className="p-4">Loading cart...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🛒 Your Shopping Cart
      </h2>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <p className="text-blue-600 hover:text-blue-800">
            Start shopping to add items!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.items.map((item) => (
              <div
                key={item.productId._id}
                className="border-2 border-gray-100 rounded-xl p-6 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    {item.productId.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-lg">
                    ${item.productId.price}
                  </p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Total: ${calculateTotal().toFixed(2)}
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="deliveryAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Delivery Address
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105 font-bold text-lg"
              >
                ✅ Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
