import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          {/* Header Glass Navbar */}
          <Navbar />
          
          {/* Core Page content wrapper */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<ExplorePackages />} />
              <Route path="/planner" element={<TripPlanner />} />
              <Route path="/map" element={<TravelMap />} />
              <Route path="/dashboard" element={<BookingDashboard />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/rules" element={<RulesHub />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
            </Routes>
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
