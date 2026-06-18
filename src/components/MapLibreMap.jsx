import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CITY_COORDS, getHeatmapData } from "../services/mapService";

// Dark premium map style (free OpenStreetMap tiles with dark styling)
const DARK_STYLE = {
  version: 8,
  name: "TourGaze Dark",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const LIGHT_STYLE = {
  version: 8,
  name: "TourGaze Light",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const MapLibreMap = ({
  stops = [],
  routeGeoJSON = null,
  attractions = [],
  selectedCity = null,
  onCityClick,
  onMapClick,
  isInteractive = true,
  showHeatmap = false,
  showAllCities = true,
  darkMode = true,
  height = "600px",
  className = "",
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const attractionMarkersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate center from stops
  const center = useMemo(() => {
    const cities = stops.length > 0 ? stops : Object.keys(CITY_COORDS).slice(0, 5);
    const validCoords = cities.map(c => CITY_COORDS[c]).filter(Boolean);
    if (validCoords.length === 0) return [55, 25];
    const avgLng = validCoords.reduce((s, c) => s + c.lng, 0) / validCoords.length;
    const avgLat = validCoords.reduce((s, c) => s + c.lat, 0) / validCoords.length;
    return [avgLng, avgLat];
  }, [stops]);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: darkMode ? DARK_STYLE : LIGHT_STYLE,
      center: center,
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: true,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.ScaleControl(), "bottom-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update city markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const citiesToShow = showAllCities ? Object.keys(CITY_COORDS) : stops;

    citiesToShow.forEach((cityName) => {
      const coords = CITY_COORDS[cityName];
      if (!coords) return;

      const isStop = stops.includes(cityName);
      const stopIndex = stops.indexOf(cityName);
      const isSelected = selectedCity === cityName;

      // Create wrapper element for MapLibre positioning
      const wrapper = document.createElement("div");
      wrapper.style.width = isStop ? "32px" : "24px";
      wrapper.style.height = isStop ? "32px" : "24px";

      // Create inner visual marker
      const el = document.createElement("div");
      el.className = "maplibre-city-marker";
      el.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isStop ? "11px" : "9px"};
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, box-shadow 0.2s;
        ${isStop
          ? `background: #10b981; color: white; border: 3px solid white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.4);`
          : `background: ${isSelected ? "#3b82f6" : "rgba(59, 130, 246, 0.8)"}; color: white; border: 2px solid rgba(255,255,255,0.6); box-shadow: 0 2px 8px rgba(0,0,0,0.3);`
        }
        ${isSelected ? "transform: scale(1.3); z-index: 10;" : "transform: scale(1);"}
      `;
      el.textContent = isStop ? (stopIndex + 1).toString() : "•";
      wrapper.appendChild(el);

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.25)";
        el.style.zIndex = "10";
      });
      el.addEventListener("mouseleave", () => {
        if (!isSelected) {
          el.style.transform = "scale(1)";
          el.style.zIndex = "1";
        }
      });

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        closeOnClick: false,
        className: "maplibre-city-popup pointer-events-none",
      }).setHTML(`
        <div style="font-family: Inter, sans-serif; padding: 4px 0;">
          <div style="font-weight: 800; font-size: 13px; color: ${darkMode ? '#fff' : '#1e293b'};">${cityName}</div>
          <div style="font-size: 10px; color: ${darkMode ? '#94a3b8' : '#64748b'}; margin-top: 2px;">
            ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E
          </div>
          ${isStop ? `<div style="font-size: 10px; color: #10b981; font-weight: 700; margin-top: 4px;">Route Stop #${stopIndex + 1}</div>` : ""}
        </div>
      `);

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener("click", () => {
        if (onCityClick) onCityClick(cityName);
      });

      el.addEventListener("mouseenter", () => popup.addTo(map.current));
      el.addEventListener("mouseleave", () => popup.remove());

      markersRef.current.push(marker);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stops.join(','), selectedCity, showAllCities, darkMode]);

  // Update route line
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing route layers/sources
    if (map.current.getLayer("route-line")) map.current.removeLayer("route-line");
    if (map.current.getLayer("route-glow")) map.current.removeLayer("route-glow");
    if (map.current.getLayer("route-dash")) map.current.removeLayer("route-dash");
    if (map.current.getSource("route")) map.current.removeSource("route");

    if (!routeGeoJSON || !routeGeoJSON.coordinates || routeGeoJSON.coordinates.length < 2) return;

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: routeGeoJSON,
      },
    });

    // Glow effect layer
    map.current.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 8,
        "line-opacity": 0.2,
        "line-blur": 4,
      },
    });

    // Main route line
    map.current.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 3.5,
        "line-opacity": 0.9,
      },
    });

    // Dashed overlay for animation effect
    map.current.addLayer({
      id: "route-dash",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#38bdf8",
        "line-width": 2,
        "line-dasharray": [2, 4],
        "line-opacity": 0.7,
      },
    });

    // Animate dash
    let dashOffset = 0;
    const animateDash = () => {
      dashOffset -= 0.5;
      if (map.current && map.current.getLayer("route-dash")) {
        map.current.setPaintProperty("route-dash", "line-dasharray", [
          2,
          4,
        ]);
      }
    };
    const interval = setInterval(animateDash, 100);

    return () => clearInterval(interval);
  }, [mapLoaded, routeGeoJSON]);

  // Fit bounds to stops
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const validStops = stops.filter(s => CITY_COORDS[s]);
    if (validStops.length === 0) return;

    if (validStops.length === 1) {
      const c = CITY_COORDS[validStops[0]];
      map.current.flyTo({ center: [c.lng, c.lat], zoom: 10, duration: 0 });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    validStops.forEach(city => {
      const c = CITY_COORDS[city];
      if (c) bounds.extend([c.lng, c.lat]);
    });
    map.current.fitBounds(bounds, { padding: 80, duration: 0, maxZoom: 12 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, stops.join(',')]);

  // Update attraction markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    attractionMarkersRef.current.forEach(m => m.remove());
    attractionMarkersRef.current = [];

    attractions.forEach((poi) => {
      const wrapper = document.createElement("div");
      wrapper.style.width = "28px";
      wrapper.style.height = "28px";

      const el = document.createElement("div");
      el.style.cssText = `
        width: 100%; height: 100%; border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 14px; cursor: pointer;
        background: ${darkMode ? "rgba(30, 41, 59, 0.9)" : "rgba(255,255,255,0.95)"};
        border: 1.5px solid ${poi.color || "#64748b"};
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        transform: scale(1);
      `;
      el.textContent = poi.emoji || "📌";
      wrapper.appendChild(el);

      el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.3)"; el.style.zIndex = "10"; });
      el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; el.style.zIndex = "1"; });

      const popup = new maplibregl.Popup({
        offset: 16,
        closeButton: true,
        className: "maplibre-poi-popup pointer-events-none",
      }).setHTML(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <div style="font-size: 16px; margin-bottom: 4px;">${poi.emoji || "📌"}</div>
          <div style="font-weight: 800; font-size: 12px; color: ${darkMode ? '#fff' : '#1e293b'};">${poi.name}</div>
          <div style="font-size: 10px; color: ${poi.color}; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;">${poi.label || poi.category}</div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: wrapper })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(popup)
        .addTo(map.current);

      attractionMarkersRef.current.push(marker);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, JSON.stringify(attractions), darkMode]);

  // Heatmap layer
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    if (map.current.getLayer("heatmap-layer")) map.current.removeLayer("heatmap-layer");
    if (map.current.getSource("heatmap-data")) map.current.removeSource("heatmap-data");

    if (!showHeatmap) return;

    const heatData = getHeatmapData();
    
    map.current.addSource("heatmap-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: heatData.map(d => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [d.lng, d.lat] },
          properties: { weight: d.weight },
        })),
      },
    });

    map.current.addLayer({
      id: "heatmap-layer",
      type: "heatmap",
      source: "heatmap-data",
      paint: {
        "heatmap-weight": ["get", "weight"],
        "heatmap-intensity": 1.5,
        "heatmap-radius": 60,
        "heatmap-opacity": 0.5,
        "heatmap-color": [
          "interpolate", ["linear"], ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.2, "rgba(16, 185, 129, 0.3)",
          0.4, "rgba(56, 189, 248, 0.5)",
          0.6, "rgba(37, 99, 235, 0.6)",
          0.8, "rgba(99, 102, 241, 0.7)",
          1, "rgba(255, 255, 255, 0.8)",
        ],
      },
    });
  }, [mapLoaded, showHeatmap]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border ${darkMode ? "border-slate-700/50" : "border-slate-200/60"} shadow-2xl ${className}`}
      style={{ height }}
    >
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-400">Loading Map...</span>
          </div>
        </div>
      )}

      {/* Map attribution badge */}
      <div className={`absolute top-3 left-3 ${darkMode ? "bg-slate-900/80 text-slate-400 border-slate-700" : "bg-white/90 text-slate-600 border-slate-200"} backdrop-blur-md border rounded-xl px-3 py-1.5 z-10 flex items-center space-x-2`}>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-bold">
          {stops.length} Stop{stops.length !== 1 ? "s" : ""} • OpenStreetMap
        </span>
      </div>
    </div>
  );
};

export default MapLibreMap;
