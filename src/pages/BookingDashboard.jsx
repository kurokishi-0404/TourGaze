import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiBriefcase, FiCalendar, FiClock, FiCornerUpLeft, FiActivity, FiArrowRight, FiCheckCircle, FiEdit3, FiCheck, FiX, FiLayers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const BookingDashboard = () => {
  const { bookings, bookingHistory, updateBooking, undoBookingChange, cancelBooking, bookingQueue, formatPrice } = useApp();
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editHotel, setEditHotel] = useState("");

  const statusSteps = ["Pending", "Confirmed", "Tickets Generated", "Travel Ready", "Completed"];

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  const handleStartEditing = (bk) => {
    setEditingBookingId(bk.id);
    setEditDate(bk.travelDate);
    setEditHotel(bk.hotel);
  };

  const handleSaveEdit = (bookingId) => {
    updateBooking(bookingId, {
      travelDate: editDate,
      hotel: editHotel
    });
    setEditingBookingId(null);
  };

  // Mock progression trigger to test status tracker
  const handleAdvanceStatus = (bk) => {
    const currentIndex = getStatusIndex(bk.status);
    if (currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1];
      updateBooking(bk.id, { status: nextStatus });
    }
  };

  const hotelOptionsList = {
    "pkg-1": ["Hotel Le Bristol Paris", "Rome Luxury Suite", "The Ritz London"],
    "pkg-2": ["Park Hyatt Tokyo", "Fuji View Onsen Resort", "Kyoto Ryokan Traditional"],
    "pkg-3": ["Atlantis The Palm", "Emirates Palace Abu Dhabi"],
    "pkg-4": ["Maya Ubud Resort & Spa", "W Bali Seminyak", "Nusa Penida Eco Lodge"],
    "pkg-5": ["Schweizerhof Hotel Zurich", "Victoria Jungfrau Interlaken", "Grand Hotel Zermatterhof"],
    "pkg-6": ["The Plaza Hotel NYC", "Boston Copley Square Hotel"]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
      {/* Page Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Booking Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Track your reservations status, modify details, and simulate booking request workflows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: User's Booking list */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <FiBriefcase className="w-4 h-4 text-blue-600" />
            <span>My Active Reservations</span>
          </h3>

          <div className="space-y-6">
            {bookings.map((bk) => {
              const isEditing = editingBookingId === bk.id;
              const hasHistory = (bookingHistory[bk.id] || []).length > 0;
              const statusIdx = getStatusIndex(bk.status);

              return (
                <div
                  key={bk.id}
                  className="glass-card p-5 border border-white/50 shadow-xl space-y-6 relative overflow-hidden"
                >
                  {/* Status Overlay Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>

                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={bk.image}
                        alt={bk.packageName}
                        className="w-14 h-14 object-cover rounded-2xl shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-sm text-slate-800">{bk.packageName}</h4>
                          <span className="text-[9px] font-extrabold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                            ID: {bk.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Hotel Lodging: <span className="font-bold text-slate-600">{bk.hotel}</span></p>
                        <p className="text-[10px] text-slate-400">Travel Date: <span className="font-bold text-slate-600">{bk.travelDate}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {/* Undo Trigger */}
                      {hasHistory && (
                        <button
                          onClick={() => undoBookingChange(bk.id)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-700 flex items-center space-x-1 transition"
                          title="Restore previous booking state"
                        >
                          <FiCornerUpLeft className="w-3 h-3 shrink-0" />
                          <span>Undo Change</span>
                        </button>
                      )}

                      {/* Advance mock status trigger */}
                      {statusIdx < statusSteps.length - 1 && (
                        <button
                          onClick={() => handleAdvanceStatus(bk)}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-xl text-[10px] font-bold transition flex items-center space-x-1"
                        >
                          <span>Progress Status</span>
                          <FiArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {/* Edit toggle */}
                      {!isEditing && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEditing(bk)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                            title="Edit Reservation"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this reservation?")) {
                                cancelBooking(bk.id);
                              }
                            }}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                            title="Cancel Reservation"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VISUAL STATUS STEPPER */}
                  <div className="pt-2">
                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-4">Booking Status tracker</p>
                    <div className="relative flex items-center justify-between">
                      {/* Gray Line backdrop */}
                      <div className="absolute left-0 right-0 top-3 h-1 bg-slate-100 rounded pointer-events-none"></div>
                      
                      {/* Dynamic colored progress line */}
                      <div
                        className="absolute left-0 top-3 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded transition-all duration-500 pointer-events-none"
                        style={{ width: `${(statusIdx / (statusSteps.length - 1)) * 100}%` }}
                      ></div>

                      {/* Stepper Node Points */}
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= statusIdx;
                        const isCurrent = idx === statusIdx;

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-[9px] ${
                                isCurrent
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                  : isDone
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-slate-200 text-slate-400"
                              }`}
                            >
                              {isDone ? <FiCheck className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[8.5px] mt-1.5 font-bold transition-colors ${
                                isCurrent
                                  ? "text-blue-600"
                                  : isDone
                                  ? "text-slate-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* EDIT PANEL */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-slate-100 pt-4 mt-4 space-y-4 text-xs"
                      >
                        <h5 className="font-bold text-slate-700">Modify Reservation Details</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Adjust Date</label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Select Hotel Lodging</label>
                            <select
                              value={editHotel}
                              onChange={(e) => setEditHotel(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none"
                            >
                              {(hotelOptionsList[bk.packageId] || [bk.hotel]).map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingBookingId(null)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(bk.id)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                          >
                            Save Updates
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}

            {bookings.length === 0 && (
              <div className="bg-white/40 border border-white/40 rounded-[30px] p-12 text-center space-y-3">
                <FiBriefcase className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-600">No active bookings listed</p>
                <p className="text-xs text-slate-400">Head over to the 'Explore Packages' page to confirm a travel booking.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Admin Simulated Booking requests queue */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <FiActivity className="w-4 h-4 text-blue-600" />
            <span>Booking Queue (Admin Monitor)</span>
          </h3>

          <div className="glass-card p-5 border border-white/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Simulating live queue</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {bookingQueue.map((item) => (
                  <motion.div
                    key={item.queueId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex justify-between items-center bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">{item.user}</span>
                        <span className="text-[8px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                          {item.queueId}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.package}</p>
                    </div>

                    <span className="inline-block shrink-0 px-2 py-0.5 font-bold rounded-lg text-[9px] bg-blue-50 text-blue-700 border border-blue-200">
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <p className="text-[9px] text-slate-400 text-center leading-relaxed italic">
              Queue auto-refreshes states every 15s to simulate global reservation pipelines.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-[24px] p-5 text-center space-y-2 text-xs">
            <FiLayers className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">Undo change mechanism</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              When booking details (dates/hotels) change, old configurations are saved automatically to Local Storage. Revert configurations instantly by clicking "Undo Change".
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default BookingDashboard;
