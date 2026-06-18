/**
 * TourGaze Map Service Layer
 * Free & open-source APIs: Nominatim, OpenRouteService, Overpass
 * Includes request caching and rate limiting
 */

// ─── Cache Layer ───────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// ─── Rate Limiter (Nominatim requires max 1 req/sec) ──────────
let lastNominatimCall = 0;
const nominatimThrottle = () => {
  return new Promise((resolve) => {
    const now = Date.now();
    const wait = Math.max(0, 1100 - (now - lastNominatimCall));
    lastNominatimCall = now + wait;
    setTimeout(resolve, wait);
  });
};

// ─── City Coordinates Database (Instant fallback) ──────────────
export const CITY_COORDS = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Munnar": { lat: 10.0889, lng: 77.0595 },
  "Alleppey": { lat: 9.4981, lng: 76.3388 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Abu Dhabi": { lat: 24.4539, lng: 54.3773 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Rome": { lat: 41.9028, lng: 12.4964 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Kyoto": { lat: 35.0116, lng: 135.7681 },
  "Bali": { lat: -8.4095, lng: 115.1889 },
  "New York City": { lat: 40.7128, lng: -74.0060 },
  "Boston": { lat: 42.3601, lng: -71.0589 },
  "Zurich": { lat: 47.3769, lng: 8.5417 },
  "Interlaken": { lat: 46.6863, lng: 7.8632 },
  "Zermatt": { lat: 46.0207, lng: 7.7491 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Bangkok": { lat: 13.7563, lng: 100.5018 },
  "Istanbul": { lat: 41.0082, lng: 28.9784 },
  "Cairo": { lat: 30.0444, lng: 31.2357 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Barcelona": { lat: 41.3874, lng: 2.1686 },
  "Amsterdam": { lat: 52.3676, lng: 4.9041 },
  "Goa": { lat: 15.2993, lng: 74.1240 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Udaipur": { lat: 24.5854, lng: 73.7125 },
};

// ─── Attraction Emojis/Icons by category ───────────────────────
export const POI_CATEGORIES = {
  museum: { emoji: "🏛", label: "Museum", color: "#8b5cf6" },
  monument: { emoji: "📍", label: "Monument", color: "#ef4444" },
  park: { emoji: "🌳", label: "Park", color: "#10b981" },
  hotel: { emoji: "🏨", label: "Hotel", color: "#3b82f6" },
  restaurant: { emoji: "🍽", label: "Restaurant", color: "#f59e0b" },
  shopping: { emoji: "🛍", label: "Shopping", color: "#ec4899" },
  temple: { emoji: "⛩", label: "Temple", color: "#dc2626" },
  beach: { emoji: "🏖", label: "Beach", color: "#06b6d4" },
  viewpoint: { emoji: "🔭", label: "Viewpoint", color: "#8b5cf6" },
  default: { emoji: "📌", label: "Place", color: "#64748b" },
};

// ─── 1. Nominatim Geocoding ────────────────────────────────────
/**
 * Geocode a city name to coordinates using Nominatim (OSM)
 * Falls back to local database if API fails
 */
export const geocodeCity = async (cityName) => {
  // Check local database first (instant)
  const local = CITY_COORDS[cityName];
  if (local) return { lat: local.lat, lng: local.lng, displayName: cityName, source: "local" };

  // Check cache
  const cacheKey = `geo:${cityName.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await nominatimThrottle();
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1`,
      { headers: { "User-Agent": "TourGaze/1.0 (travel-platform)" } }
    );
    const data = await res.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        source: "nominatim",
      };
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("Nominatim geocoding failed, using fallback:", err);
  }

  // Ultimate fallback
  return local || { lat: 20.5937, lng: 78.9629, displayName: cityName, source: "fallback" };
};

/**
 * Search city suggestions using Nominatim
 */
export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  const cacheKey = `search:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    await nominatimThrottle();
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1&featuretype=city`,
      { headers: { "User-Agent": "TourGaze/1.0 (travel-platform)" } }
    );
    const data = await res.json();
    const results = data.map((d) => ({
      name: d.display_name.split(",")[0],
      fullName: d.display_name,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      country: d.address?.country || "",
    }));
    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.warn("City search failed:", err);
    return [];
  }
};

// ─── 2. OpenRouteService Routing ───────────────────────────────
/**
 * Get route between waypoints using OpenRouteService
 * Returns GeoJSON LineString, distance, and duration
 */
export const getRoute = async (waypoints) => {
  if (!waypoints || waypoints.length < 2) return null;

  const coords = waypoints.map((wp) => [wp.lng, wp.lat]);
  const cacheKey = `route:${JSON.stringify(coords)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

  // If no API key, generate a straight-line geodesic route
  if (!apiKey || apiKey === "YOUR_ORS_KEY_HERE") {
    return generateGeodesicRoute(waypoints);
  }

  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ coordinates: coords }),
      }
    );
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const summary = feature.properties.summary;
      const result = {
        geometry: feature.geometry,
        distance: summary.distance, // meters
        duration: summary.duration, // seconds
        distanceKm: Math.round(summary.distance / 1000),
        durationHours: (summary.duration / 3600).toFixed(1),
        source: "openrouteservice",
        segments: feature.properties.segments || [],
      };
      setCache(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("OpenRouteService failed, using geodesic fallback:", err);
  }

  return generateGeodesicRoute(waypoints);
};

/**
 * Generate geodesic (great-circle) route as fallback
 * Creates smooth curved paths between waypoints
 */
const generateGeodesicRoute = (waypoints) => {
  const coordinates = [];
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i];
    const end = waypoints[i + 1];
    
    // Generate intermediate points along great circle
    const steps = 64;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const lat1 = (start.lat * Math.PI) / 180;
      const lng1 = (start.lng * Math.PI) / 180;
      const lat2 = (end.lat * Math.PI) / 180;
      const lng2 = (end.lng * Math.PI) / 180;
      
      const d = 2 * Math.asin(
        Math.sqrt(
          Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng2 - lng1) / 2), 2)
        )
      );
      
      if (d === 0) {
        coordinates.push([start.lng, start.lat]);
        continue;
      }
      
      const A = Math.sin((1 - t) * d) / Math.sin(d);
      const B = Math.sin(t * d) / Math.sin(d);
      
      const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
      const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);
      
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * (180 / Math.PI);
      const lng = Math.atan2(y, x) * (180 / Math.PI);
      
      coordinates.push([lng, lat]);
    }
  }

  // Calculate Haversine total distance
  let totalDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDist += haversineDistance(waypoints[i], waypoints[i + 1]);
  }

  return {
    geometry: {
      type: "LineString",
      coordinates,
    },
    distance: totalDist * 1000,
    duration: (totalDist / 850) * 3600, // 850 km/h average
    distanceKm: Math.round(totalDist),
    durationHours: (totalDist / 850).toFixed(1),
    source: "geodesic",
  };
};

/**
 * Haversine distance between two points in km
 */
export const haversineDistance = (p1, p2) => {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── 3. Overpass API — Attraction Discovery ────────────────────
/**
 * Fetch nearby attractions around coordinates using Overpass API
 */
export const fetchAttractions = async (lat, lng, radiusMeters = 5000) => {
  const cacheKey = `pois:${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const query = `
    [out:json][timeout:15];
    (
      node["tourism"="museum"](around:${radiusMeters},${lat},${lng});
      node["tourism"="attraction"](around:${radiusMeters},${lat},${lng});
      node["historic"="monument"](around:${radiusMeters},${lat},${lng});
      node["leisure"="park"](around:${radiusMeters},${lat},${lng});
      node["tourism"="viewpoint"](around:${radiusMeters},${lat},${lng});
      node["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
      node["shop"="mall"](around:${radiusMeters},${lat},${lng});
    );
    out body 40;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
    });
    const data = await res.json();

    const results = (data.elements || [])
      .filter((el) => el.tags && el.tags.name)
      .map((el) => {
        const category = categorizeOSMNode(el.tags);
        return {
          id: el.id,
          name: el.tags.name,
          lat: el.lat,
          lng: el.lon,
          category,
          ...POI_CATEGORIES[category],
          tags: el.tags,
        };
      })
      .slice(0, 30); // Limit to 30 POIs

    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.warn("Overpass API failed:", err);
    return [];
  }
};

/**
 * Categorize an OSM node into our POI category system
 */
const categorizeOSMNode = (tags) => {
  if (tags.tourism === "museum") return "museum";
  if (tags.historic === "monument" || tags.tourism === "attraction") return "monument";
  if (tags.leisure === "park" || tags.leisure === "garden") return "park";
  if (tags.tourism === "hotel") return "hotel";
  if (tags.amenity === "restaurant" || tags.amenity === "cafe") return "restaurant";
  if (tags.shop === "mall" || tags.shop) return "shopping";
  if (tags.amenity === "place_of_worship") return "temple";
  if (tags.natural === "beach") return "beach";
  if (tags.tourism === "viewpoint") return "viewpoint";
  return "default";
};

// ─── 4. Heatmap Data (Pre-computed popular destination density) ─
export const getHeatmapData = () => {
  // Pre-computed popularity weights for known destinations
  return Object.entries(CITY_COORDS).map(([name, coords]) => {
    const popularity = {
      Paris: 95, Tokyo: 92, Dubai: 90, London: 88, Rome: 85,
      "New York City": 93, Bali: 82, Mumbai: 78, Delhi: 75,
      Bangkok: 88, Singapore: 86, Istanbul: 80, Sydney: 84,
      Barcelona: 83, Amsterdam: 81, Jaipur: 72, Agra: 85,
      Kochi: 65, Goa: 70, Varanasi: 68, Udaipur: 66,
    };
    return {
      lat: coords.lat,
      lng: coords.lng,
      weight: (popularity[name] || 50) / 100,
      name,
    };
  });
};

// ─── 5. Trip Cost & Carbon Estimator ───────────────────────────
export const estimateTripCost = (distanceKm, stops) => {
  const flightCostPerKm = 0.12; // USD per km average
  const hotelPerNight = 120; // USD average
  const nightsPerStop = 3;
  const foodPerDay = 50; // USD average
  const miscPerDay = 30;

  const flightCost = distanceKm * flightCostPerKm;
  const hotelCost = stops * nightsPerStop * hotelPerNight;
  const foodCost = stops * nightsPerStop * foodPerDay;
  const miscCost = stops * nightsPerStop * miscPerDay;
  const total = flightCost + hotelCost + foodCost + miscCost;

  return {
    flights: Math.round(flightCost),
    hotels: Math.round(hotelCost),
    food: Math.round(foodCost),
    misc: Math.round(miscCost),
    total: Math.round(total),
  };
};

export const estimateCarbonFootprint = (distanceKm) => {
  // Average air travel: ~0.255 kg CO2 per passenger-km
  const carbonKg = distanceKm * 0.255;
  return {
    kg: Math.round(carbonKg),
    tons: (carbonKg / 1000).toFixed(2),
    treesNeeded: Math.ceil(carbonKg / 22), // ~22kg CO2 per tree per year
  };
};
