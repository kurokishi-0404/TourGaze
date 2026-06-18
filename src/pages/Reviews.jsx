import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiStar, FiMessageSquare, FiPlus, FiThumbsUp, FiCheckCircle } from "react-icons/fi";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

const Reviews = () => {
  const { reviews, addReview, packages } = useApp();

  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formDest, setFormDest] = useState("Paris, France");
  const [formText, setFormText] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Compile Chart data (Average reviews per destination)
  const chartData = [
    { name: "Tokyo", rating: 4.9 },
    { name: "Paris", rating: 4.8 },
    { name: "Rome", rating: 4.7 },
    { name: "Bali", rating: 4.6 },
    { name: "Dubai", rating: 4.7 },
    { name: "Swiss", rating: 4.8 }
  ];

  // Calculate Average Rating
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formText) return;

    addReview({
      user: formName,
      rating: formRating,
      comment: formText,
      destination: formDest,
      packageName: formDest.split(",")[0] + " Highlights"
    });

    setFormName("");
    setFormText("");
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const colors = ["#3b82f6", "#10b981", "#3b82f6", "#10b981", "#3b82f6", "#10b981"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
      {/* Page Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Traveler Review Hub</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Hear from international explorers, check destination statistics, and share your own adventures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Overview statistics & Chart */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Rating Breakdown card */}
          <div className="glass-card p-6 border border-white/50 shadow-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Rating Breakdown</h4>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-slate-800">{averageRating}</p>
                <div className="flex items-center justify-center text-amber-500 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(Number(averageRating)) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">Based on {reviews.length} reviews</p>
              </div>

              {/* Progress bars distribution */}
              <div className="flex-1 space-y-1.5 text-[10px] text-slate-500 font-semibold">
                {[
                  { stars: 5, pct: "75%" },
                  { stars: 4, pct: "18%" },
                  { stars: 3, pct: "5%" },
                  { stars: 2, pct: "2%" },
                  { stars: 1, pct: "0%" }
                ].map((row) => (
                  <div key={row.stars} className="flex items-center space-x-2">
                    <span className="w-3 shrink-0">{row.stars}★</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: row.pct }}></div>
                    </div>
                    <span className="w-6 text-right shrink-0">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Analytics chart card */}
          <div className="glass-card p-5 border border-white/50 shadow-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Destination Popularity Analysis</h4>
            
            <div className="w-full h-56 text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                  <YAxis domain={[4, 5]} stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      fontSize: "10.5px"
                    }}
                  />
                  <Bar dataKey="rating" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-slate-400 text-center">Average traveler satisfaction rating index (Scale 1.0 - 5.0)</p>
          </div>

          {/* Submit form */}
          <div className="glass-card p-6 border border-white/50 shadow-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Write a Review</h4>
            
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Destination Visited</label>
                  <select
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Paris, France">Paris, France</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                    <option value="Dubai, UAE">Dubai, UAE</option>
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="Rome, Italy">Rome, Italy</option>
                    <option value="London, UK">London, UK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Star Rating</label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setFormRating(stars)}
                      className="p-1 rounded transition text-amber-400 hover:scale-110"
                    >
                      <FiStar className={`w-6 h-6 ${stars <= formRating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Review Comments</label>
                <textarea
                  required
                  rows={3}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Share details of your travel experience..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700"
                ></textarea>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2">
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                  <span className="font-bold text-[10px]">Review Submitted! Thanks for sharing feedback.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-sm"
              >
                Submit Feedback
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: Review Feed cards */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <FiMessageSquare className="w-4 h-4 text-blue-600" />
            <span>Community Feed</span>
          </h3>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-card p-5 border border-white/50 shadow-md space-y-3.5 relative"
              >
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.user}
                      className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-blue-500/15"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{rev.user}</p>
                      <p className="text-[10px] text-slate-400">{rev.date} • Visited {rev.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0.5 text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg font-bold text-[10px]">
                    <span>{rev.rating}</span>
                    <FiStar className="w-3 h-3 fill-current shrink-0" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100/50 text-[10px] text-slate-400 font-bold">
                  <span>Verified Traveler</span>
                  <button className="flex items-center space-x-1 hover:text-blue-600 transition">
                    <FiThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Reviews;
