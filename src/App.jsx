import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CurrencyWidget from "./components/CurrencyWidget";

// Pages
import Home from "./pages/Home";
import ExplorePackages from "./pages/ExplorePackages";
import TripPlanner from "./pages/TripPlanner";
import TravelMap from "./pages/TravelMap";
import BookingDashboard from "./pages/BookingDashboard";
import Reviews from "./pages/Reviews";
import RulesHub from "./pages/RulesHub";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { useApp } from "./context/AppContext";

// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to={allowedRoles.includes("admin") ? "/admin-login" : "/login"} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return element;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/packages" element={<ExplorePackages />} />
      <Route path="/planner" element={<TripPlanner />} />
      <Route path="/map" element={<TravelMap />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/rules" element={<RulesHub />} />
      <Route path="/about" element={<About />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* User Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<BookingDashboard />} allowedRoles={["user"]} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["user"]} />} />
      <Route path="/wishlist" element={<ProtectedRoute element={<Wishlist />} allowedRoles={["user"]} />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
    </Routes>
  );
}
function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          {/* Header Glass Navbar */}
          <Navbar />
          
          {/* Core Page content wrapper */}
          <main className="flex-grow">
            <AppRoutes />
          </main>

          {/* Floaters and Widgets */}
          <CurrencyWidget />

          {/* Footer details */}
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
}



export default App;
