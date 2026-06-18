import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (phone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    signup(fullName, email, phone, password);
    navigate("/profile");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-emerald-500/5 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/60 border border-white/50 shadow-2xl rounded-3xl p-8 backdrop-blur-lg relative z-10 text-xs"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-xs text-slate-400 font-semibold">Join TourGaze today and unlock optimized travel scheduling benefits.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 mb-4">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold text-[10px]">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Phone Number</label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="tel"
                required
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Password</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Confirm Password</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-md transition mt-2"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-[10px] text-slate-500 mt-6 font-bold">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Signup;
