import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  FiGrid, FiLayers, FiCheckSquare, FiUsers, FiSearch,
  FiCheckCircle, FiXCircle, FiTrendingUp, FiMap, FiCalendar,
  FiFilter, FiChevronDown, FiStar, FiPhone, FiGlobe, FiAward,
  FiClock, FiAlertCircle, FiMenu, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mock Data ───────────────────────────────────────────────────────

const mockPasses = [
  { id: "PASS-1029", bookingId: "bk-101", name: "Vikram Sen", destination: "Tokyo", travelDate: "Aug 10, 2026", package: "Tokyo & Kyoto Wonders", passport: "Verified", visa: "E-Visa Approved", status: "Confirmed" },
  { id: "PASS-8392", bookingId: "bk-102", name: "Zoe Chen", destination: "Paris", travelDate: "Jul 20, 2026", package: "European Grand Tour", passport: "Verified", visa: "Schengen Approved", status: "Confirmed" },
  { id: "PASS-4410", bookingId: "bk-103", name: "Liam Peterson", destination: "Zurich", travelDate: "Sep 5, 2026", package: "Swiss Alps & Lakes", passport: "Pending Renewal", visa: "Pending", status: "On Hold" },
  { id: "PASS-9901", bookingId: "bk-104", name: "Priyantha Kumara", destination: "Bali", travelDate: "Oct 1, 2026", package: "Bali Island Getaway", passport: "Verified", visa: "Visa on Arrival", status: "Confirmed" },
];

const mockGuides = [
  { id: 1, name: "John Doe", languages: "English", expertise: "Paris, London", rating: 5, availability: "Available", avatar: null },
  { id: 2, name: "Sarah Smith", languages: "English, French", expertise: "Paris, Rome", rating: 5, availability: "On Tour", avatar: null },
  { id: 3, name: "Akira Tanaka", languages: "Japanese, English", expertise: "Tokyo, Kyoto", rating: 4, availability: "Available", avatar: null },
  { id: 4, name: "Elena Rossi", languages: "Italian, English", expertise: "Rome, Milan", rating: 5, availability: "Available", avatar: null },
];

const initialActivities = [
  { id: 1, activity: "Louvre Museum Guided Tour", location: "Paris", guide: null },
  { id: 2, activity: "Eiffel Tower Summit Access", location: "Paris", guide: "Sarah Smith" },
  { id: 3, activity: "Mt. Fuji Guided Hiking Tour", location: "Japan", guide: null },
  { id: 4, activity: "Colosseum Underground Tour", location: "Rome", guide: null },
  { id: 5, activity: "Kyoto Tea Ceremony Experience", location: "Kyoto", guide: "Akira Tanaka" },
  { id: 6, activity: "Desert Safari with BBQ Dinner", location: "Dubai", guide: null },
];

// ─── Tab Configuration ───────────────────────────────────────────────

const TABS = [
  { key: "overview", label: "Overview", icon: FiGrid },
  { key: "queue", label: "Booking Queue", icon: FiLayers },
  { key: "verify", label: "Pass Verification", icon: FiCheckSquare },
  { key: "guides", label: "Guide Management", icon: FiUsers },
  { key: "logs", label: "Activity Logs", icon: FiAlertCircle },
];

// ─── Status Badge Component ──────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const config = {
    "Processing": "bg-blue-50 text-blue-700 border-blue-200",
    "Verifying Visa": "bg-amber-50 text-amber-700 border-amber-200",
    "Allocating Flights": "bg-purple-50 text-purple-700 border-purple-200",
    "Awaiting Payment": "bg-orange-50 text-orange-700 border-orange-200",
    "Generating Tickets": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Confirmed": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Pending": "bg-slate-50 text-slate-600 border-slate-200",
    "On Hold": "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${config[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const AdminDashboard = () => {
  const location = useLocation();
  const { bookings, activityLogs, updateBooking } = useApp();

  // Parse tab from URL query param
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab") || "overview";
    setActiveTab(tab);
  }, [location.search]);

  // ── Pass Verification State ──
  const [passQuery, setPassQuery] = useState("");
  const [passResult, setPassResult] = useState(null);
  const [passSearched, setPassSearched] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handlePassSearch = (e) => {
    e.preventDefault();
    if (!passQuery.trim()) return;
    setPassLoading(true);
    setPassSearched(false);
    setTimeout(() => {
      const q = passQuery.trim().toUpperCase();
      const result = mockPasses.find(p =>
        p.id.toUpperCase() === q ||
        p.bookingId.toUpperCase() === q
      );
      // Also check real bookings
      if (!result) {
        const bk = bookings.find(b => b.id.toUpperCase() === q);
        if (bk) {
          setPassResult({
            id: bk.id, bookingId: bk.id, name: bk.customerName || "Customer", destination: bk.stops?.[0] || bk.destination || "Multiple",
            travelDate: bk.travelDate || bk.date || "TBD", package: bk.packageName || bk.package, passport: "Verified",
            visa: "Processing", status: bk.status
          });
        } else {
          setPassResult(null);
        }
      } else {
        setPassResult(result);
      }
      setPassLoading(false);
      setPassSearched(true);
    }, 300);
  };

  // ── Guide Assignment State ──
  // Generate activities from bookings dynamically if we want them tied to bookings,
  // or just use local state for demo. The prompt says "Generate activities from user bookings".
  const derivedActivities = useMemo(() => {
    const acts = [];
    bookings.forEach(bk => {
      const stops = bk.stops || [bk.destination || "Multiple"];
      stops.forEach((stop, idx) => {
        acts.push({
          id: `${bk.id}-${idx}`,
          activity: `${stop} Tour for ${bk.customerName || "Customer"}`,
          location: stop,
          bookingId: bk.id,
          guide: bk.guideAssignments?.[stop] || null
        });
      });
    });
    return acts;
  }, [bookings]);

  const [guideFilter, setGuideFilter] = useState("");

  const handleAssignGuide = (bookingId, location, guideName) => {
    const bk = bookings.find(b => b.id === bookingId);
    if (bk) {
      updateBooking(bookingId, {
        guideAssignments: {
          ...(bk.guideAssignments || {}),
          [location]: guideName
        }
      });
    }
  };

  const filteredGuides = mockGuides.filter(g =>
    g.name.toLowerCase().includes(guideFilter.toLowerCase()) ||
    g.expertise.toLowerCase().includes(guideFilter.toLowerCase())
  );

  // ── Queue State ──
  const [queueSearch, setQueueSearch] = useState("");
  const [queueStatusFilter, setQueueStatusFilter] = useState("All");

  const filteredQueue = useMemo(() => {
    return bookings.filter(item => {
      const matchesSearch = (item.customerName || "").toLowerCase().includes(queueSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(queueSearch.toLowerCase()) ||
        (item.packageName || "").toLowerCase().includes(queueSearch.toLowerCase());
      const matchesStatus = queueStatusFilter === "All" || item.status === queueStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, queueSearch, queueStatusFilter]);

  // ── KPI Stats ──
  const totalBookings = bookings.length;
  const activeTours = bookings.filter(b => b.status === "Travel Ready" || b.status === "Confirmed" || b.status === "Tickets Generated").length;
  const pendingVerifications = mockPasses.filter(p => p.passport === "Pending Renewal" || p.visa === "Pending").length;
  const availableGuides = mockGuides.filter(g => g.availability === "Available").length;

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1440px] mx-auto flex">

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white border border-slate-200 rounded-lg shadow-sm"
        >
          {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>

        {/* ── Left Sidebar ── */}
        <aside className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-60 bg-white border-r border-slate-100 flex flex-col py-6 px-3 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="px-3 mb-6">
            <h2 className="text-[13px] font-bold text-slate-800">Admin Panel</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Travel Operations</p>
          </div>

          <nav className="flex-1 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 pt-4 border-t border-slate-100 mt-4">
            <p className="text-[10px] text-slate-400">TourGaze Admin v2.0</p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 lg:ml-0">

          {/* ════════ OVERVIEW TAB ════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Operations Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor key metrics and platform activity.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: FiLayers, trend: "+12%", color: "blue" },
                  { label: "Active Tours", value: activeTours.toLocaleString(), icon: FiGlobe, trend: "+5%", color: "emerald" },
                  { label: "Pending Verifications", value: pendingVerifications.toLocaleString(), icon: FiAlertCircle, trend: "−2", color: "amber" },
                  { label: "Available Guides", value: `${availableGuides} / ${mockGuides.length}`, icon: FiUsers, trend: "3 free", color: "purple" },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  const bgMap = { blue: "bg-blue-50", emerald: "bg-emerald-50", amber: "bg-amber-50", purple: "bg-purple-50" };
                  const iconMap = { blue: "text-blue-600", emerald: "text-emerald-600", amber: "text-amber-600", purple: "text-purple-600" };
                  const trendMap = { blue: "text-blue-600", emerald: "text-emerald-600", amber: "text-amber-600", purple: "text-purple-600" };
                  return (
                    <div key={kpi.label} className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-lg ${bgMap[kpi.color]}`}>
                          <Icon className={`w-5 h-5 ${iconMap[kpi.color]}`} />
                        </div>
                        <span className={`text-[11px] font-semibold ${trendMap[kpi.color]} flex items-center space-x-1`}>
                          <FiTrendingUp className="w-3 h-3" />
                          <span>{kpi.trend}</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5">{kpi.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Queue Preview */}
              <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Recent Booking Queue</h3>
                  <button onClick={() => setActiveTab("queue")} className="text-[12px] font-semibold text-blue-600 hover:underline">View All →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Package</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 4).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono text-slate-500">{item.id}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">{item.customerName || "Customer"}</td>
                          <td className="px-5 py-3 text-slate-600">{item.packageName || item.package}</td>
                          <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════ BOOKING QUEUE TAB ════════ */}
          {activeTab === "queue" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Booking Queue</h1>
                <p className="text-sm text-slate-500 mt-1">Monitor and manage incoming booking requests in real-time.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by ID, customer, or package..."
                    value={queueSearch}
                    onChange={(e) => setQueueSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
                <select
                  value={queueStatusFilter}
                  onChange={(e) => setQueueStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Verifying Visa">Verifying Visa</option>
                  <option value="Allocating Flights">Allocating Flights</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Generating Tickets">Generating Tickets</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-5 py-3.5">Booking ID</th>
                        <th className="px-5 py-3.5">Customer</th>
                        <th className="px-5 py-3.5">Destination</th>
                        <th className="px-5 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {filteredQueue.map((item) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-5 py-3.5 font-mono text-slate-500">{item.id}</td>
                            <td className="px-5 py-3.5 font-medium text-slate-800">{item.customerName || "Customer"}</td>
                            <td className="px-5 py-3.5 text-slate-600">{item.packageName || item.package || "Multi-City Tour"}</td>
                            <td className="px-5 py-3.5">
                              <select
                                value={item.status}
                                onChange={(e) => updateBooking(item.id, { status: e.target.value })}
                                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none w-full"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Verifying Visa">Verifying Visa</option>
                                <option value="Allocating Flights">Allocating Flights</option>
                                <option value="Travel Ready">Travel Ready</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                {filteredQueue.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <FiLayers className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">No bookings match your filters.</p>
                  </div>
                )}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100 text-[12px] text-slate-500">
                  <span>Showing {filteredQueue.length} of {bookings.length} entries</span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Auto-refreshing every 15s</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ════════ PASS VERIFICATION TAB ════════ */}
          {activeTab === "verify" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Pass Verification Center</h1>
                <p className="text-sm text-slate-500 mt-1">Verify customer travel passes and booking credentials.</p>
              </div>

              {/* Search */}
              <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm space-y-6">
                <form onSubmit={handlePassSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Enter Booking ID or Pass ID (e.g. BK-101, PASS-1029)"
                      value={passQuery}
                      onChange={(e) => setPassQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm shrink-0">
                    <FiSearch className="w-4 h-4" />
                    <span>Verify</span>
                  </button>
                </form>

                {/* Loading State */}
                {passLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-sm text-slate-500">Verifying...</span>
                  </div>
                )}

                {/* Results */}
                {passSearched && !passLoading && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {passResult ? (
                      <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl overflow-hidden">
                        <div className="px-5 py-3 bg-emerald-100/50 border-b border-emerald-200 flex items-center space-x-2">
                          <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-800">✓ VERIFIED</span>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                          {[
                            { label: "Traveler Name", value: passResult.name },
                            { label: "Booking ID", value: passResult.bookingId },
                            { label: "Destination", value: passResult.destination },
                            { label: "Travel Date", value: passResult.travelDate },
                            { label: "Passport Status", value: passResult.passport },
                            { label: "Visa Status", value: passResult.visa },
                            { label: "Package", value: passResult.package },
                            { label: "Booking Status", value: passResult.status },
                          ].map((row) => (
                            <div key={row.label} className="flex flex-col">
                              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{row.label}</span>
                              <span className="font-medium text-slate-800 mt-0.5">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border border-red-200 bg-red-50/50 rounded-xl px-5 py-6 flex items-center space-x-3">
                        <FiXCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-red-800">Pass ID or Booking ID not found</p>
                          <p className="text-[12px] text-red-600 mt-0.5">Try PASS-1029, PASS-8392, BK-101, or BK-102</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Empty State */}
                {!passSearched && !passLoading && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <FiAward className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Enter a Pass ID or Booking ID above to verify</p>
                    <p className="text-[12px] text-slate-400 mt-1">Supported formats: PASS-XXXX, BK-XXX</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ GUIDE MANAGEMENT TAB ════════ */}
          {activeTab === "guides" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Guide Management</h1>
                <p className="text-sm text-slate-500 mt-1">Manage tour guide roster and assign activities.</p>
              </div>

              {/* Section A: Available Guides */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Available Guides</h3>
                  <div className="relative w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter by name or destination..."
                      value={guideFilter}
                      onChange={(e) => setGuideFilter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-[12px] font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {filteredGuides.map((guide) => (
                    <div key={guide.id} className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                          {guide.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-800 truncate">{guide.name}</p>
                          <p className="text-[11px] text-slate-500">{guide.languages}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <FiMap className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[12px] text-slate-600">{guide.expertise}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} className={`w-3.5 h-3.5 ${i < guide.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          guide.availability === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {guide.availability}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Activity Assignments */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Activity Assignments</h3>

                <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                          <th className="px-5 py-3.5">Activity</th>
                          <th className="px-5 py-3.5">Location</th>
                          <th className="px-5 py-3.5">Assigned Guide</th>
                          <th className="px-5 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {derivedActivities.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-800">
                              {item.activity} <br />
                              <span className="text-[10px] text-slate-400 font-normal">Booking: {item.bookingId}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="flex items-center space-x-1.5 text-slate-600">
                                <FiMap className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.location}</span>
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <select
                                value={item.guide || ""}
                                onChange={(e) => handleAssignGuide(item.bookingId, item.location, e.target.value)}
                                className={`text-[12px] font-medium rounded-md py-1.5 px-2.5 border outline-none transition w-full max-w-[200px] ${
                                  item.guide
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-slate-200 text-slate-500"
                                }`}
                              >
                                <option value="">Unassigned</option>
                                {mockGuides.filter(g => g.availability === "Available" || g.name === item.guide).map(g => (
                                  <option key={g.id} value={g.name}>{g.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-5 py-3.5">
                              {item.guide ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  <FiCheckCircle className="w-3 h-3 mr-1" /> Assigned
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                                  Unassigned
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {derivedActivities.length === 0 && (
                          <tr>
                            <td colSpan="4" className="px-5 py-12 text-center text-slate-500 text-sm">
                              No activities found from bookings.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ ACTIVITY LOGS TAB ════════ */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">System Activity Logs</h1>
                <p className="text-sm text-slate-500 mt-1">Audit trail of system actions and booking updates.</p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        <th className="px-5 py-3.5">Time</th>
                        <th className="px-5 py-3.5">Activity Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activityLogs.length > 0 ? (
                        activityLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 w-32">{log.time}</td>
                            <td className="px-5 py-3.5 text-slate-700 font-medium">{log.message}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="px-5 py-12 text-center text-slate-500 text-sm">
                            No activities logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
