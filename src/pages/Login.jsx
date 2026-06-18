import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    login(email, password);
    navigate("/profile");
  };

  const handleGoogleLogin = () => {
    login("explorer.demo@gmail.com", "google-sso-bypass");
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
          <h2 className="text-2xl font-extrabold text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-semibold">Sign in to manage your active bookings and custom routes.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 mb-4">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold text-[10px]">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Password</label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[9px] font-bold text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-md transition mt-2"
          >
            Log In
          </button>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full absolute"></div>
            <span className="bg-white/90 px-3 relative z-10 text-[9px] uppercase font-bold text-slate-400">Or continue with</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <FaGoogle className="w-3.5 h-3.5 text-red-500" />
            <span>Continue with Google</span>
          </button>

        </form>

        <p className="text-center text-[10px] text-slate-500 mt-6 font-bold">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;
