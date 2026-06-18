import React, { useState, useEffect } from "react";
import { FiMapPin, FiNavigation, FiClock, FiCheckCircle, FiInfo, FiLayers, FiList, FiGlobe, FiMap } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import GoogleMapView from "./GoogleMapView";
import MapLibreMap from "./MapLibreMap";
import { getRoute } from "../services/mapService";

const cityCoordinates = {
  "Mumbai": { x: 580, y: 320, lat: 19.0760, lng: 72.8777 },
  "Delhi": { x: 575, y: 298, lat: 28.6139, lng: 77.2090 },
  "Agra": { x: 585, y: 303, lat: 27.1767, lng: 78.0081 },
  "Jaipur": { x: 565, y: 305, lat: 26.9124, lng: 75.7873 },
  "Kochi": { x: 572, y: 335, lat: 9.9312, lng: 76.2673 },
  "Munnar": { x: 582, y: 340, lat: 10.0889, lng: 77.0595 },
  "Alleppey": { x: 577, y: 345, lat: 9.4981, lng: 76.3388 },
  "Dubai": { x: 500, y: 280, lat: 25.2048, lng: 55.2708 },
  "Paris": { x: 380, y: 190, lat: 48.8566, lng: 2.3522 },
  "Rome": { x: 410, y: 220, lat: 41.9028, lng: 12.4964 },
  "London": { x: 360, y: 170, lat: 51.5074, lng: -0.1278 },
  "Tokyo": { x: 730, y: 240, lat: 35.6762, lng: 139.6503 },
  "Bali": { x: 670, y: 390, lat: -8.4095, lng: 115.1889 },
  "New York City": { x: 200, y: 210, lat: 40.7128, lng: -74.0060 }
};

const attractions = {
  "Mumbai": ["Gateway of India", "Marine Drive", "Elephanta Caves"],
  "Delhi": ["Red Fort", "Qutub Minar", "India Gate", "Lotus Temple"],
  "Agra": ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
  "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
  "Kochi": ["Chinese Fishing Nets", "Mattancherry Palace", "Fort Kochi Beach"],
  "Munnar": ["Eravikulam National Park", "Mattupetty Dam", "Tea Museum"],
  "Alleppey": ["Vembanad Lake", "Alappuzha Beach", "Houseboat Canals"],
  "Dubai": ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
  "Paris": ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Seine River"],
  "Rome": ["Colosseum", "Trevi Fountain", "Vatican City", "Pantheon"],
  "London": ["Tower Bridge", "London Eye", "Big Ben", "British Museum"],
  "Tokyo": ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Tower", "TeamLab Planets"],
  "Bali": ["Uluwatu Temple", "Tegallalang Rice Terrace", "Nusa Penida Cliffs"],
  "New York City": ["Statue of Liberty", "Central Park", "Times Square", "Empire State"]
};

const MapComponent = ({ stops = [], onAddStop, onRemoveStop, isInteractive = true }) => {
  const { packages, formatPrice } = useApp();
  const [selectedCity, setSelectedCity] = useState(null);
  const [optimizedStops, setOptimizedStops] = useState([]);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState("");
  const [mapMode, setMapMode] = useState("maplibre"); // "maplibre", "google", or "svg"
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);

  // 1. Optimize Stop Sequencing (Sorting by West-to-East Longitude)
  useEffect(() => {
    if (stops.length <= 1) {
      setOptimizedStops(stops);
      setDistance(0);
      setTime("");
      setRouteGeoJSON(null);
      return;
    }

    // Sort stops geographically by coordinates X position to optimize travel flow
    const sorted = [...stops].sort((a, b) => {
      const coordA = cityCoordinates[a] || { x: 0 };
      const coordB = cityCoordinates[b] || { x: 0 };
      return coordA.x - coordB.x;
    });

    setOptimizedStops(sorted);

    // Fetch real route data for MapLibre
    const fetchRoute = async () => {
      const waypoints = sorted.map(c => cityCoordinates[c]).filter(Boolean);
      if (waypoints.length > 1) {
        const routeData = await getRoute(waypoints);
        if (routeData) {
          setRouteGeoJSON(routeData.geometry);
          setDistance(routeData.distanceKm);
          setTime(`${routeData.durationHours} Hours Flight time`);
          return;
        }
      }
      
      // Fallback
      let totalDist = 0;
      for (let i = 0; i < sorted.length - 1; i++) {
        const city1 = sorted[i];
        const city2 = sorted[i + 1];
        const c1 = cityCoordinates[city1];
        const c2 = cityCoordinates[city2];
        if (c1 && c2) {
          const d = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2)) * 32;
          totalDist += d;
        }
      }
      
      setDistance(Math.round(totalDist));
      const flightHours = Math.round(totalDist / 850);
      setTime(`${flightHours} Hours Flight time`);
    };

    fetchRoute();
  }, [stops]);

  // Handle clicking a node on the custom map
  const handleNodeClick = (cityName) => {
    setSelectedCity(cityName);
  };

  // Find package corresponding to destination
  const getCityPackage = (cityName) => {
    return packages.find(pkg => pkg.stops && pkg.stops.includes(cityName)) || packages[0];
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      
      {/* Map Board Container */}
      <div className="flex-1 glass-card border border-white/40 p-4 min-h-[420px] lg:min-h-[500px] flex flex-col relative overflow-hidden">
        
        {/* Map Header with Mode Toggle */}
        <div className="flex items-center justify-between mb-4 z-10 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></span>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Live Optimized Route Map</span>
          </div>
          
          <div className="flex items-center space-x-2 flex-wrap">
            {stops.length > 1 && (
              <div className="flex items-center space-x-3 text-xs bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 text-blue-700 font-semibold mr-2 mb-2 sm:mb-0">
                <FiNavigation className="w-3.5 h-3.5" />
                <span>Optimized Flow</span>
              </div>
            )}
            
            {/* Map Mode Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-0.5 border border-slate-200/60 overflow-x-auto max-w-full">
              <button
                onClick={() => setMapMode("maplibre")}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                  mapMode === "maplibre"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <FiGlobe className="w-3 h-3" />
                <span>MapLibre</span>
              </button>
              <button
                onClick={() => setMapMode("google")}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                  mapMode === "google"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <FiGlobe className="w-3 h-3" />
                <span>Google Maps</span>
              </button>
              <button
                onClick={() => setMapMode("svg")}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                  mapMode === "svg"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <FiMap className="w-3 h-3" />
                <span>Vector Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* MapLibre View (New Default) */}
        {mapMode === "maplibre" && (
          <div className="flex-1 rounded-2xl overflow-hidden min-h-[400px]">
            <MapLibreMap
              stops={optimizedStops}
              selectedCity={selectedCity}
              onCityClick={handleNodeClick}
              routeGeoJSON={routeGeoJSON}
              darkMode={false}
              showAllCities={true}
              height="100%"
            />
          </div>
        )}

        {/* Google Maps View */}
        {mapMode === "google" && (
          <div className="flex-1 rounded-2xl overflow-hidden min-h-[400px]">
            <GoogleMapView
              stops={stops}
              allCities={true}
              selectedCity={selectedCity}
              onCitySelect={handleNodeClick}
              isInteractive={isInteractive}
              onAddStop={onAddStop}
              onRemoveStop={onRemoveStop}
              showDirections={true}
              height="100%"
            />
          </div>
        )}

        {/* Custom SVG World Map Visualizer (fallback) */}
        {mapMode === "svg" && (
          <div className="relative flex-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner overflow-hidden select-none flex items-center justify-center p-2 min-h-[400px]">
            
            {/* Grids Background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <svg
              viewBox="0 0 900 480"
              className="w-full h-full relative z-10"
              style={{ maxHeight: "450px" }}
            >
              {/* World Continent Schematics */}
              <path d="M 120 150 Q 180 120 220 170 T 260 250 T 200 320 T 150 200 Z" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <path d="M 320 120 Q 450 80 580 120 T 700 200 T 750 300 T 600 350 T 400 280 T 320 200 Z" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              <path d="M 380 260 Q 420 280 460 320 T 410 420 T 360 340 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              
              {/* DRAW ROUTES */}
              {optimizedStops.length > 1 && (
                <g>
                  {optimizedStops.map((city, idx) => {
                    if (idx === optimizedStops.length - 1) return null;
                    const c1 = cityCoordinates[city];
                    const c2 = cityCoordinates[optimizedStops[idx + 1]];
                    if (!c1 || !c2) return null;

                    return (
                      <g key={`route-${idx}`}>
                        <path d={`M ${c1.x} ${c1.y} Q ${(c1.x + c2.x)/2} ${Math.min(c1.y, c2.y) - 30} ${c2.x} ${c2.y}`} fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="3" className="route-line-animated" />
                        <path d={`M ${c1.x} ${c1.y} Q ${(c1.x + c2.x)/2} ${Math.min(c1.y, c2.y) - 30} ${c2.x} ${c2.y}`} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4" />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* MAP MARKERS / PINS */}
              {Object.keys(cityCoordinates).map((cityName) => {
                const { x, y } = cityCoordinates[cityName];
                const isSelected = selectedCity === cityName;
                const isStop = stops.includes(cityName);
                const stopNumber = optimizedStops.indexOf(cityName) + 1;

                return (
                  <g key={cityName} className="cursor-pointer group" onClick={() => handleNodeClick(cityName)}>
                    <circle cx={x} cy={y} r={isSelected ? 18 : isStop ? 14 : 10} fill={isStop ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)"} stroke={isStop ? "#10b981" : "#3b82f6"} strokeWidth={isSelected ? "2" : "1"} className="transition-all duration-300 group-hover:scale-125" />
                    <circle cx={x} cy={y} r={isSelected ? 6 : isStop ? 5 : 4} fill={isStop ? "#10b981" : "#3b82f6"} />
                    {isStop && <text x={x} y={y - 12} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" className="bg-black select-none">{stopNumber}</text>}
                    <text x={x} y={y + 18} textAnchor="middle" fill={isStop ? "#ffffff" : "rgba(255, 255, 255, 0.6)"} fontSize="9.5" fontWeight={isStop ? "bold" : "normal"} className="pointer-events-none select-none transition group-hover:fill-white">{cityName}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

      </div>

      {/* Sidebar Details / Optimization statistics */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        
        {/* Stats card */}
        {optimizedStops.length > 1 && (
          <div className="glass-card border border-white/40 p-5 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800">Route Overview</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Distance</p>
                <p className="text-sm font-extrabold text-slate-800">{distance.toLocaleString()} km</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Duration</p>
                <div className="flex items-center space-x-1 text-slate-800">
                  <FiClock className="w-3.5 h-3.5 text-blue-600" />
                  <p className="text-xs font-bold">{time}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Optimized Stop List</p>
              <div className="relative pl-4 border-l-2 border-emerald-400 space-y-3">
                {optimizedStops.map((city, idx) => (
                  <div key={city} className="relative text-xs flex justify-between items-center">
                    <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white border border-emerald-400"></span>
                    <span className="font-bold text-slate-700">{city}</span>
                    <span className="text-[9px] font-bold text-slate-400">Stop {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected City Details popover panel */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass-card border border-white/40 p-5 space-y-4 flex-1 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 flex items-center space-x-1.5">
                    <FiMapPin className="w-4 h-4 text-blue-600" />
                    <span>{selectedCity}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Coordinates: {cityCoordinates[selectedCity]?.lat?.toFixed(2)}N, {cityCoordinates[selectedCity]?.lng?.toFixed(2)}E</p>
                </div>
                {isInteractive && (
                  stops.includes(selectedCity) ? (
                    <button
                      onClick={() => onRemoveStop(selectedCity)}
                      className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold transition border border-red-200"
                    >
                      Remove Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddStop(selectedCity)}
                      className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[10px] font-bold transition shadow-sm"
                    >
                      Add Stop
                    </button>
                  )
                )}
              </div>

              {/* Attractions */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Top Attractions</p>
                <div className="flex flex-wrap gap-1">
                  {(attractions[selectedCity] || []).map((att) => (
                    <span
                      key={att}
                      className="bg-white border border-slate-200/80 rounded-lg text-[10px] px-2 py-0.5 font-medium text-slate-600"
                    >
                      {att}
                    </span>
                  ))}
                </div>
              </div>

              {/* Package Recommendation Link */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-2 flex-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>RECOMMENDED PACKAGE</span>
                  <span className="text-emerald-500 font-extrabold">★ {getCityPackage(selectedCity).rating}</span>
                </div>
                <h5 className="font-bold text-xs text-slate-800 leading-snug">{getCityPackage(selectedCity).name}</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed truncate">{getCityPackage(selectedCity).description}</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-extrabold text-blue-600">From {formatPrice(getCityPackage(selectedCity).price)}</span>
                  <span className="text-[10px] font-bold text-slate-400">{getCityPackage(selectedCity).duration}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informative placeholder if no node selected */}
        {!selectedCity && (
          <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
            <FiInfo className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Select a Destination Pin</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Click on any pin marker on the interactive world map overlay to check local sights, recommended packages, and customize route order.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default MapComponent;
