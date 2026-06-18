import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FiPlus, FiTrash, FiCalendar, FiMapPin, FiBriefcase, FiDollarSign, FiPlusCircle, FiList, FiClock, FiSettings, FiCheckCircle } from "react-icons/fi";
import { packagesData } from "../data/packagesData";
import { motion, AnimatePresence } from "framer-motion";
import MapComponent from "../components/MapComponent";
import confetti from "canvas-confetti";
import { CITY_COORDS } from "../services/mapService";

const TripPlanner = () => {
  const { formatPrice, saveCustomTrip, customTrips, deleteCustomTrip } = useApp();

  // Search parameters for autocomplete
  const citiesList = Object.keys(CITY_COORDS);
  
  const [startPoint, setStartPoint] = useState("Mumbai");
  const [stops, setStops] = useState(["Dubai", "Paris"]); // Default stops
  const [selectedCityToAdd, setSelectedCityToAdd] = useState("Rome");

  // Accommodations & Activities Selected
  const [hotelSelections, setHotelSelections] = useState({
    "Mumbai": "Taj Mahal Palace",
    "Dubai": "Atlantis The Palm",
    "Paris": "Hotel Le Bristol Paris",
    "Rome": "Rome Luxury Suite",
    "London": "The Ritz London",
    "Tokyo": "Park Hyatt Tokyo",
    "Bali": "Maya Ubud Resort & Spa",
    "New York City": "The Plaza Hotel NYC"
  });

  const [activitySelections, setActivitySelections] = useState({
    "Dubai": ["Burj Khalifa 148th Floor Access", "Desert Safari with BBQ Dinner"],
    "Paris": ["Eiffel Tower Summit Access", "Louvre Museum Guided Tour"],
    "Rome": ["Colosseum & Roman Forum Tour"],
    "London": ["London Eye Private Capsule"],
    "Tokyo": ["Shibuya Sky & TeamLab Planets"],
    "Bali": ["Sacred Monkey Forest Sanctuary Tour"],
    "New York City": ["Statue of Liberty"],
    "Mumbai": []
  });

  // Calculate costs state
  const [costs, setCosts] = useState({
    flights: 0,
    hotels: 0,
    activities: 0,
    visas: 0,
    total: 0
  });

  const [tripName, setTripName] = useState("My Epic Summer Tour");
  const [travelDate, setTravelDate] = useState("2026-07-20");

  const hotelDatabase = {
    "Mumbai": [{ name: "Taj Mahal Palace", price: 180 }, { name: "Oberoi Mumbai", price: 160 }],
    "Dubai": [{ name: "Atlantis The Palm", price: 240 }, { name: "Emirates Palace Abu Dhabi", price: 300 }],
    "Paris": [{ name: "Hotel Le Bristol Paris", price: 250 }, { name: "Hyatt Regency Paris", price: 140 }],
    "Rome": [{ name: "Rome Luxury Suite", price: 180 }, { name: "Napoleon Hotel Rome", price: 110 }],
    "London": [{ name: "The Ritz London", price: 280 }, { name: "Royal Lancaster London", price: 170 }],
    "Tokyo": [{ name: "Park Hyatt Tokyo", price: 220 }, { name: "Shibuya Excel Hotel", price: 130 }],
    "Bali": [{ name: "Maya Ubud Resort & Spa", price: 110 }, { name: "W Bali Seminyak", price: 180 }],
    "New York City": [{ name: "The Plaza Hotel NYC", price: 320 }, { name: "Pod 39 NYC", price: 90 }],
    "Delhi": [{ name: "The Leela Palace Delhi", price: 150 }, { name: "Taj Palace New Delhi", price: 130 }],
    "Agra": [{ name: "Oberoi Amarvilas Agra", price: 210 }, { name: "ITC Mughal", price: 140 }],
    "Jaipur": [{ name: "Rambagh Palace Jaipur", price: 240 }, { name: "Fairmont Jaipur", price: 180 }],
    "Kochi": [{ name: "Brunton Boatyard Kochi", price: 120 }, { name: "Taj Malabar Resort", price: 130 }],
    "Munnar": [{ name: "Munnar Tea Valley Resort", price: 80 }, { name: "Windermere Estate", price: 110 }],
    "Alleppey": [{ name: "Spice Coast Houseboats Alleppey", price: 140 }, { name: "Lake Palace Resort", price: 160 }],
    "Abu Dhabi": [{ name: "Emirates Palace Abu Dhabi", price: 300 }, { name: "The St. Regis Abu Dhabi", price: 250 }],
    "Kyoto": [{ name: "Kyoto Ryokan Traditional", price: 160 }, { name: "The Ritz-Carlton Kyoto", price: 350 }],
    "Boston": [{ name: "Boston Copley Square Hotel", price: 160 }, { name: "The Liberty Hotel", price: 210 }],
    "Zurich": [{ name: "Schweizerhof Hotel Zurich", price: 220 }, { name: "Baur au Lac", price: 310 }],
    "Interlaken": [{ name: "Victoria Jungfrau Interlaken", price: 270 }, { name: "Lindner Grand Hotel", price: 180 }],
    "Zermatt": [{ name: "Grand Hotel Zermatterhof", price: 290 }, { name: "Omnia", price: 320 }],
    "Singapore": [{ name: "Marina Bay Sands", price: 400 }, { name: "Raffles Hotel", price: 500 }],
    "Bangkok": [{ name: "Mandarin Oriental Bangkok", price: 250 }, { name: "The Peninsula Bangkok", price: 210 }],
    "Istanbul": [{ name: "Ciragan Palace Kempinski", price: 350 }, { name: "Four Seasons Bosphorus", price: 400 }],
    "Cairo": [{ name: "Marriott Mena House", price: 180 }, { name: "The St. Regis Cairo", price: 220 }],
    "Sydney": [{ name: "Park Hyatt Sydney", price: 380 }, { name: "Shangri-La Sydney", price: 250 }],
    "Barcelona": [{ name: "W Barcelona", price: 320 }, { name: "Hotel Arts Barcelona", price: 300 }],
    "Amsterdam": [{ name: "Conservatorium Hotel", price: 450 }, { name: "Waldorf Astoria Amsterdam", price: 550 }],
    "Goa": [{ name: "Taj Exotica Resort", price: 200 }, { name: "The Leela Goa", price: 220 }],
    "Varanasi": [{ name: "Taj Ganges", price: 110 }, { name: "BrijRama Palace", price: 180 }],
    "Udaipur": [{ name: "Taj Lake Palace", price: 400 }, { name: "The Oberoi Udaivilas", price: 450 }]
  };

  const activityDatabase = {
    "Mumbai": [{ name: "Gateway of India Tour", price: 10 }, { name: "Elephanta Caves Ferry", price: 15 }],
    "Dubai": [
      { name: "Burj Khalifa 148th Floor Access", price: 75 },
      { name: "Desert Safari with BBQ Dinner", price: 40 },
      { name: "Louvre Abu Dhabi Admission", price: 18 }
    ],
    "Paris": [
      { name: "Eiffel Tower Summit Access", price: 45 },
      { name: "Louvre Museum Guided Tour", price: 40 },
      { name: "Seine River Dinner Cruise", price: 65 }
    ],
    "Rome": [
      { name: "Colosseum & Roman Forum Tour", price: 35 },
      { name: "Vatican Museums Guided Walk", price: 45 }
    ],
    "London": [
      { name: "London Eye Private Capsule", price: 50 },
      { name: "Tower of London Ticket", price: 30 }
    ],
    "Tokyo": [
      { name: "Shibuya Sky & TeamLab Planets", price: 30 },
      { name: "Mt. Fuji Guided Hiking Tour", price: 60 }
    ],
    "Bali": [
      { name: "Sacred Monkey Forest Sanctuary Tour", price: 10 },
      { name: "Nusa Penida Snorkeling with Mantas", price: 35 },
      { name: "Mount Batur Sunrise Trekking", price: 40 }
    ],
    "New York City": [
      { name: "Statue of Liberty", price: 25 },
      { name: "Broadway Musical Show Ticket", price: 95 }
    ],
    "Delhi": [{ name: "Qutub Minar & Red Fort Walk", price: 10 }, { name: "Chandni Chowk Food Tour", price: 20 }],
    "Agra": [{ name: "Taj Mahal Sunrise Tour", price: 25 }, { name: "Agra Fort Guided Tour", price: 15 }],
    "Jaipur": [{ name: "Amber Fort Jeep Ride", price: 15 }, { name: "City Palace Tour", price: 10 }],
    "Kochi": [{ name: "Kathakali Dance Show Ticket", price: 8 }, { name: "Fort Kochi Heritage Walk", price: 12 }],
    "Munnar": [{ name: "Tea Garden Trekking Munnar", price: 10 }, { name: "Eravikulam National Park Entry", price: 15 }],
    "Alleppey": [{ name: "Houseboat Backwater Cruise", price: 30 }, { name: "Village Canoe Tour", price: 15 }],
    "Abu Dhabi": [{ name: "Yas Marina Formula 1 Track Tour", price: 45 }, { name: "Sheikh Zayed Mosque Tour", price: 20 }],
    "Kyoto": [{ name: "Kyoto Tea Ceremony Experience", price: 25 }, { name: "Arashiyama Bamboo Grove Walk", price: 15 }],
    "Boston": [{ name: "Freedom Trail Private Walk", price: 20 }, { name: "Harvard University Walking Tour", price: 15 }],
    "Zurich": [{ name: "Lake Zurich Sightseeing Cruise", price: 35 }, { name: "Swiss National Museum", price: 20 }],
    "Interlaken": [{ name: "Jungfraujoch Train Ride", price: 150 }, { name: "Lake Brienz Jet Boat", price: 55 }],
    "Zermatt": [{ name: "Matterhorn Glacier Paradise", price: 85 }, { name: "Gornergrat Railway Ticket", price: 70 }],
    "Singapore": [{ name: "Gardens by the Bay Entry", price: 25 }, { name: "Night Safari Admission", price: 40 }],
    "Bangkok": [{ name: "Grand Palace Tour", price: 20 }, { name: "Chao Phraya Dinner Cruise", price: 50 }],
    "Istanbul": [{ name: "Hagia Sophia & Blue Mosque Tour", price: 30 }, { name: "Bosphorus Sunset Cruise", price: 40 }],
    "Cairo": [{ name: "Pyramids of Giza Camel Ride", price: 25 }, { name: "Egyptian Museum Entry", price: 15 }],
    "Sydney": [{ name: "Sydney Opera House Tour", price: 35 }, { name: "BridgeClimb Sydney", price: 200 }],
    "Barcelona": [{ name: "Sagrada Familia Fast-Track", price: 35 }, { name: "Park Guell Guided Tour", price: 25 }],
    "Amsterdam": [{ name: "Van Gogh Museum Ticket", price: 25 }, { name: "Canal Ring Boat Tour", price: 20 }],
    "Goa": [{ name: "Dudhsagar Waterfall Trip", price: 30 }, { name: "Scuba Diving at Grande Island", price: 45 }],
    "Varanasi": [{ name: "Ganges Sunrise Boat Ride", price: 15 }, { name: "Sarnath Guided Tour", price: 20 }],
    "Udaipur": [{ name: "Lake Pichola Sunset Cruise", price: 25 }, { name: "City Palace Museum Tour", price: 15 }]
  };

  // Recalculate costs when routing stops, hotels or activities modify
  useEffect(() => {
    const allStops = [startPoint, ...stops];
    
    // 1. Flight Costs: Mocking $400 base flight per connection leg
    const flightsCost = stops.length * 400;

    // 2. Hotel Costs: Mocking 3 nights per destination city
    let hotelsCost = 0;
    allStops.forEach(city => {
      const selectedHotelName = hotelSelections[city];
      const hotelOptions = hotelDatabase[city] || [];
      const selectedHotelObj = hotelOptions.find(h => h.name === selectedHotelName) || hotelOptions[0];
      if (selectedHotelObj) {
        hotelsCost += selectedHotelObj.price * 3; // 3 nights
      }
    });

    // 3. Activity Costs
    let activitiesCost = 0;
    allStops.forEach(city => {
      const activeList = activitySelections[city] || [];
      const options = activityDatabase[city] || [];
      activeList.forEach(actName => {
        const actObj = options.find(o => o.name === actName);
        if (actObj) {
          activitiesCost += actObj.price;
        }
      });
    });

    // 4. Visa costs: Standard Schengen/US visa fees if included
    let visaCost = 0;
    allStops.forEach(city => {
      const matchingPkg = packagesData.find(p => p.stops.includes(city));
      if (matchingPkg) {
        visaCost += matchingPkg.visaCost;
      }
    });

    const grandTotal = flightsCost + hotelsCost + activitiesCost + visaCost;

    setCosts({
      flights: flightsCost,
      hotels: hotelsCost,
      activities: activitiesCost,
      visas: visaCost,
      total: grandTotal
    });

  }, [startPoint, stops, hotelSelections, activitySelections]);

  const handleAddStop = () => {
    if (selectedCityToAdd && !stops.includes(selectedCityToAdd) && selectedCityToAdd !== startPoint) {
      setStops([...stops, selectedCityToAdd]);
    }
  };

  const handleRemoveStop = (cityToRemove) => {
    setStops(stops.filter(c => c !== cityToRemove));
  };

  const handleToggleActivity = (city, actName) => {
    const activeList = activitySelections[city] || [];
    let newList;
    if (activeList.includes(actName)) {
      newList = activeList.filter(item => item !== actName);
    } else {
      newList = [...activeList, actName];
    }
    setActivitySelections({
      ...activitySelections,
      [city]: newList
    });
  };

  const handleSavePlan = () => {
    saveCustomTrip({
      name: tripName,
      startPoint,
      stops,
      hotels: hotelSelections,
      activities: activitySelections,
      costs,
      travelDate
    });

    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#3b82f6", "#10b981"]
    });

    alert("Trip Plan Saved Successfully to Wishlist!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
      {/* Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Multi-City Trip Planner</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">Design personalized stops, select lodging, check activities, and track live totals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Selections */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Details Input Card */}
          <div className="glass-card p-6 border border-white/50 shadow-xl space-y-5">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
              <FiSettings className="w-4 h-4 text-blue-600" />
              <span>Trip Configuration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Trip Name</label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Starting From</label>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {citiesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Route Stops selector controls */}
            <div className="pt-4 border-t border-slate-100/60 text-xs">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Build Routing Stops</label>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <FiMapPin className="w-3.5 h-3.5" />
                  <span>{startPoint} (Start)</span>
                </div>

                {stops.map((city, idx) => (
                  <div key={city} className="bg-slate-100 border border-slate-200 text-slate-700 font-bold pl-3 pr-1.5 py-1.5 rounded-xl flex items-center space-x-1">
                    <span>{city}</span>
                    <button
                      onClick={() => handleRemoveStop(city)}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 rounded-full"
                    >
                      <FiTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 max-w-xs">
                <select
                  value={selectedCityToAdd}
                  onChange={(e) => setSelectedCityToAdd(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white flex-1"
                >
                  {citiesList
                    .filter(c => c !== startPoint && !stops.includes(c))
                    .map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition flex items-center space-x-1"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive fall-back routing visualizer */}
          <MapComponent
            stops={[startPoint, ...stops]}
            onAddStop={(c) => {
              if (c !== startPoint && !stops.includes(c)) setStops([...stops, c]);
            }}
            onRemoveStop={handleRemoveStop}
            isInteractive={true}
          />

          {/* 3. STEP BY STEP TIMELINE (Hotels & Activities Planner) */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
              <FiList className="w-4 h-4 text-blue-600" />
              <span>Itinerary Timeline & Planner</span>
            </h3>

            <div className="relative pl-6 border-l-2 border-dashed border-slate-300 space-y-8">
              
              {/* Departure Node */}
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-blue-600 border border-white shadow-md flex items-center justify-center text-white text-[9px] font-extrabold">
                  D
                </span>
                <div className="glass-card-no-hover p-4 border border-white/50 shadow-md">
                  <h4 className="font-extrabold text-xs text-slate-700 flex items-center space-x-1.5">
                    <span>Departure from {startPoint}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">Starting point of customized multi-city itinerary. Travel dates set for {travelDate}.</p>
                </div>
              </div>

              {/* Stop Nodes (Timeline content) */}
              {stops.map((city, idx) => {
                const hotels = hotelDatabase[city] || [];
                const acts = activityDatabase[city] || [];
                const selectedHotelName = hotelSelections[city] || hotels[0]?.name;
                const activeActs = activitySelections[city] || [];

                return (
                  <div key={city} className="relative">
                    
                    {/* Index marker */}
                    <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-slate-800 border border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                      {idx + 1}
                    </span>

                    <div className="glass-card-no-hover p-5 border border-white/50 shadow-md space-y-4">
                      
                      {/* Title */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-800 flex items-center space-x-1.5">
                            <FiMapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>Stop {idx + 1}: {city}</span>
                          </h4>
                          <p className="text-[10px] text-slate-400">Duration: 3 Nights (Allocated standard booking duration)</p>
                        </div>
                        <button
                          onClick={() => handleRemoveStop(city)}
                          className="text-[10px] font-extrabold text-red-500 hover:underline"
                        >
                          Remove Destination
                        </button>
                      </div>

                      {/* Hotel selector */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Premium Hotel Lodging</label>
                          <select
                            value={selectedHotelName}
                            onChange={(e) => setHotelSelections({
                              ...hotelSelections,
                              [city]: e.target.value
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                          >
                            {hotels.map(h => (
                              <option key={h.name} value={h.name}>
                                {h.name} ({formatPrice(h.price)}/night)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Activities Checklist */}
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Excursion Activities</label>
                          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                            {acts.map(act => (
                              <label key={act.name} className="flex items-center space-x-2.5 cursor-pointer select-none text-[11px] font-medium text-slate-600 hover:text-slate-800">
                                <input
                                  type="checkbox"
                                  checked={activeActs.includes(act.name)}
                                  onChange={() => handleToggleActivity(city, act.name)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300"
                                />
                                <span>{act.name} (+{formatPrice(act.price)})</span>
                              </label>
                            ))}
                            {acts.length === 0 && (
                              <p className="text-[10px] text-slate-400 italic">No excursions listed for {city}.</p>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Bill Breakdown / Saved plans list */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Bill Calculator Card */}
          <div className="glass-card p-6 border border-white/50 shadow-xl space-y-5 sticky top-24">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2 uppercase tracking-wider">
              <FiBriefcase className="w-4 h-4 text-blue-600" />
              <span>Cost Calculator</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Connecting Flights ({stops.length} legs)</span>
                <span className="font-bold text-slate-800">{formatPrice(costs.flights)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Accommodations Stays</span>
                <span className="font-bold text-slate-800">{formatPrice(costs.hotels)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Selected Excursions</span>
                <span className="font-bold text-slate-800">{formatPrice(costs.activities)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Visa & Processing Fees</span>
                <span className="font-bold text-slate-800">{formatPrice(costs.visas)}</span>
              </div>

              <div className="border-t border-slate-200/60 my-3"></div>

              <div className="flex justify-between items-center font-bold text-slate-800">
                <span className="text-sm">Grand Total Estimate</span>
                <span className="text-blue-600 font-extrabold text-lg">{formatPrice(costs.total)}</span>
              </div>
            </div>

            <button
              onClick={handleSavePlan}
              disabled={stops.length === 0}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-blue-500/10 text-white font-bold rounded-2xl text-xs text-center transition disabled:opacity-50"
            >
              Save Trip Plan
            </button>
          </div>

          {/* User's Saved Custom Trips List */}
          {customTrips.length > 0 && (
            <div className="glass-card p-5 border border-white/50 shadow-xl space-y-4">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">My Saved Custom Trips</h4>
              <div className="space-y-3.5">
                {customTrips.map(trip => (
                  <div key={trip.id} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-2 relative">
                    <button
                      onClick={() => deleteCustomTrip(trip.id)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500 transition"
                      title="Delete Trip"
                    >
                      <FiTrash className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <h5 className="font-bold text-xs text-slate-800 truncate pr-6">{trip.name}</h5>
                      <p className="text-[10px] text-slate-400">{trip.startPoint} → {trip.stops.join(" → ")}</p>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className="text-blue-600 font-extrabold">{formatPrice(trip.costs.total)}</span>
                      <span className="text-slate-400 font-bold">{trip.travelDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default TripPlanner;
