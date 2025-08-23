import React from "react";
import ProductList from "../components/ProductList";

const Dashboard = () => (
  <div className="container mx-auto py-8">
    <h2 className="text-3xl font-bold mb-6">Welcome to the Store!</h2>
    <ProductList />
  </div>
);

export default Dashboard;
