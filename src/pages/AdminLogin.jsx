import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FiLock, FiAlertCircle, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { adminLogin } = useApp();
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!adminId.trim()) {
      setError("Please enter a valid Admin ID.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    adminLogin(adminId, password);
    navigate("/admin");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-12 px-4 relative bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/5 via-blue-900/5 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl p-8 relative z-10 text-xs"
      >
        <div className="text-center space-y-2 mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-2 shadow-sm">
            <FiShield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Travel Operations Portal</h2>
          <p className="text-xs text-slate-500 font-semibold">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 mb-4">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold text-[10px]">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin ID */}
          <div>
            <label htmlFor="admin-id" className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Admin ID</label>
            <div className="relative flex items-center">
              <FiShield className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                id="admin-id"
                type="text"
                required
                placeholder="e.g. ADM-101"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="admin-password" className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Admin Password</label>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                id="admin-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-center shadow-md transition mt-2"
          >
            Access Portal
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-semibold">
          Return to <Link to="/" className="text-slate-600 hover:underline">Public Site</Link>
        </p>

      </motion.div>
    </div>
  );
};

export default AdminLogin;
