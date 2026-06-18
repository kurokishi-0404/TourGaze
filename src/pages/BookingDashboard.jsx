import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiBriefcase, FiCalendar, FiCornerUpLeft, FiArrowRight, FiEdit3, FiCheck, FiX, FiMapPin, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const BookingDashboard = () => {
  const { bookings, bookingHistory, updateBooking, undoBookingChange, cancelBooking, formatPrice } = useApp();
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
    updateBooking(bookingId, { travelDate: editDate, hotel: editHotel });
    setEditingBookingId(null);
  };

  const handleAdvanceStatus = (bk) => {
    const currentIndex = getStatusIndex(bk.status);
    if (currentIndex < statusSteps.length - 1) {
      updateBooking(bk.id, { status: statusSteps[currentIndex + 1] });
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
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">Track reservation status, modify details, and manage your trips.</p>
      </div>

      {/* Reservations */}
      <div className="space-y-6">
        {bookings.map((bk) => {
          const isEditing = editingBookingId === bk.id;
          const hasHistory = (bookingHistory[bk.id] || []).length > 0;
          const statusIdx = getStatusIndex(bk.status);

          return (
            <motion.div
              key={bk.id}
              layout
              className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Destination Banner */}
              <div className="relative h-44 sm:h-48">
                <img src={bk.image} alt={bk.packageName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Overlay Info */}
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div className="text-white">
                    <h3 className="text-lg font-bold leading-tight">{bk.packageName}</h3>
                    <div className="flex items-center space-x-3 mt-1.5 text-[12px] text-white/80">
                      <span className="flex items-center space-x-1"><FiMapPin className="w-3 h-3" /><span>{bk.stops?.join(" → ") || "—"}</span></span>
                    </div>
                  </div>
                  <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/20">
                    {bk.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-6">

                {/* Meta Row */}
                <div className="flex flex-wrap gap-4 text-[13px]">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <FiHome className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{bk.hotel}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <FiCalendar className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{bk.travelDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <FiBriefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{bk.duration} • {bk.travelers} traveler(s)</span>
                  </div>
                  <div className="ml-auto text-base font-bold text-blue-600">
                    {formatPrice(bk.price)}
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-4">Booking Progress</p>
                  <div className="relative flex items-center justify-between">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 top-4 h-[3px] bg-slate-100 rounded pointer-events-none"></div>
                    {/* Progress fill */}
                    <div
                      className="absolute left-0 top-4 h-[3px] bg-gradient-to-r from-blue-500 to-emerald-500 rounded transition-all duration-700 pointer-events-none"
                      style={{ width: `${(statusIdx / (statusSteps.length - 1)) * 100}%` }}
                    ></div>

                    {statusSteps.map((step, idx) => {
                      const isDone = idx <= statusIdx;
                      const isCurrent = idx === statusIdx;
                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[11px] font-bold ${
                            isCurrent
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                              : isDone
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}>
                            {isDone ? <FiCheck className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] mt-2 font-semibold text-center max-w-[70px] leading-tight ${
                            isCurrent ? "text-blue-600" : isDone ? "text-slate-700" : "text-slate-400"
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  {hasHistory && (
                    <button
                      onClick={() => undoBookingChange(bk.id)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-[12px] font-semibold text-amber-700 transition"
                    >
                      <FiCornerUpLeft className="w-3.5 h-3.5" />
                      <span>Undo Change</span>
                    </button>
                  )}

                  {statusIdx < statusSteps.length - 1 && (
                    <button
                      onClick={() => handleAdvanceStatus(bk)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[12px] font-semibold transition"
                    >
                      <span>Advance Status</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!isEditing && (
                    <>
                      <button
                        onClick={() => handleStartEditing(bk)}
                        className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[12px] font-semibold transition"
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Cancel this reservation?")) cancelBooking(bk.id);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[12px] font-semibold transition ml-auto"
                      >
                        <FiX className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Edit Panel */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-slate-100 pt-5 space-y-4"
                    >
                      <h5 className="text-[13px] font-bold text-slate-700">Modify Reservation</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase font-semibold text-slate-500 block mb-1.5">Travel Date</label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] uppercase font-semibold text-slate-500 block mb-1.5">Hotel</label>
                          <select
                            value={editHotel}
                            onChange={(e) => setEditHotel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-[13px] font-medium text-slate-700 focus:outline-none"
                          >
                            {(hotelOptionsList[bk.packageId] || [bk.hotel]).map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => setEditingBookingId(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg">
                          Cancel
                        </button>
                        <button onClick={() => handleSaveEdit(bk.id)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold rounded-lg shadow-sm">
                          Save Changes
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="bg-white border border-slate-200/60 rounded-xl p-16 text-center">
            <FiBriefcase className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-base font-bold text-slate-600">No active bookings</p>
            <p className="text-sm text-slate-400 mt-1">Head over to Explore Packages to book your next trip.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;
