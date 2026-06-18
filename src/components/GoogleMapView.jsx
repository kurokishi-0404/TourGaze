import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useApp } from "../context/AppContext";

// City coordinates database with lat/lng
const cityCoordinates = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Munnar: { lat: 10.0889, lng: 77.0595 },
  Alleppey: { lat: 9.4981, lng: 76.3388 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Rome: { lat: 41.9028, lng: 12.4964 },
  London: { lat: 51.5074, lng: -0.1278 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Bali: { lat: -8.4095, lng: 115.1889 },
  "New York City": { lat: 40.7128, lng: -74.006 },
};

const attractions = {
  Mumbai: ["Gateway of India", "Marine Drive", "Elephanta Caves"],
  Delhi: ["Red Fort", "Qutub Minar", "India Gate", "Lotus Temple"],
  Agra: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
  Jaipur: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
  Kochi: ["Chinese Fishing Nets", "Mattancherry Palace", "Fort Kochi Beach"],
  Munnar: ["Eravikulam National Park", "Mattupetty Dam", "Tea Museum"],
  Alleppey: ["Vembanad Lake", "Alappuzha Beach", "Houseboat Canals"],
  Dubai: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
  Paris: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Seine River"],
  Rome: ["Colosseum", "Trevi Fountain", "Vatican City", "Pantheon"],
  London: ["Tower Bridge", "London Eye", "Big Ben", "British Museum"],
  Tokyo: [
    "Shibuya Crossing",
    "Senso-ji Temple",
    "Tokyo Tower",
    "TeamLab Planets",
  ],
  Bali: [
    "Uluwatu Temple",
    "Tegallalang Rice Terrace",
    "Nusa Penida Cliffs",
  ],
  "New York City": [
    "Statue of Liberty",
    "Central Park",
    "Times Square",
    "Empire State",
  ],
};

// Directions route renderer using Maps API
const DirectionsRenderer = ({ stops }) => {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true, // We render our own custom markers
      polylineOptions: {
        strokeColor: "#3b82f6",
        strokeOpacity: 0.85,
        strokeWeight: 4,
        geodesic: true,
      },
    });
    setDirectionsRenderer(renderer);
    return () => renderer.setMap(null);
  }, [routesLib, map]);

  useEffect(() => {
    if (!directionsRenderer || !routesLib || stops.length < 2) return;

    const validStops = stops.filter((s) => cityCoordinates[s]);
    if (validStops.length < 2) return;

    const origin = cityCoordinates[validStops[0]];
    const destination = cityCoordinates[validStops[validStops.length - 1]];
    const waypoints = validStops.slice(1, -1).map((city) => ({
      location: cityCoordinates[city],
      stopover: true,
    }));

    const directionsService = new routesLib.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          // If Directions API fails (e.g., overseas routes), draw geodesic polylines instead
          directionsRenderer.setDirections({ routes: [] });
          drawGeodesicPolylines(map, validStops);
        }
      }
    );
  }, [directionsRenderer, routesLib, stops]);

  return null;
};

// Fallback geodesic polylines for overseas/intercontinental routes
const drawGeodesicPolylines = (map, stops) => {
  const validStops = stops.filter((s) => cityCoordinates[s]);
  for (let i = 0; i < validStops.length - 1; i++) {
    const from = cityCoordinates[validStops[i]];
    const to = cityCoordinates[validStops[i + 1]];
    new google.maps.Polyline({
      path: [from, to],
      geodesic: true,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      map,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            strokeColor: "#10b981",
            scale: 3,
          },
          offset: "0",
          repeat: "16px",
        },
      ],
    });
  }
};

// Fit bounds helper
const FitBoundsHelper = ({ stops }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || stops.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    stops.forEach((city) => {
      const coord = cityCoordinates[city];
      if (coord) bounds.extend(coord);
    });
    map.fitBounds(bounds, { padding: 80 });
  }, [map, stops]);

  return null;
};

// Custom marker label component
const MarkerLabel = ({ city, index, isStop, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
      style={{ position: "relative" }}
    >
      {/* Pin container */}
      <div
        className={`
          relative flex items-center justify-center transition-all duration-300
          ${isSelected ? "scale-125" : "group-hover:scale-110"}
        `}
      >
        {/* Outer ring pulse */}
        {isStop && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              width: 36,
              height: 36,
              marginLeft: -6,
              marginTop: -6,
              backgroundColor: "rgba(16, 185, 129, 0.25)",
            }}
          />
        )}

        {/* Main pin */}
        <div
          className={`
            w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold
            shadow-lg border-2
            ${
              isStop
                ? "bg-emerald-500 text-white border-white"
                : "bg-blue-500 text-white border-white/80"
            }
            ${isSelected ? "ring-4 ring-blue-300/50" : ""}
          `}
        >
          {isStop ? index + 1 : "•"}
        </div>
      </div>

      {/* Label */}
      <div
        className={`
          absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap
          text-[10px] font-bold px-1.5 py-0.5 rounded-md
          ${
            isStop
              ? "bg-emerald-500 text-white shadow-md"
              : "bg-white/90 text-slate-700 shadow-sm border border-slate-200/60"
          }
        `}
      >
        {city}
      </div>
    </div>
  );
};

const GoogleMapView = ({
  stops = [],
  allCities = true,
  onCitySelect,
  selectedCity,
  isInteractive = true,
  onAddStop,
  onRemoveStop,
  showDirections = true,
  height = "500px",
}) => {
  const { packages, formatPrice } = useApp();
  const [infoCity, setInfoCity] = useState(null);
  const [apiKeyValid, setApiKeyValid] = useState(true);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "";

  // Check if API key is valid (not placeholder)
  const hasValidKey =
    apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY_HERE" && apiKey.length > 10;

  // Calculate center from stops or default
  const center = useMemo(() => {
    if (stops.length > 0) {
      const validStops = stops.filter((s) => cityCoordinates[s]);
      if (validStops.length > 0) {
        const avgLat =
          validStops.reduce((s, c) => s + cityCoordinates[c].lat, 0) /
          validStops.length;
        const avgLng =
          validStops.reduce((s, c) => s + cityCoordinates[c].lng, 0) /
          validStops.length;
        return { lat: avgLat, lng: avgLng };
      }
    }
    return { lat: 25.0, lng: 55.0 }; // Default: Middle East area
  }, [stops]);

  const citiesToRender = allCities
    ? Object.keys(cityCoordinates)
    : stops.filter((s) => cityCoordinates[s]);

  const handleMarkerClick = (city) => {
    setInfoCity(city);
    if (onCitySelect) onCitySelect(city);
  };

  // Find package corresponding to destination
  const getCityPackage = (cityName) => {
    return (
      packages.find(
        (pkg) => pkg.stops && pkg.stops.includes(cityName)
      ) || packages[0]
    );
  };

  if (!hasValidKey) {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center text-center p-8 space-y-4"
        style={{ minHeight: height }}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-amber-800">
            Google Maps API Key Required
          </h3>
          <p className="text-[11px] text-amber-600 mt-1.5 leading-relaxed max-w-sm">
            Add your API key in{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-mono text-[10px]">
              .env
            </code>{" "}
            file as{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-mono text-[10px]">
              VITE_GOOGLE_MAPS_API_KEY
            </code>
          </p>
        </div>
        <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-700 font-mono max-w-xs">
          VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
          <br />
          VITE_GOOGLE_MAPS_MAP_ID=your_map_id
        </div>
        <p className="text-[10px] text-amber-500 font-medium">
          Get a key at{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-700"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg relative"
      style={{ height }}
    >
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={4}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Auto fit bounds */}
          <FitBoundsHelper
            stops={
              stops.length > 0
                ? stops.filter((s) => cityCoordinates[s])
                : Object.keys(cityCoordinates)
            }
          />

          {/* Directions route polyline */}
          {showDirections && stops.length >= 2 && (
            <DirectionsRenderer stops={stops} />
          )}

          {/* City markers */}
          {citiesToRender.map((city, idx) => {
            const coord = cityCoordinates[city];
            if (!coord) return null;
            const isStop = stops.includes(city);
            const stopIndex = stops.indexOf(city);
            const isSelected = infoCity === city || selectedCity === city;

            return (
              <AdvancedMarker
                key={city}
                position={coord}
                onClick={() => handleMarkerClick(city)}
              >
                <MarkerLabel
                  city={city}
                  index={stopIndex}
                  isStop={isStop}
                  isSelected={isSelected}
                />
              </AdvancedMarker>
            );
          })}

          {/* Info Window */}
          {infoCity && cityCoordinates[infoCity] && (
            <InfoWindow
              position={cityCoordinates[infoCity]}
              onCloseClick={() => setInfoCity(null)}
              pixelOffset={[0, -30]}
            >
              <div className="min-w-[220px] max-w-[280px] p-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">
                      📍 {infoCity}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {cityCoordinates[infoCity].lat.toFixed(4)}°N,{" "}
                      {cityCoordinates[infoCity].lng.toFixed(4)}°E
                    </p>
                  </div>
                  {isInteractive && (
                    <div>
                      {stops.includes(infoCity) ? (
                        <button
                          onClick={() => {
                            if (onRemoveStop) onRemoveStop(infoCity);
                            setInfoCity(null);
                          }}
                          className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold border border-red-200"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onAddStop) onAddStop(infoCity);
                            setInfoCity(null);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[10px] font-bold"
                        >
                          + Add Stop
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Attractions */}
                {attractions[infoCity] && (
                  <div className="mb-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Top Attractions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {attractions[infoCity].map((att) => (
                        <span
                          key={att}
                          className="bg-slate-50 border border-slate-200 rounded text-[9px] px-1.5 py-0.5 font-medium text-slate-600"
                        >
                          {att}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package recommendation */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 mt-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    Recommended Package
                  </p>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">
                    {getCityPackage(infoCity).name}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[11px] font-extrabold text-blue-600">
                      From {formatPrice(getCityPackage(infoCity).price)}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold">
                      ★ {getCityPackage(infoCity).rating}
                    </span>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl px-3 py-2 text-[10px] text-slate-500 space-y-1 shadow-md z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="font-medium">Available Destinations</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium">Route Stops</span>
        </div>
        {showDirections && stops.length >= 2 && (
          <div className="flex items-center space-x-2">
            <span className="w-4 h-0.5 bg-blue-500 rounded" />
            <span className="font-medium">Optimized Route</span>
          </div>
        )}
      </div>

      {/* Floating stop count badge */}
      {stops.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl px-3 py-1.5 shadow-md z-10 flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-700">
            {stops.length} Stop{stops.length > 1 ? "s" : ""} • Google Maps
          </span>
        </div>
      )}
    </div>
  );
};

export { cityCoordinates, attractions };
export default GoogleMapView;
