import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-semibold capitalize">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Delivery Address: {order.deliveryAddress}
                  </p>
                </div>
                <p className="text-xl font-bold text-green-600">
                  Total: $
                  {order.products
                    .reduce(
                      (total, item) =>
                        total + (item.product?.price || 0) * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Order Items:</h4>
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <span>
                      {item.productId?.name || "Product"} x {item.quantity}
                      <span className="text-gray-600">
                        (${(item.productId?.price * item.quantity).toFixed(2)})
                      </span>
                    </span>
                    <span>
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
