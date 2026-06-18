import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { FiMapPin, FiLayers, FiCompass, FiBriefcase, FiCheckCircle, FiGlobe, FiMap, FiNavigation, FiClock, FiInfo, FiDollarSign, FiWind, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import MapLibreMap from "../components/MapLibreMap";
import GoogleMapView from "../components/GoogleMapView";
import MapComponent from "../components/MapComponent";
import { getRoute, fetchAttractions, estimateTripCost, estimateCarbonFootprint, CITY_COORDS, searchCities, geocodeCity } from "../services/mapService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TravelMap = () => {
  const { customTrips, packages, formatPrice, activeCurrency, exchangeRates } = useApp();

  const [activeLayers, setActiveLayers] = useState({
    destinations: true,
    attractions: true,
    routes: true,
    heatmap: false
  });

  const [selectedRoute, setSelectedRoute] = useState(
    customTrips.length > 0 ? customTrips[0].id : "default"
  );

  const [selectedCity, setSelectedCity] = useState(null);
  
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [attractionsData, setAttractionsData] = useState([]);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [customRouteStops, setCustomRouteStops] = useState([]);

  const handleLayerToggle = (layer) => {
    setActiveLayers({
      ...activeLayers,
      [layer]: !activeLayers[layer]
    });
  };

  // Compile active stops list for route map rendering
  const getBaseRouteStops = () => {
    if (selectedRoute === "custom-search") {
      return customRouteStops;
    }

    if (selectedRoute === "default") {
      return ["Mumbai", "Dubai", "Paris", "Rome"];
    }

    if (selectedRoute === "india-golden") {
      return ["Delhi", "Agra", "Jaipur"];
    }

    if (selectedRoute === "kerala") {
      return ["Kochi", "Munnar", "Alleppey"];
    }

    if (selectedRoute === "asia-pacific") {
      return ["Mumbai", "Dubai", "Tokyo", "Bali"];
    }

    const trip = customTrips.find(t => t.id === selectedRoute);
    if (trip) {
      return [trip.startPoint, ...trip.stops];
    }

    return ["Mumbai", "Dubai", "Paris"];
  };

  const routeStops = getBaseRouteStops();

  // Load route data via OpenRouteService
  useEffect(() => {
    const fetchRouteData = async () => {
      if (!activeLayers.routes || routeStops.length < 2) {
        setRouteGeoJSON(null);
        setRouteStats(null);
        return;
      }

      // Collect waypoints
      const waypoints = [];
      for (const city of routeStops) {
        let coord = CITY_COORDS[city];
        if (!coord) {
          coord = await geocodeCity(city);
        }
        if (coord && coord.lat && coord.lng) {
          waypoints.push(coord);
        }
      }

      if (waypoints.length > 1) {
        const routeData = await getRoute(waypoints);
        if (routeData) {
          setRouteGeoJSON(routeData.geometry);
          
          const costs = estimateTripCost(routeData.distanceKm, waypoints.length);
          const carbon = estimateCarbonFootprint(routeData.distanceKm);
          
          setRouteStats({
            distance: routeData.distanceKm,
            flightTime: `${routeData.durationHours}h`,
            stops: waypoints.length,
            connections: waypoints.length - 1,
            costs,
            carbon
          });
        }
      }
    };

    fetchRouteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeStops.join(','), activeLayers.routes]);

  // Load attractions when a city is selected
  useEffect(() => {
    const loadCityAttractions = async () => {
      if (!selectedCity || !activeLayers.attractions) {
        setAttractionsData([]);
        return;
      }

      setLoadingAttractions(true);
      let coords = CITY_COORDS[selectedCity];
      if (!coords) {
        coords = await geocodeCity(selectedCity);
      }

      if (coords && coords.lat && coords.lng) {
        const pois = await fetchAttractions(coords.lat, coords.lng, 5000);
        setAttractionsData(pois);
      }
      setLoadingAttractions(false);
    };

    loadCityAttractions();
  }, [selectedCity, activeLayers.attractions]);

  // Handle city search
  useEffect(() => {
    const doSearch = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      const res = await searchCities(searchQuery);
      setSearchResults(res);
    };
    
    const timeoutId = setTimeout(doSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const addCustomStop = (cityObj) => {
    if (selectedRoute !== "custom-search") {
      setSelectedRoute("custom-search");
      setCustomRouteStops([cityObj.name]);
    } else {
      if (!customRouteStops.includes(cityObj.name)) {
        setCustomRouteStops([...customRouteStops, cityObj.name]);
      }
    }
    // Update local cache
    if (!CITY_COORDS[cityObj.name]) {
       CITY_COORDS[cityObj.name] = { lat: cityObj.lat, lng: cityObj.lng };
    }
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCity(cityObj.name);
  };

  const removeCustomStop = (city) => {
    setCustomRouteStops(customRouteStops.filter(c => c !== city));
  };

  // Get route description
  const getRouteDescription = () => {
    if (selectedRoute === "custom-search") return "Custom dynamically generated route";
    const descriptions = {
      "default": "European Grand Tour connecting major capitals via Middle East hub",
      "india-golden": "India's Golden Triangle — Delhi, Agra (Taj Mahal), and Jaipur",
      "kerala": "God's Own Country — Kerala backwaters, hills, and beaches",
      "asia-pacific": "Asia-Pacific circuit spanning India, Middle East, and Far East",
    };
    return descriptions[selectedRoute] || "Custom multi-city trip itinerary";
  };

  const chartData = useMemo(() => {
    if (!routeStats) return [];
    return [
      { name: "Flights", value: routeStats.costs.flights, color: "#3b82f6" },
      { name: "Hotels", value: routeStats.costs.hotels, color: "#10b981" },
      { name: "Food", value: routeStats.costs.food, color: "#f59e0b" },
      { name: "Misc", value: routeStats.costs.misc, color: "#8b5cf6" },
    ];
  }, [routeStats]);

  const formatCurrency = (usdVal) => {
    const val = usdVal * exchangeRates[activeCurrency];
    if (activeCurrency === "INR") return `₹${val.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    if (activeCurrency === "EUR") return `€${val.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    return `$${val.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight"
        >
          Intelligent Travel Map
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto"
        >
          Plan multi-city trips, visualize real travel routes, and explore nearby attractions powered by OpenStreetMap and OpenRouteService.
        </motion.p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Custom Search & Route Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 border border-white/50 shadow-xl space-y-4"
          >
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
              <FiNavigation className="w-4 h-4 text-blue-600" />
              <span>Route Selection</span>
            </h3>

            <div className="space-y-3">
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="default">🌍 Grand Tour (Mumbai → Rome)</option>
                <option value="india-golden">🇮🇳 Golden Triangle (Delhi → Jaipur)</option>
                <option value="kerala">🌴 Kerala Circuit (Kochi → Alleppey)</option>
                <option value="asia-pacific">🌏 Asia-Pacific (Mumbai → Bali)</option>
                {customTrips.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    ✨ User: {trip.name}
                  </option>
                ))}
                {customRouteStops.length > 0 && (
                  <option value="custom-search">🔍 Custom Built Route</option>
                )}
              </select>

              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {getRouteDescription()}
              </p>

              {/* Dynamic Location Search */}
              <div className="relative">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
                  <FiSearch className="text-slate-400 mr-2 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city to add..."
                    className="flex-1 text-xs outline-none bg-transparent"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => addCustomStop(res)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs text-slate-700 flex flex-col border-b border-slate-50 last:border-0"
                      >
                        <span className="font-bold">{res.name}</span>
                        <span className="text-[9px] text-slate-400 truncate">{res.fullName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedRoute === "custom-search" && customRouteStops.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {customRouteStops.map(stop => (
                    <span key={stop} className="inline-flex items-center text-[10px] bg-blue-50 text-blue-700 rounded-full px-2 py-1 border border-blue-100">
                      {stop}
                      <button onClick={() => removeCustomStop(stop)} className="ml-1 hover:text-red-500 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Layer Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5 border border-white/50 shadow-xl space-y-4"
          >
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
              <FiLayers className="w-4 h-4 text-blue-600" />
              <span>Map Layers</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.destinations}
                  onChange={() => handleLayerToggle("destinations")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="font-bold">Destination Pins</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.attractions}
                  onChange={() => handleLayerToggle("attractions")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="font-bold">Nearby Attractions</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.routes}
                  onChange={() => handleLayerToggle("routes")}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="font-bold">Travel Routes</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activeLayers.heatmap}
                  onChange={() => handleLayerToggle("heatmap")}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300"
                />
                <span className="font-bold text-emerald-700">Popularity Heatmap</span>
              </label>
            </div>
          </motion.div>

          {/* Route Stop Timeline */}
          {routeStops.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-5 border border-white/50 shadow-xl space-y-4 max-h-64 overflow-y-auto"
            >
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                <FiMapPin className="w-4 h-4 text-emerald-500" />
                <span>Route Timeline</span>
              </h3>
              <div className="relative pl-5 border-l-2 border-emerald-400 space-y-4">
                {routeStops.map((city, idx) => (
                  <div key={`${city}-${idx}`} className="relative text-xs">
                    <span className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white border border-emerald-400"></span>
                    <div className="flex justify-between items-center cursor-pointer group" onClick={() => setSelectedCity(city)}>
                      <div>
                        <p className={`font-bold transition ${selectedCity === city ? "text-blue-600" : "text-slate-700 group-hover:text-blue-500"}`}>{city}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {idx === 0 ? "Departure" : idx === routeStops.length - 1 ? "Final Destination" : `Stop ${idx}`}
                        </p>
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Main Map Area */}
        <div className="lg:col-span-9 flex flex-col space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full relative"
          >
            <MapLibreMap
              stops={routeStops}
              routeGeoJSON={routeGeoJSON}
              attractions={activeLayers.attractions ? attractionsData : []}
              selectedCity={selectedCity}
              onCityClick={setSelectedCity}
              showHeatmap={activeLayers.heatmap}
              showAllCities={activeLayers.destinations}
              darkMode={true}
              height="500px"
            />
            
            {/* Overlay Panel for City Details & Attractions */}
            <AnimatePresence>
              {selectedCity && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-4 right-4 w-72 glass-card border border-white/20 p-4 shadow-2xl z-20 max-h-96 overflow-y-auto"
                  style={{ background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="flex items-start justify-between mb-3 border-b border-slate-700 pb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                        <FiMapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{selectedCity}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {routeStops.includes(selectedCity) ? `Stop ${routeStops.indexOf(selectedCity) + 1} on route` : "Explore destination"}
                      </p>
                    </div>
                    <button onClick={() => setSelectedCity(null)} className="text-slate-400 hover:text-white transition">✕</button>
                  </div>

                  {loadingAttractions ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-slate-400">Scanning local POIs...</span>
                    </div>
                  ) : attractionsData.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nearby Discoveries</p>
                      <div className="space-y-2">
                        {attractionsData.slice(0, 6).map(poi => (
                          <div key={poi.id} className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                            <span className="text-sm bg-slate-700/50 rounded-md p-1 leading-none">{poi.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-200 truncate">{poi.name}</p>
                              <p className="text-[8px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: poi.color }}>{poi.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {attractionsData.length > 6 && (
                        <p className="text-[9px] text-slate-400 text-center italic mt-2">+ {attractionsData.length - 6} more attractions mapped</p>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-[10px] text-slate-400">No attractions mapped nearby.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Analytics / Stats Dashboard */}
          {routeStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Distance & Carbon */}
              <div className="glass-card p-5 space-y-4">
                <h3 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider border-b border-slate-100 pb-2">
                  <FiWind className="w-4 h-4 text-emerald-500" />
                  <span>Travel Impact</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Distance</p>
                    <p className="text-lg font-extrabold text-slate-800">{routeStats.distance.toLocaleString()} km</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Flight Time</p>
                    <p className="text-lg font-extrabold text-slate-800">{routeStats.flightTime}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Carbon Footprint</p>
                    <p className="text-sm font-extrabold text-emerald-800">{routeStats.carbon.tons} Tons CO₂</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Offset Equivalent</p>
                    <p className="text-xs font-bold text-emerald-700">🌲 {routeStats.carbon.treesNeeded} trees/yr</p>
                  </div>
                </div>
              </div>

              {/* Budget Estimation */}
              <div className="glass-card p-5 space-y-4 md:col-span-2">
                <h3 className="font-extrabold text-xs text-slate-800 flex items-center justify-between uppercase tracking-wider border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <FiDollarSign className="w-4 h-4 text-blue-600" />
                    <span>Estimated Route Budget</span>
                  </div>
                  <span className="text-lg text-blue-600">{formatCurrency(routeStats.costs.total)}</span>
                </h3>
                
                <div className="flex items-end h-32 w-full pt-2">
                  <div className="w-1/2 pr-4 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={(val) => `$${val}`} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                          formatter={(value) => [`$${value}`, "Cost"]}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-1/2 grid grid-cols-2 gap-2 h-full content-center">
                    {chartData.map(item => (
                      <div key={item.name} className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{item.name}</span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-800">{formatCurrency(item.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
};

export default TravelMap;
