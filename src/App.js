import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import Products from "./pages/Products";
import Cart from "./components/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import UserOrders from "./pages/UserOrders";
import AddProduct from "./pages/AddProduct";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useContext(AuthContext);
  const isAdminResult = isAdmin();
  console.log("AdminRoute check - Token:", token, "isAdmin:", isAdminResult);
  return token && isAdminResult ? children : <Navigate to="/products" />;
};

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      {/* Navigation bar */}
      <nav className="bg-gray-100 p-4 flex justify-between items-center shadow">
        <div className="flex space-x-4">
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Cart
          </Link>
          {user && (
            <Link
              to="/orders"
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              My Orders
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name} (
              {user.role === "admin" ? "Administrator" : "Customer"})
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <UserOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
