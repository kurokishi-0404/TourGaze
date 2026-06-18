import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiCalendar, FiDollarSign, FiUsers, FiCompass, FiArrowRight, FiCheck, FiMapPin, FiTrendingUp, FiCheckCircle, FiTwitter, FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import MapComponent from "../components/MapComponent";
import MapLibreMap from "../components/MapLibreMap";
import { getRoute, CITY_COORDS } from "../services/mapService";

const Home = () => {
  const { destinations, packages, formatPrice, searchParams, setSearchParams } = useApp();
  const navigate = useNavigate();

  // Search Fields
  const [fromQuery, setFromQuery] = useState(searchParams.from);
  const [toQuery, setToQuery] = useState(searchParams.to);
  const [date, setDate] = useState(searchParams.date || "2026-07-20");
  const [budget, setBudget] = useState(searchParams.budget);
  const [travelers, setTravelers] = useState(searchParams.travelers);
  const [tripType, setTripType] = useState(searchParams.tripType);

  // Autocomplete UI state
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  
  // Search Results state
  const [showResults, setShowResults] = useState(false);
  const [searchOutput, setSearchOutput] = useState(null);
  const [routingStops, setRoutingStops] = useState(["Mumbai", "Dubai", "Paris"]); // Default route

  const filteredFromDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(fromQuery.toLowerCase())
  );
  
  const filteredToDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(toQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      from: fromQuery,
      to: toQuery,
      date,
      budget,
      travelers,
      tripType
    });

    // Simulate search analysis mapping
    const matchedPkg = packages.find(
      p => p.name.toLowerCase().includes(toQuery.toLowerCase()) || 
           p.country.toLowerCase().includes(toQuery.toLowerCase()) ||
           p.stops.some(s => s.toLowerCase().includes(toQuery.toLowerCase()))
    ) || packages[0];

    const route = [fromQuery];
    matchedPkg.stops.forEach(stop => {
      if (stop !== fromQuery) route.push(stop);
    });
    setRoutingStops(route);

    const duration = matchedPkg.duration;
    const baseCost = matchedPkg.price;
    const flights = matchedPkg.flightsCost;
    const visa = matchedPkg.visaCost;
    
    const calculatedTotal = (baseCost + flights + visa) * travelers;

    setSearchOutput({
      pkgId: matchedPkg.id,
      pkgName: matchedPkg.name,
      image: matchedPkg.image,
      duration: duration,
      estimatedCost: calculatedTotal,
      flightDuration: `${Math.round(route.length * 4)}h 45m`,
      visaRequirements: matchedPkg.visaRequirements,
      travelRules: matchedPkg.travelRules,
      rating: matchedPkg.rating
    });

    setShowResults(true);
    
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddStop = (city) => {
    if (!routingStops.includes(city)) {
      setRoutingStops([...routingStops, city]);
    }
  };

  const handleRemoveStop = (city) => {
    if (routingStops.length > 1) {
      setRoutingStops(routingStops.filter(c => c !== city));
    }
  };

  const [demoRouteGeoJSON, setDemoRouteGeoJSON] = React.useState(null);
  React.useEffect(() => {
    const fetchDemoRoute = async () => {
      const waypoints = [
        CITY_COORDS["Mumbai"],
        CITY_COORDS["Dubai"],
        CITY_COORDS["Paris"]
      ].filter(Boolean);
      const data = await getRoute(waypoints);
      if (data) setDemoRouteGeoJSON(data.geometry);
    };
    fetchDemoRoute();
  }, []);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-16 pb-32 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat">
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/10 to-transparent"></div>

        {/* Left Social Sidebar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 bg-slate-900/80 backdrop-blur-sm rounded-r-2xl flex flex-col items-center py-6 space-y-6 z-20">
          <a href="#" className="text-white hover:text-[#01c5c4] transition"><FiTwitter className="w-4 h-4" /></a>
          <a href="#" className="text-white hover:text-[#01c5c4] transition"><FiFacebook className="w-4 h-4" /></a>
          <a href="#" className="text-white hover:text-[#01c5c4] transition"><FiInstagram className="w-4 h-4" /></a>
          <a href="#" className="text-white hover:text-[#01c5c4] transition"><FiYoutube className="w-4 h-4" /></a>
        </div>

        {/* Right Image Stack */}
        <div className="hidden lg:flex absolute right-10 xl:right-24 top-1/2 -translate-y-1/2 flex-col space-y-5 z-20">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" className="w-44 h-32 object-cover border-[5px] border-white shadow-xl hover:scale-105 transition duration-300" alt="Beach" />
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=300&q=80" className="w-44 h-32 object-cover border-[5px] border-white shadow-xl hover:scale-105 transition duration-300" alt="City" />
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80" className="w-44 h-32 object-cover border-[5px] border-white shadow-xl hover:scale-105 transition duration-300" alt="Desert" />
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-16 sm:px-24 relative z-10">
          <div className="max-w-xl">
            {/* Typography */}
            <h1 className="font-cursive text-white text-7xl md:text-[110px] leading-[0.5] tracking-wide -ml-2 drop-shadow-xl">
              Say yes
            </h1>
            <h2 className="text-[#01c5c4] font-black text-5xl md:text-7xl uppercase tracking-tighter mt-4 drop-shadow-md leading-[0.9]">
              TO YOUR <br/> VACATION
            </h2>
            
            <p className="text-white text-sm mt-8 leading-relaxed max-w-md drop-shadow-md font-medium">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>

            <div className="mt-8 bg-white p-3 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center gap-3 w-[200%] max-w-4xl pointer-events-auto relative z-30">
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
                {/* FROM FIELD */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <label className="text-[9px] uppercase font-bold text-slate-400 absolute top-1 left-10">From:</label>
                  <div className="relative flex items-center pt-3">
                    <svg className="absolute left-3.5 text-slate-400 w-4 h-4 top-1/2 -translate-y-1/2 transform -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5 1L14.5 8.5 6.3 6.7c-.5-.1-1 .1-1.3.5L4 8.3c-.4.4-.3 1 .2 1.2L9.5 12l-4 4-2.7-.9c-.4-.1-.8 0-1.1.3L1 16.1c-.2.2-.2.5 0 .7l4.5 2.5 2.5 4.5c.2.2.5.2.7 0l.7-.7c.3-.3.4-.7.3-1.1L8.8 19l4-4 2.5 5.3c.2.5.8.6 1.2.2l1.1-1.1c.4-.3.6-.8.5-1.3z"></path></svg>
                    <input
                      type="text"
                      value={fromQuery}
                      onChange={(e) => setFromQuery(e.target.value)}
                      onFocus={() => setFromFocused(true)}
                      onBlur={() => setTimeout(() => setFromFocused(false), 200)}
                      placeholder="Departure city"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-md py-3 pl-10 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#01c5c4]"
                    />
                  </div>
                  {fromFocused && filteredFromDestinations.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-40 overflow-y-auto p-1.5 space-y-1">
                      {filteredFromDestinations.map(d => (
                        <button
                          key={`from-${d.name}`}
                          type="button"
                          onMouseDown={() => setFromQuery(d.name)}
                          className="w-full text-left text-xs font-bold text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          {d.name}, {d.country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* TO FIELD */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <label className="text-[9px] uppercase font-bold text-slate-400 absolute top-1 left-10">To:</label>
                  <div className="relative flex items-center pt-3">
                    <svg className="absolute left-3.5 text-slate-400 w-4 h-4 top-1/2 -translate-y-1/2 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5 1L14.5 8.5 6.3 6.7c-.5-.1-1 .1-1.3.5L4 8.3c-.4.4-.3 1 .2 1.2L9.5 12l-4 4-2.7-.9c-.4-.1-.8 0-1.1.3L1 16.1c-.2.2-.2.5 0 .7l4.5 2.5 2.5 4.5c.2.2.5.2.7 0l.7-.7c.3-.3.4-.7.3-1.1L8.8 19l4-4 2.5 5.3c.2.5.8.6 1.2.2l1.1-1.1c.4-.3.6-.8.5-1.3z"></path></svg>
                    <input
                      type="text"
                      value={toQuery}
                      onChange={(e) => setToQuery(e.target.value)}
                      onFocus={() => setToFocused(true)}
                      onBlur={() => setTimeout(() => setToFocused(false), 200)}
                      placeholder="Where to?"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-md py-3 pl-10 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#01c5c4]"
                    />
                  </div>
                  {toFocused && filteredToDestinations.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg z-30 max-h-40 overflow-y-auto p-1.5 space-y-1">
                      {filteredToDestinations.map(d => (
                        <button
                          key={`to-${d.name}`}
                          type="button"
                          onMouseDown={() => setToQuery(d.name)}
                          className="w-full text-left text-xs font-bold text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                        >
                          {d.name}, {d.country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* TRAVEL DATE */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <label className="text-[9px] uppercase font-bold text-slate-400 absolute top-1 left-10">Date:</label>
                  <div className="relative flex items-center pt-3">
                    <FiCalendar className="absolute left-3.5 text-slate-400 w-4 h-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-md py-3 pl-10 pr-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#01c5c4]"
                    />
                  </div>
                </div>

                {/* SEARCH BUTTON */}
                <div className="w-full lg:w-auto pt-4 lg:pt-3">
                  <button
                    type="submit"
                    className="w-full lg:w-auto px-12 py-3.5 bg-[#01c5c4] hover:bg-[#00b0af] text-white font-extrabold uppercase tracking-widest rounded-md text-xs transition duration-300 shadow-md"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Brush Stroke / Torn Paper SVG Bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 translate-y-px pointer-events-none">
          <svg className="relative block w-full h-[60px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 C150,120 200,40 300,70 C400,100 450,20 600,40 C750,60 800,0 900,30 C1000,60 1050,120 1200,90 L1200,120 L0,120 Z" fill="#ffffff" />
            <path d="M0,120 C200,80 250,100 400,80 C550,60 600,40 750,50 C900,60 950,100 1200,80 L1200,120 L0,120 Z" fill="#ffffff" opacity="0.4" />
          </svg>
        </div>
      </section>

      {/* NEW: Interactive Mini-Map Embed Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 mb-16 relative z-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white">
          <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          
          <MapLibreMap
            stops={["Mumbai", "Dubai", "Paris"]}
            routeGeoJSON={demoRouteGeoJSON}
            height="400px"
            darkMode={false}
            onCityClick={(city) => navigate(`/map?city=${city}`)}
          />

          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-none">
            <div className="glass-panel-dark text-white p-4 rounded-2xl border border-white/20 backdrop-blur-xl pointer-events-auto">
              <h3 className="font-extrabold text-sm flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Live Route Visualization</span>
              </h3>
              <p className="text-[10px] text-slate-300 mt-1 max-w-xs leading-relaxed">
                Experience your journey before you book. Our new interactive 3D map engine visualizes real flight paths and discovers nearby attractions.
              </p>
            </div>
            
            <Link 
              to="/map" 
              className="pointer-events-auto shrink-0 bg-white hover:bg-slate-50 text-blue-600 px-6 py-3 rounded-xl font-bold text-xs shadow-xl flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <FiCompass className="w-4 h-4" />
              <span>Explore Interactive Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC SEARCH RESULTS SECTION */}
      <AnimatePresence>
        {showResults && searchOutput && (
          <motion.section
            id="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 py-16 space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Smart Optimization Results</h3>
              <p className="text-xs text-slate-500">We optimized route sequencing and calculated international travel costs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-card p-6 border border-white/50 shadow-xl space-y-5">
                  <div className="relative h-44 rounded-xl overflow-hidden shadow-inner">
                    <img src={searchOutput.image} alt={searchOutput.pkgName} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">Suggested Package</span>
                    <span className="absolute bottom-3 right-3 bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <span>★</span><span>{searchOutput.rating}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-slate-800">{searchOutput.pkgName}</h4>
                    <p className="text-xs text-slate-400">Sequence stops: {fromQuery} → {toQuery}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Price Estimate</p>
                      <p className="text-lg font-extrabold text-blue-600">{formatPrice(searchOutput.estimatedCost)}</p>
                      <p className="text-[9px] text-slate-400">For {travelers} traveler(s)</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Flight Duration</p>
                      <p className="text-xs font-extrabold text-slate-700 mt-1">{searchOutput.flightDuration}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span>Visa Status</span>
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1 font-semibold">{searchOutput.visaRequirements}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span>Travel Rules</span>
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1 font-semibold">{searchOutput.travelRules}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <Link to={`/packages`} className="flex-1 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm">
                      Book Flight & Hotel
                    </Link>
                    <Link to="/planner" className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">
                      Customize Stops
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <MapComponent stops={routingStops} onAddStop={handleAddStop} onRemoveStop={handleRemoveStop} isInteractive={true} />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 4. RECENTLY VIEWED & SMART INSIGHTS */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 border border-white/50 shadow-xl space-y-6">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
            <span>Smart Travel Insights</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Japan Best Season</span>
              <p className="text-xs font-extrabold text-slate-700">Autumn Foliage (October-November)</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Japan's cherry blossoms in spring are famous, but autumn brings cooling temperatures and stunning red maple canopies with lower flight tariffs.</p>
            </div>
            
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Euro Schengen Rules</span>
              <p className="text-xs font-extrabold text-slate-700">Financial Proof Requirements</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Applying for Schengen visas requires at least 3 months bank statements showing sufficient funds (approx €65/day of stay) plus return tickets.</p>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 flex items-start space-x-3">
            <FiCheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Optimize Multi-City Flights</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Booking a multi-city open jaw ticket (e.g., fly into Paris and depart out of Rome) is 30% cheaper than booking separate round trips, and saves up to 8 travel transit hours.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5 border border-white/50 shadow-xl space-y-4">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Popular This Week</h4>
            <div className="space-y-3">
              {packages.slice(0, 3).map((pkg) => (
                <Link key={pkg.id} to={`/packages`} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl transition duration-200">
                  <img src={pkg.image} alt={pkg.name} className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{pkg.name}</p>
                    <p className="text-[10px] text-slate-400">{pkg.duration} • ★ {pkg.rating}</p>
                  </div>
                  <div className="text-xs font-bold text-blue-600 shrink-0">{formatPrice(pkg.price)}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            <div className="relative z-10 space-y-4">
              <span className="text-[9px] font-extrabold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Continue Planning</span>
              <div>
                <h4 className="font-bold text-sm">Paris & Rome Trip</h4>
                <p className="text-[10px] text-slate-400 mt-1">Last edited 2 hours ago • 2 stops</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-extrabold text-blue-400">Total Est: $3,698</span>
                <Link to="/planner" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"><FiArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING DESTINATIONS GRID */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Trending Destinations</h3>
            <p className="text-xs text-slate-500 font-semibold">Travelers are flocking to these gorgeous international hotspots.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((dest) => (
              <div
                key={dest.name}
                className="group relative h-72 rounded-[24px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => {
                  setToQuery(dest.name);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
              >
                <img src={packages.find(p => p.stops.includes(dest.name))?.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80"} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">{dest.type}</span>
                  <h4 className="font-extrabold text-base leading-tight">{dest.name}, {dest.country}</h4>
                  <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">{dest.desc}</p>
                  <div className="flex items-center space-x-1.5 pt-1.5">
                    <span className="text-xs text-emerald-400 font-bold">★ {dest.rating}</span>
                    <span className="text-[9px] text-slate-400 font-bold">• Popular Choice</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
